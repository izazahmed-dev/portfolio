"use client";

/**
 * LiquidCursor — GPU height-field water over paper.
 *
 * What this actually is
 * ---------------------
 * A damped 2D wave equation (linearised shallow water), NOT Navier–Stokes:
 *
 *     d²h/dt² = c² ∇²h − γ · dh/dt + pointerImpulse
 *
 * Explicit semi-implicit Euler on a ping-pong RG16F texture (R = height h,
 * G = velocity v):
 *
 *     v ← (v + k·∇²h) · damping        k = c²·dt²/dx²  (stable for k < 0.5)
 *     h ← h + v
 *
 * Stored in two textures (previous / current) that are swapped every step.
 * Nothing is read back from the GPU.
 *
 * What is approximated (DOM limitation)
 * -------------------------------------
 * A canvas cannot refract ordinary HTML. So the overlay is composited with
 * `mix-blend-mode: overlay`, which leaves pure black ink / pure white text
 * unchanged, and it draws: slope shading, a restrained specular, a warm red
 * reflection in troughs, and faint ledger hairlines that visibly bend with the
 * surface (the "refracted background"). Portrait / document plates marked
 * `data-water-plate` are nudged ≤ 2.5px with the CSS `translate` property by a
 * small CPU model of the same travelling wavefront (no GPU readback).
 */

import { useEffect, useRef } from "react";

/* ------------------------------------------------------------------ tunables */

const CFG = {
  maxSimDesktop: 512,
  maxSimMedium: 384,
  maxDpr: 1.5,
  maxCanvasPixels: 1_800_000,
  waveK: 0.42, // c²·dt²/dx² — must stay < 0.5
  damping: 0.9975, // per 1/120 s step → ~2.3 s half-life
  simStep: 1 / 120,
  maxStepsPerFrame: 4,
  fadeMs: 900,
  maxImpulses: 16,
  maxAmp: 0.09, // hard bound on any single impulse
  zoneFeatherPx: 28,
  bump: 14, // height gradient → normal scale
  refractPx: 16, // how far the hairlines bend
  gridPx: 32,
  plateGain: 28,
  plateMaxPx: 2.5,
  historySize: 16,
} as const;

const MAX_ZONES = 4;
const MAX_IMP = CFG.maxImpulses;

/* ------------------------------------------------------------------- shaders */

const VERT = `#version 300 es
out vec2 vUv;
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  vUv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

const STEP_FRAG = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 o;
uniform sampler2D uState;
uniform vec2 uTexel;
uniform float uK;
uniform float uDamp;
uniform int uCount;
uniform vec4 uImpA[${MAX_IMP}]; // xy = uv, z = radius (cells), w = strength
uniform vec2 uImpB[${MAX_IMP}]; // unit direction of travel (GL space)

void main() {
  vec2 s = texture(uState, vUv).rg;
  float h = s.r;
  float v = s.g;
  float hl = texture(uState, vUv - vec2(uTexel.x, 0.0)).r;
  float hr = texture(uState, vUv + vec2(uTexel.x, 0.0)).r;
  float hd = texture(uState, vUv - vec2(0.0, uTexel.y)).r;
  float hu = texture(uState, vUv + vec2(0.0, uTexel.y)).r;
  float lap = hl + hr + hd + hu - 4.0 * h;

  // absorbing rim so the viewport edge does not slosh forever
  float edge = min(min(vUv.x, vUv.y), min(1.0 - vUv.x, 1.0 - vUv.y));
  float damp = uDamp * mix(0.94, 1.0, smoothstep(0.0, 0.03, edge));

  v = (v + uK * lap) * damp;
  h += v;

  for (int i = 0; i < ${MAX_IMP}; i++) {
    if (i >= uCount) break;
    vec4 a = uImpA[i];
    vec2 dc = (vUv - a.xy) / uTexel;           // offset in cells
    float g = exp(-dot(dc, dc) / (a.z * a.z)); // narrow gaussian → sharp crest
    float dip = dot(dc, uImpB[i]) / a.z;       // dipole → directional wake
    h -= a.w * g;                              // finger presses a dimple in
    v += a.w * 0.25 * dip * g;
  }

  // bounded energy
  h = clamp(h, -0.6, 0.6);
  v = clamp(v, -0.2, 0.2);
  if (abs(h) < 2e-5 && abs(v) < 2e-5) { h = 0.0; v = 0.0; }
  o = vec4(h, v, 0.0, 1.0);
}`;

const DRAW_FRAG = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 o;
uniform sampler2D uState;
uniform vec2 uTexel;
uniform vec2 uView;               // viewport, css px
uniform vec4 uZones[${MAX_ZONES}];// x0,y0,x1,y1 css px, origin bottom-left
uniform int uZoneCount;
uniform float uFade, uDark, uBump, uRefract, uGrid, uFeather;
uniform vec3 uAccent;

float zoneMask(vec2 p) {
  float m = 0.0;
  for (int i = 0; i < ${MAX_ZONES}; i++) {
    if (i >= uZoneCount) break;
    vec4 z = uZones[i];
    vec2 d = min(p - z.xy, z.zw - p);
    m = max(m, smoothstep(0.0, uFeather, min(d.x, d.y)));
  }
  return m;
}

void main() {
  vec2 p = vUv * uView;
  float mask = zoneMask(p) * uFade;
  if (mask < 0.002) { o = vec4(0.0); return; }

  float h  = texture(uState, vUv).r;
  float hl = texture(uState, vUv - vec2(uTexel.x, 0.0)).r;
  float hr = texture(uState, vUv + vec2(uTexel.x, 0.0)).r;
  float hd = texture(uState, vUv - vec2(0.0, uTexel.y)).r;
  float hu = texture(uState, vUv + vec2(0.0, uTexel.y)).r;
  vec2 grad = vec2(hr - hl, hu - hd) * uBump;
  float sl = length(grad);
  if (sl < 0.004 && abs(h) < 0.004) { o = vec4(0.0); return; }

  vec3 n = normalize(vec3(-grad, 1.0));
  vec3 L = normalize(vec3(-0.45, 0.55, 0.70));
  vec3 H = normalize(L + vec3(0.0, 0.0, 1.0));
  float diff = dot(n, L) - L.z;                       // 0 on flat water
  float spec = max(pow(max(dot(n, H), 0.0), 60.0) - pow(H.z, 60.0), 0.0);

  // refracted ledger hairlines: only visible where the surface is tilted
  vec2 q = (p + grad * uRefract) / uGrid;
  vec2 f = 0.5 - abs(fract(q) - 0.5);                 // 0 on a line
  float line = 1.0 - smoothstep(0.0, 1.3, min(f.x, f.y) * uGrid);
  float lineA = line * smoothstep(0.01, 0.12, sl);

  float trough = smoothstep(0.0, 0.06, -h);

  vec3 ink   = vec3(0.07, 0.06, 0.05);
  vec3 paper = vec3(1.00, 0.96, 0.88);
  vec3 lc    = mix(ink, paper, uDark);

  float aSh  = max(-diff, 0.0) * 2.2 * 0.55;
  float aHi  = (max(diff, 0.0) * 1.6 + spec * 1.2) * 0.6 * mix(0.7, 1.0, uDark);
  float aAcc = trough * 0.40 * mix(1.0, 1.4, uDark);
  float aLn  = lineA * 0.45;

  vec3 col = ink * aSh + paper * aHi + uAccent * aAcc + lc * aLn;
  float a = aSh + aHi + aAcc + aLn;
  if (a > 0.7) { col *= 0.7 / a; a = 0.7; }
  o = vec4(col * mask, a * mask);       // premultiplied
}`;

/* --------------------------------------------------------------------- types */

type Mode = "off" | "gl" | "css";

interface Plate {
  el: HTMLElement;
  cx: number;
  cy: number;
}
interface Zone {
  el: HTMLElement;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}
interface Programs {
  vao: WebGLVertexArrayObject;
  step: WebGLProgram;
  draw: WebGLProgram;
  us: Record<string, WebGLUniformLocation | null>;
  ud: Record<string, WebGLUniformLocation | null>;
}
interface Targets {
  tex: [WebGLTexture, WebGLTexture];
  fbo: [WebGLFramebuffer, WebGLFramebuffer];
  w: number;
  h: number;
  read: 0 | 1;
}

/* ------------------------------------------------------------------- helpers */

function compile(gl: WebGL2RenderingContext, type: number, src: string): WebGLShader {
  const s = gl.createShader(type);
  if (!s) throw new Error("createShader failed");
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(s);
    gl.deleteShader(s);
    throw new Error(`shader: ${log ?? "unknown"}`);
  }
  return s;
}

function link(gl: WebGL2RenderingContext, fragSrc: string): WebGLProgram {
  const vs = compile(gl, gl.VERTEX_SHADER, VERT);
  const fs = compile(gl, gl.FRAGMENT_SHADER, fragSrc);
  const p = gl.createProgram();
  if (!p) throw new Error("createProgram failed");
  gl.attachShader(p, vs);
  gl.attachShader(p, fs);
  gl.linkProgram(p);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(p);
    gl.deleteProgram(p);
    throw new Error(`link: ${log ?? "unknown"}`);
  }
  return p;
}

function locs(gl: WebGL2RenderingContext, p: WebGLProgram, names: string[]) {
  const out: Record<string, WebGLUniformLocation | null> = {};
  for (const n of names) out[n] = gl.getUniformLocation(p, n);
  return out;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/* ----------------------------------------------------------------- component */

export default function LiquidCursor({ idleMs = 3500 }: { idleMs?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const sheen = sheenRef.current;
    if (!canvas || !sheen) return;
    const root = document.documentElement;

    /* ---- state (all mutable, none of it React state) ---- */
    let mode: Mode = "off";
    let glFailed = false;
    let gl: WebGL2RenderingContext | null = null;
    let progs: Programs | null = null;
    let targets: Targets | null = null;

    let vw = 1;
    let vh = 1;
    let cellPx = 4;
    let wavePxPerS = 300;
    let resizeDirty = true;
    let rectDirty = true;

    let zones: Zone[] = [];
    let plates: Plate[] = [];
    const plateVals = new WeakMap<HTMLElement, { dx: number; dy: number }>();
    let visibleZones: Zone[] = [];

    let dark = 0;
    let accent: [number, number, number] = [0.6, 0.23, 0.19];

    // bounded impulse queue (uploaded + cleared once per frame)
    const pendA = new Float32Array(MAX_IMP * 4);
    const pendB = new Float32Array(MAX_IMP * 2);
    let pendCount = 0;

    // history for CPU plate model (ring)
    const hist = new Float32Array(CFG.historySize * 4); // x, y, strength, t(ms)
    let histHead = 0;

    const ptr = {
      inside: false,
      zone: null as Zone | null,
      x: 0,
      y: 0,
      t: 0,
      vx: 0,
      vy: 0,
      lastActive: -1e9,
      dirty: false,
    };

    let running = false;
    let raf = 0;
    let last = 0;
    let acc = 0;
    let modalCheckAt = 0;
    let modalOpen = false;

    /* ---- media queries ---- */
    const mqReduce = matchMedia("(prefers-reduced-motion: reduce)");
    const mqCoarse = matchMedia("(pointer: coarse)");
    const mqNoHover = matchMedia("(hover: none)");
    const mqSmall = matchMedia("(max-width: 767px)");
    const mqMedium = matchMedia("(max-width: 1279px)");
    const mqDark = matchMedia("(prefers-color-scheme: dark)");

    /* ---- theme ---- */
    const probe = document.createElement("canvas");
    probe.width = probe.height = 1;
    const pctx = probe.getContext("2d", { willReadFrequently: true });
    const cssRgba = (css: string): [number, number, number, number] | null => {
      if (!pctx || !css) return null;
      pctx.clearRect(0, 0, 1, 1);
      pctx.fillStyle = "#000";
      pctx.fillStyle = css;
      pctx.fillRect(0, 0, 1, 1);
      const d = pctx.getImageData(0, 0, 1, 1).data;
      return [(d[0] ?? 0) / 255, (d[1] ?? 0) / 255, (d[2] ?? 0) / 255, (d[3] ?? 0) / 255];
    };
    const readTheme = () => {
      const bodyBg = document.body ? cssRgba(getComputedStyle(document.body).backgroundColor) : null;
      const rootBg = cssRgba(getComputedStyle(root).backgroundColor);
      const bg = bodyBg && bodyBg[3] > 0.5 ? bodyBg : rootBg && rootBg[3] > 0.5 ? rootBg : null;
      if (bg) {
        const lum = 0.2126 * bg[0] + 0.7152 * bg[1] + 0.0722 * bg[2];
        dark = lum < 0.4 ? 1 : 0;
      } else {
        dark = mqDark.matches ? 1 : 0;
      }
      const a = cssRgba(getComputedStyle(root).getPropertyValue("--water-accent").trim());
      if (a && a[3] > 0.5) accent = [a[0], a[1], a[2]];
    };

    /* ---- zones / rects ---- */
    const refreshRects = () => {
      rectDirty = false;
      zones = Array.from(document.querySelectorAll<HTMLElement>("[data-water-zone]")).map((el) => {
        const r = el.getBoundingClientRect();
        return { el, x0: r.left, y0: r.top, x1: r.right, y1: r.bottom };
      });
      visibleZones = zones.filter((z) => z.y1 > 0 && z.y0 < vh && z.x1 > 0 && z.x0 < vw);
      const next: Plate[] = [];
      for (const z of visibleZones) {
        z.el.querySelectorAll<HTMLElement>("[data-water-plate]").forEach((el) => {
          const r = el.getBoundingClientRect();
          next.push({ el, cx: (r.left + r.right) / 2, cy: (r.top + r.bottom) / 2 });
        });
      }
      plates = next;
    };

    const zoneAt = (x: number, y: number): Zone | null => {
      for (const z of visibleZones) if (x >= z.x0 && x <= z.x1 && y >= z.y0 && y <= z.y1) return z;
      return null;
    };

    /* ---- GL lifecycle ---- */
    const ensureGL = (): boolean => {
      if (progs) return true;
      if (!gl) {
        gl = canvas.getContext("webgl2", {
          alpha: true,
          premultipliedAlpha: true,
          antialias: false,
          depth: false,
          stencil: false,
          powerPreference: "low-power",
        });
      }
      if (!gl || gl.isContextLost()) return false;
      if (!gl.getExtension("EXT_color_buffer_float")) return false;
      try {
        const vao = gl.createVertexArray();
        if (!vao) return false;
        const step = link(gl, STEP_FRAG);
        const draw = link(gl, DRAW_FRAG);
        progs = {
          vao,
          step,
          draw,
          us: locs(gl, step, ["uState", "uTexel", "uK", "uDamp", "uCount", "uImpA", "uImpB"]),
          ud: locs(gl, draw, [
            "uState", "uTexel", "uView", "uZones", "uZoneCount", "uFade", "uDark",
            "uBump", "uRefract", "uGrid", "uFeather", "uAccent",
          ]),
        };
        return true;
      } catch {
        return false;
      }
    };

    const destroyTargets = () => {
      if (!gl || !targets) return;
      gl.deleteTexture(targets.tex[0]);
      gl.deleteTexture(targets.tex[1]);
      gl.deleteFramebuffer(targets.fbo[0]);
      gl.deleteFramebuffer(targets.fbo[1]);
      targets = null;
    };

    const destroyPrograms = () => {
      if (!gl || !progs) return;
      gl.deleteProgram(progs.step);
      gl.deleteProgram(progs.draw);
      gl.deleteVertexArray(progs.vao);
      progs = null;
    };

    const makeTarget = (g: WebGL2RenderingContext, w: number, h: number) => {
      const tex = g.createTexture();
      const fbo = g.createFramebuffer();
      if (!tex || !fbo) throw new Error("target alloc failed");
      g.bindTexture(g.TEXTURE_2D, tex);
      g.texImage2D(g.TEXTURE_2D, 0, g.RG16F, w, h, 0, g.RG, g.HALF_FLOAT, null);
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.LINEAR);
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, g.LINEAR);
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE);
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE);
      g.bindFramebuffer(g.FRAMEBUFFER, fbo);
      g.framebufferTexture2D(g.FRAMEBUFFER, g.COLOR_ATTACHMENT0, g.TEXTURE_2D, tex, 0);
      if (g.checkFramebufferStatus(g.FRAMEBUFFER) !== g.FRAMEBUFFER_COMPLETE) {
        throw new Error("framebuffer incomplete");
      }
      g.clearColor(0, 0, 0, 0);
      g.clear(g.COLOR_BUFFER_BIT);
      return { tex, fbo };
    };

    const clearGL = () => {
      if (!gl || gl.isContextLost()) return;
      if (targets) {
        for (const f of targets.fbo) {
          gl.bindFramebuffer(gl.FRAMEBUFFER, f);
          gl.clearColor(0, 0, 0, 0);
          gl.clear(gl.COLOR_BUFFER_BIT);
        }
      }
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
    };

    /** Viewport, canvas backing size and simulation grid. Cheap when nothing changed. */
    const syncSize = () => {
      resizeDirty = false;
      vw = Math.max(1, root.clientWidth);
      vh = Math.max(1, root.clientHeight);
      rectDirty = true;
      if (mode !== "gl" || !gl || !progs || gl.isContextLost()) return;

      let scale = Math.min(window.devicePixelRatio || 1, CFG.maxDpr);
      if (vw * vh * scale * scale > CFG.maxCanvasPixels) {
        scale = Math.sqrt(CFG.maxCanvasPixels / (vw * vh));
      }
      const cw = Math.max(1, Math.round(vw * scale));
      const ch = Math.max(1, Math.round(vh * scale));
      if (canvas.width !== cw) canvas.width = cw;
      if (canvas.height !== ch) canvas.height = ch;

      const cap = mqMedium.matches ? CFG.maxSimMedium : CFG.maxSimDesktop;
      const k = cap / Math.max(vw, vh);
      const sw = Math.max(64, Math.round(vw * k));
      const sh = Math.max(64, Math.round(vh * k));
      cellPx = vw / sw;
      // c = sqrt(k) cells/step · steps/s · px/cell
      wavePxPerS = Math.sqrt(CFG.waveK) / CFG.simStep * cellPx;

      if (!targets || targets.w !== sw || targets.h !== sh) {
        destroyTargets();
        try {
          const a = makeTarget(gl, sw, sh);
          const b = makeTarget(gl, sw, sh);
          targets = { tex: [a.tex, b.tex], fbo: [a.fbo, b.fbo], w: sw, h: sh, read: 0 };
        } catch {
          destroyTargets();
          glFailed = true;
          evaluate();
        }
      }
    };

    /* ---- impulses ---- */
    const emit = (x: number, y: number, radiusPx: number, strength: number, dx: number, dy: number) => {
      const s = Math.min(CFG.maxAmp, strength);
      if (s <= 0) return;
      let slot = pendCount;
      if (pendCount >= MAX_IMP) {
        // bounded queue: replace the weakest if the new one is stronger
        let weakest = 0;
        let min = Infinity;
        for (let i = 0; i < MAX_IMP; i++) {
          const w = pendA[i * 4 + 3] ?? 0;
          if (w < min) { min = w; weakest = i; }
        }
        if (min >= s) return;
        slot = weakest;
      } else {
        pendCount++;
      }
      const o = slot * 4;
      pendA[o] = x / vw;
      pendA[o + 1] = 1 - y / vh;
      pendA[o + 2] = Math.max(1.5, radiusPx / cellPx);
      pendA[o + 3] = s;
      pendB[slot * 2] = dx;
      pendB[slot * 2 + 1] = dy;

      const h = histHead * 4;
      hist[h] = x;
      hist[h + 1] = y;
      hist[h + 2] = s;
      hist[h + 3] = performance.now();
      histHead = (histHead + 1) % CFG.historySize;
    };

    /* ---- pointer ---- */
    const modalIsOpen = (now: number) => {
      if (now - modalCheckAt > 250) {
        modalCheckAt = now;
        modalOpen = !!document.querySelector('dialog[open], [aria-modal="true"]');
      }
      return modalOpen;
    };

    const sheenTarget = { x: 0, y: 0, a: 0 };

    const feedPoint = (x: number, y: number, t: number, pressure: number, buttons: number, type: string) => {
      const zone = modalIsOpen(performance.now()) ? null : zoneAt(x, y);
      if (!zone) {
        if (ptr.inside && mode === "gl") emit(ptr.x, ptr.y, 20, 0.03, 0, 0); // exit splash
        ptr.inside = false;
        ptr.zone = null;
        return;
      }
      ptr.zone = zone;
      ptr.dirty = true;
      ptr.lastActive = performance.now();

      if (!ptr.inside) {
        ptr.inside = true;
        ptr.x = x; ptr.y = y; ptr.t = t; ptr.vx = 0; ptr.vy = 0;
        if (mode === "gl") emit(x, y, 18, 0.045, 0, 0); // entry splash
        wake();
        return;
      }

      const dt = Math.max(1, t - ptr.t);
      const dx = x - ptr.x;
      const dy = y - ptr.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 0.5) return;

      const vx = dx / dt;
      const vy = dy / dt;
      const speed = Math.hypot(vx, vy); // px/ms
      const pspeed = Math.hypot(ptr.vx, ptr.vy);
      const accel = Math.hypot(vx - ptr.vx, vy - ptr.vy) / dt; // px/ms²
      const dirDot = pspeed > 0.05 && speed > 0.05 ? (vx * ptr.vx + vy * ptr.vy) / (speed * pspeed) : 1;

      if (mode === "gl") {
        const pf = type === "pen" ? 0.6 + 0.8 * clamp(pressure, 0, 1) : buttons > 0 ? 1.3 : 1;
        const sat = speed / (speed + 1.2); // saturating → fast moves are bounded
        const strength = (0.012 + 0.045 * sat) * (1 + Math.min(0.5, accel * 4)) * pf;
        const radius = 14 + 10 * sat;
        const n = clamp(Math.ceil(dist / (radius * 0.7)), 1, 6);
        const per = strength / Math.sqrt(n);
        const ux = dx / dist;
        const uy = -dy / dist; // GL y is up
        for (let i = 1; i <= n; i++) {
          const f = i / n;
          emit(ptr.x + dx * f, ptr.y + dy * f, radius, per, ux, uy);
        }
        // sharp change of direction → secondary, interacting source
        if (dirDot < 0.35 && pspeed > 0.3 && speed > 0.3) {
          const px = -dy / dist;
          const py = dx / dist;
          emit(x + px * radius * 1.2, y + py * radius * 1.2, radius * 0.7, strength * 0.6, -ux, -uy);
          emit(x - px * radius * 1.2, y - py * radius * 1.2, radius * 0.7, strength * 0.6, -ux, -uy);
        }
      } else {
        sheenTarget.x = x;
        sheenTarget.y = y;
        sheenTarget.a = clamp(0.35 + speed * 0.5, 0, 1);
      }

      ptr.x = x; ptr.y = y; ptr.t = t; ptr.vx = vx; ptr.vy = vy;
      wake();
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      if (rectDirty) refreshRects();
      const list = e.getCoalescedEvents?.() ?? [];
      if (list.length > 0) {
        for (const p of list) feedPoint(p.clientX, p.clientY, p.timeStamp, e.pressure, e.buttons, e.pointerType);
      } else {
        feedPoint(e.clientX, e.clientY, e.timeStamp, e.pressure, e.buttons, e.pointerType);
      }
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "touch" || mode !== "gl") return;
      if (rectDirty) refreshRects();
      if (modalIsOpen(performance.now()) || !zoneAt(e.clientX, e.clientY)) return;
      const pf = e.pointerType === "pen" ? 0.6 + 0.8 * clamp(e.pressure, 0, 1) : 1;
      emit(e.clientX, e.clientY, 22, 0.07 * pf, 0, 0);
      ptr.lastActive = performance.now();
      wake();
    };
    const onOut = (e: PointerEvent) => {
      if (e.relatedTarget) return; // still inside the window
      if (ptr.inside && mode === "gl") emit(ptr.x, ptr.y, 20, 0.03, 0, 0);
      ptr.inside = false;
      ptr.zone = null;
    };
    const markRects = () => { rectDirty = true; };

    /* ---- loop ---- */
    const resetPlates = () => {
      for (const p of plates) {
        p.el.style.removeProperty("--water-dx");
        p.el.style.removeProperty("--water-dy");
        plateVals.delete(p.el);
      }
    };

    const stopLoop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      running = false;
      pendCount = 0;
      clearGL();
      resetPlates();
      sheen.style.opacity = "0";
    };

    function wake() {
      ptr.lastActive = performance.now();
      if (running || document.hidden || mode === "off") return;
      if (mode === "gl" && (!progs || !gl || gl.isContextLost())) return;
      running = true;
      last = performance.now();
      acc = 0;
      raf = requestAnimationFrame(tick);
    }

    const stepSim = (inject: boolean) => {
      if (!gl || !progs || !targets) return;
      const src = targets.read;
      const dst = (1 - src) as 0 | 1;
      gl.bindFramebuffer(gl.FRAMEBUFFER, targets.fbo[dst]);
      gl.viewport(0, 0, targets.w, targets.h);
      gl.useProgram(progs.step);
      gl.bindVertexArray(progs.vao);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, targets.tex[src]);
      const u = progs.us;
      gl.uniform1i(u.uState ?? null, 0);
      gl.uniform2f(u.uTexel ?? null, 1 / targets.w, 1 / targets.h);
      gl.uniform1f(u.uK ?? null, CFG.waveK);
      gl.uniform1f(u.uDamp ?? null, CFG.damping);
      const count = inject ? pendCount : 0;
      gl.uniform1i(u.uCount ?? null, count);
      if (count > 0) {
        gl.uniform4fv(u.uImpA ?? null, pendA);
        gl.uniform2fv(u.uImpB ?? null, pendB);
      }
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      targets.read = dst;
    };

    const zoneUniform = new Float32Array(MAX_ZONES * 4);
    const drawFrame = (fade: number) => {
      if (!gl || !progs || !targets) return;
      const n = Math.min(MAX_ZONES, visibleZones.length);
      for (let i = 0; i < n; i++) {
        const z = visibleZones[i];
        if (!z) continue;
        zoneUniform[i * 4] = z.x0;
        zoneUniform[i * 4 + 1] = vh - z.y1;
        zoneUniform[i * 4 + 2] = z.x1;
        zoneUniform[i * 4 + 3] = vh - z.y0;
      }
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(progs.draw);
      gl.bindVertexArray(progs.vao);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, targets.tex[targets.read]);
      const u = progs.ud;
      gl.uniform1i(u.uState ?? null, 0);
      gl.uniform2f(u.uTexel ?? null, 1 / targets.w, 1 / targets.h);
      gl.uniform2f(u.uView ?? null, vw, vh);
      gl.uniform4fv(u.uZones ?? null, zoneUniform);
      gl.uniform1i(u.uZoneCount ?? null, n);
      gl.uniform1f(u.uFade ?? null, fade);
      gl.uniform1f(u.uDark ?? null, dark);
      gl.uniform1f(u.uBump ?? null, CFG.bump);
      gl.uniform1f(u.uRefract ?? null, CFG.refractPx);
      gl.uniform1f(u.uGrid ?? null, CFG.gridPx);
      gl.uniform1f(u.uFeather ?? null, CFG.zoneFeatherPx);
      gl.uniform3f(u.uAccent ?? null, accent[0], accent[1], accent[2]);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    /** CPU model of the travelling wavefront, only for the few decorative plates. */
    const updatePlates = (now: number) => {
      for (const p of plates) {
        let ox = 0;
        let oy = 0;
        for (let i = 0; i < CFG.historySize; i++) {
          const s = hist[i * 4 + 2] ?? 0;
          if (s <= 0) continue;
          const t = (now - (hist[i * 4 + 3] ?? 0)) / 1000;
          if (t < 0 || t > 2.5) continue;
          const dx = p.cx - (hist[i * 4] ?? 0);
          const dy = p.cy - (hist[i * 4 + 1] ?? 0);
          const r = Math.hypot(dx, dy);
          if (r < 1) continue;
          const off = r - wavePxPerS * t;
          const amp = s * CFG.plateGain * Math.exp(-(off * off) / 4900) * Math.exp(-t / 1.2) * Math.sin(off / 22);
          ox += (dx / r) * amp;
          oy += (dy / r) * amp;
        }
        ox = clamp(ox, -CFG.plateMaxPx, CFG.plateMaxPx);
        oy = clamp(oy, -CFG.plateMaxPx, CFG.plateMaxPx);
        const prev = plateVals.get(p.el);
        if (!prev || Math.abs(prev.dx - ox) > 0.04 || Math.abs(prev.dy - oy) > 0.04) {
          plateVals.set(p.el, { dx: ox, dy: oy });
          p.el.style.setProperty("--water-dx", `${ox.toFixed(2)}px`);
          p.el.style.setProperty("--water-dy", `${oy.toFixed(2)}px`);
        }
      }
    };

    const glFrame = (now: number) => {
      if (resizeDirty) syncSize();
      if (rectDirty) refreshRects();
      const idleLeft = ptr.lastActive + idleMs - now;
      if (idleLeft <= 0 || visibleZones.length === 0) {
        stopLoop();
        return;
      }
      acc += Math.min(0.05, (now - last) / 1000);
      last = now;
      let steps = 0;
      while (acc >= CFG.simStep && steps < CFG.maxStepsPerFrame) {
        stepSim(steps === 0);
        acc -= CFG.simStep;
        steps++;
      }
      if (steps === CFG.maxStepsPerFrame) acc = 0;
      if (steps > 0) pendCount = 0;
      drawFrame(clamp(idleLeft / CFG.fadeMs, 0, 1));
      updatePlates(now);
      if (ptr.dirty && ptr.zone) {
        ptr.dirty = false;
        ptr.zone.el.style.setProperty("--water-x", `${(ptr.x - ptr.zone.x0).toFixed(0)}px`);
        ptr.zone.el.style.setProperty("--water-y", `${(ptr.y - ptr.zone.y0).toFixed(0)}px`);
      }
      raf = requestAnimationFrame(tick);
    };

    const cssFrame = (now: number) => {
      if (rectDirty) refreshRects();
      const idle = now - ptr.lastActive > idleMs || visibleZones.length === 0;
      sheen.style.transform = `translate3d(${sheenTarget.x - 140}px, ${sheenTarget.y - 140}px, 0)`;
      sheen.style.opacity = idle ? "0" : String(sheenTarget.a * 0.8);
      if (idle) {
        running = false;
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    function tick(now: number) {
      raf = 0;
      if (mode === "gl") glFrame(now);
      else if (mode === "css") cssFrame(now);
      else running = false;
    }

    /* ---- mode switching ---- */
    const enterMode = () => {
      if (mode === "off") return;
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerdown", onDown, { passive: true });
      window.addEventListener("pointerout", onOut, { passive: true });
      window.addEventListener("scroll", markRects, { passive: true });
      if (mode === "gl") canvas.style.display = "block";
      else sheen.style.display = "block";
      resizeDirty = true;
      rectDirty = true;
      readTheme();
      if (mode === "gl") syncSize();
      else { vw = root.clientWidth; vh = root.clientHeight; }
    };

    const leaveMode = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerout", onOut);
      window.removeEventListener("scroll", markRects);
      stopLoop();
      destroyTargets();
      canvas.style.display = "none";
      sheen.style.display = "none";
      ptr.inside = false;
      ptr.zone = null;
      pendCount = 0;
      hist.fill(0);
    };

    function evaluate() {
      const off = mqReduce.matches || mqCoarse.matches || mqNoHover.matches || mqSmall.matches;
      let next: Mode = off ? "off" : glFailed ? "css" : "gl";
      if (next === "gl" && !ensureGL()) {
        glFailed = true;
        next = "css";
      }
      if (next === mode) {
        resizeDirty = true; // e.g. medium-screen cap changed
        return;
      }
      leaveMode();
      mode = next;
      enterMode();
    }

    /* ---- global listeners ---- */
    const onResize = () => { resizeDirty = true; rectDirty = true; };
    const onVisibility = () => {
      if (document.hidden) stopLoop();
      else if (performance.now() - ptr.lastActive < idleMs) wake();
    };
    const onContextLost = (e: Event) => {
      e.preventDefault();
      stopLoop();
      progs = null; // GL objects died with the context
      targets = null;
    };
    const onContextRestored = () => {
      if (mode !== "gl") return;
      if (ensureGL()) {
        resizeDirty = true;
        syncSize();
      } else {
        glFailed = true;
        evaluate();
      }
    };

    const mqs = [mqReduce, mqCoarse, mqNoHover, mqSmall, mqMedium];
    mqs.forEach((m) => m.addEventListener("change", evaluate));
    mqDark.addEventListener("change", readTheme);
    window.addEventListener("resize", onResize, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    canvas.addEventListener("webglcontextlost", onContextLost);
    canvas.addEventListener("webglcontextrestored", onContextRestored);

    const mo = new MutationObserver(readTheme);
    mo.observe(root, { attributes: true, attributeFilter: ["class", "data-theme", "style"] });
    if (document.body) mo.observe(document.body, { attributes: true, attributeFilter: ["class", "data-theme", "style"] });
    const ro = new ResizeObserver(() => { rectDirty = true; });
    ro.observe(document.body);

    evaluate();

    /* ---- cleanup ---- */
    return () => {
      mqs.forEach((m) => m.removeEventListener("change", evaluate));
      mqDark.removeEventListener("change", readTheme);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      mo.disconnect();
      ro.disconnect();
      leaveMode();
      mode = "off";
      destroyPrograms();
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
      gl = null;
    };
  }, [idleMs]);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        data-liquid-cursor=""
        style={{
          display: "none",
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 30,
          mixBlendMode: "overlay",
        }}
      />
      <div
        ref={sheenRef}
        aria-hidden="true"
        data-liquid-cursor-fallback=""
        style={{
          display: "none",
          position: "fixed",
          left: 0,
          top: 0,
          width: 280,
          height: 280,
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 30,
          opacity: 0,
          transition: "opacity 600ms ease-out",
          mixBlendMode: "overlay",
          background:
            "radial-gradient(closest-side, rgba(255,248,230,0.30), rgba(155,59,50,0.12) 55%, transparent 100%)",
        }}
      />
    </>
  );
}

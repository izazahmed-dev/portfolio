"use client";

import { useEffect, useRef } from "react";
import { useReducedMotionLive } from "@/lib/gsap";

/* ==========================================================================
   HALFTONE PLATE -- the hero portrait, once.

   Adapted from React Bits' HalftoneReveal, which runs on ogl. Rewritten on
   raw WebGL2 so the site takes no new dependency. The portrait is printed as
   a 45 degree amplitude-modulated halftone in the sheet's own ink and paper,
   and the pointer lifts the screen to show the photograph underneath, the way
   a loupe resolves a printed plate back into its source.

   It replaces the water surface that used to run over the hero, so the name
   is the only thing moving while InkStrike prints it.

   Touch and no-hover readers get one reveal when the plate scrolls into view,
   so phones are not left with only the screened version. Reduced motion, from
   the OS or the Imprint switch, skips the canvas and the photograph shows as is.
   ========================================================================== */

type RGB = [number, number, number];

/** Dot pitch in CSS px. Small enough to read as a face, large enough to read as print. */
const CELL_CSS_PX = 4.5;

const VERT = `#version 300 es
out vec2 vUv;
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  vUv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 o;
uniform sampler2D uImg;
uniform vec2 uRes;      // canvas, device px
uniform vec2 uScale;    // object-fit: cover, top anchored
uniform vec2 uOff;
uniform vec2 uPointer;  // device px, origin bottom-left
uniform float uRadius;  // reveal radius, device px
uniform float uCell;    // dot pitch, device px
uniform float uLod;
uniform float uDark;
uniform float uAlpha;
uniform vec3 uInk;
uniform vec3 uPaper;

const mat2 R = mat2(0.70710678, -0.70710678, 0.70710678, 0.70710678);

vec3 sampleAt(vec2 px) {
  vec2 uv = px / uRes;
  vec2 iuv = vec2(uv.x, 1.0 - uv.y) * uScale + uOff;
  return textureLod(uImg, clamp(iuv, 0.0, 1.0), uLod).rgb;
}

void main() {
  vec2 p = vUv * uRes;
  vec2 q = R * p;
  vec2 cellId = floor(q / uCell);
  vec2 centre = transpose(R) * ((cellId + 0.5) * uCell);
  float lum = dot(sampleAt(centre), vec3(0.299, 0.587, 0.114));
  lum = clamp((lum - 0.5) * 1.15 + 0.5, 0.0, 1.0);
  // Light run: ink where the photo is dark. Dark run: light ink where it is
  // bright, so the dark sheet never prints a negative.
  float cover = mix(1.0 - lum, lum, uDark);
  float r = sqrt(cover) * 0.62;
  float d = length(fract(q / uCell) - 0.5);
  float aa = 0.9 / uCell;
  float inked = 1.0 - smoothstep(r - aa, r + aa, d);
  vec3 col = mix(uPaper, uInk, inked);
  float reveal = smoothstep(uRadius * 0.6, uRadius, length(p - uPointer));
  float a = reveal * uAlpha;
  o = vec4(col * a, a);
}`;

function compile(gl: WebGL2RenderingContext, type: number, src: string): WebGLShader | null {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.warn("halftone shader:", gl.getShaderInfoLog(s));
    gl.deleteShader(s);
    return null;
  }
  return s;
}

function makeProgram(gl: WebGL2RenderingContext): WebGLProgram | null {
  const vs = compile(gl, gl.VERTEX_SHADER, VERT);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return null;
  const p = gl.createProgram();
  if (!p) return null;
  gl.attachShader(p, vs);
  gl.attachShader(p, fs);
  gl.linkProgram(p);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    gl.deleteProgram(p);
    return null;
  }
  return p;
}

export function HalftonePortrait({ src }: { src: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reduced = useReducedMotionLive();

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement ?? null;
    if (!canvas || !host || reduced) return;

    const gl = canvas.getContext("webgl2", {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
    });
    if (!gl || gl.isContextLost()) return;

    const prog = makeProgram(gl);
    if (!prog) return;
    const vao = gl.createVertexArray();
    const tex = gl.createTexture();
    if (!vao || !tex) {
      gl.deleteProgram(prog);
      return;
    }

    const loc = (n: string) => gl.getUniformLocation(prog, n);
    const U = {
      img: loc("uImg"),
      res: loc("uRes"),
      scale: loc("uScale"),
      off: loc("uOff"),
      pointer: loc("uPointer"),
      radius: loc("uRadius"),
      cell: loc("uCell"),
      lod: loc("uLod"),
      dark: loc("uDark"),
      alpha: loc("uAlpha"),
      ink: loc("uInk"),
      paper: loc("uPaper"),
    };

    const root = document.documentElement;
    const hover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const probe = document.createElement("canvas").getContext("2d");

    let ink: RGB = [0.08, 0.07, 0.06];
    let paper: RGB = [0.96, 0.95, 0.93];
    let dark = 0;
    let ready = false;
    let disposed = false;
    let raf = 0;
    let timer = 0;
    let revealed = false;
    let imgW = 1;
    let imgH = 1;
    // Lens spreads quickly under a pointer, slowly as a one-time reveal on touch.
    const rRate = hover ? 0.13 : 0.045;
    const cur = { x: 0, y: 0, r: 0, a: 0 };
    const tgt = { x: 0, y: 0, r: 0, a: 0 };
    const view = { sx: 1, sy: 1, ox: 0, oy: 0, lod: 0, cell: CELL_CSS_PX };

    const toRGB = (css: string, fallback: RGB): RGB => {
      if (!probe || !css) return fallback;
      probe.fillStyle = "#000000";
      probe.fillStyle = css;
      const m = /^#([0-9a-f]{6})$/i.exec(String(probe.fillStyle));
      if (!m) return fallback;
      const n = parseInt(m[1], 16);
      return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
    };

    const readTheme = () => {
      const cs = getComputedStyle(root);
      ink = toRGB(cs.getPropertyValue("--ink-900").trim(), ink);
      paper = toRGB(cs.getPropertyValue("--paper-000").trim(), paper);
      dark = root.getAttribute("data-theme") === "dark" ? 1 : 0;
    };

    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      // Layout size, not the bounding rect: the plate is transformed by the
      // hero's rise-and-drift, and the canvas should not resize with it.
      const w = Math.max(1, Math.round(host.clientWidth * dpr));
      const h = Math.max(1, Math.round(host.clientHeight * dpr));
      if (canvas.width !== w) canvas.width = w;
      if (canvas.height !== h) canvas.height = h;
      const ac = w / h;
      const ai = imgW / imgH;
      if (ai > ac) {
        view.sx = ac / ai;
        view.ox = (1 - view.sx) / 2;
        view.sy = 1;
        view.oy = 0;
      } else {
        view.sx = 1;
        view.ox = 0;
        view.sy = ai / ac;
        view.oy = 0;
      }
      view.cell = CELL_CSS_PX * dpr;
      view.lod = Math.log2(Math.max(1, (view.cell * view.sx * imgW) / w));
    };

    const draw = () => {
      if (!ready || disposed || gl.isContextLost()) return;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(prog);
      gl.bindVertexArray(vao);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.uniform1i(U.img, 0);
      gl.uniform2f(U.res, canvas.width, canvas.height);
      gl.uniform2f(U.scale, view.sx, view.sy);
      gl.uniform2f(U.off, view.ox, view.oy);
      gl.uniform2f(U.pointer, cur.x, cur.y);
      gl.uniform1f(U.radius, Math.max(1, cur.r));
      gl.uniform1f(U.cell, view.cell);
      gl.uniform1f(U.lod, view.lod);
      gl.uniform1f(U.dark, dark);
      gl.uniform1f(U.alpha, cur.a);
      gl.uniform3f(U.ink, ink[0], ink[1], ink[2]);
      gl.uniform3f(U.paper, paper[0], paper[1], paper[2]);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const tick = () => {
      raf = 0;
      if (disposed) return;
      cur.x += (tgt.x - cur.x) * 0.22;
      cur.y += (tgt.y - cur.y) * 0.22;
      cur.r += (tgt.r - cur.r) * rRate;
      cur.a += (tgt.a - cur.a) * 0.1;
      const moving =
        Math.abs(tgt.x - cur.x) > 0.3 ||
        Math.abs(tgt.y - cur.y) > 0.3 ||
        Math.abs(tgt.r - cur.r) > 0.3 ||
        Math.abs(tgt.a - cur.a) > 0.002;
      if (!moving) Object.assign(cur, tgt);
      draw();
      if (moving) raf = requestAnimationFrame(tick);
    };

    const kick = () => {
      if (!raf && !disposed) raf = requestAnimationFrame(tick);
    };

    /* ---- pointer (hover devices) ---- */
    const local = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      const kx = canvas.width / Math.max(1, r.width);
      const ky = canvas.height / Math.max(1, r.height);
      return { x: (e.clientX - r.left) * kx, y: (r.bottom - e.clientY) * ky };
    };
    const lens = () => Math.max(canvas.width, canvas.height) * 0.3;

    const onEnter = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const p = local(e);
      cur.x = p.x;
      cur.y = p.y;
      tgt.x = p.x;
      tgt.y = p.y;
      tgt.r = lens();
      kick();
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const p = local(e);
      tgt.x = p.x;
      tgt.y = p.y;
      if (tgt.r === 0) tgt.r = lens();
      kick();
    };
    const onLeave = () => {
      tgt.r = 0;
      kick();
    };

    /* ---- one-time reveal (touch / no hover) ---- */
    let io: IntersectionObserver | null = null;
    if (hover) {
      host.addEventListener("pointerenter", onEnter);
      host.addEventListener("pointermove", onMove, { passive: true });
      host.addEventListener("pointerleave", onLeave);
    } else {
      io = new IntersectionObserver(
        (entries) => {
          if (revealed || !entries.some((en) => en.isIntersecting)) return;
          revealed = true;
          io?.disconnect();
          timer = window.setTimeout(() => {
            cur.x = canvas.width / 2;
            cur.y = canvas.height * 0.6;
            tgt.x = cur.x;
            tgt.y = cur.y;
            tgt.r = Math.hypot(canvas.width, canvas.height) * 1.15;
            kick();
          }, 900);
        },
        { threshold: 0.6 }
      );
      io.observe(host);
    }

    /* ---- theme, size, context ---- */
    readTheme();
    const mo = new MutationObserver(() => {
      readTheme();
      draw();
    });
    mo.observe(root, { attributes: true, attributeFilter: ["data-theme"] });

    const ro = new ResizeObserver(() => {
      fit();
      draw();
    });
    ro.observe(host);

    const onLost = () => {
      ready = false;
      canvas.style.visibility = "hidden";
    };
    canvas.addEventListener("webglcontextlost", onLost);

    /* ---- the plate itself ---- */
    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      if (disposed || gl.isContextLost()) return;
      imgW = img.naturalWidth || 1;
      imgH = img.naturalHeight || 1;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      ready = true;
      fit();
      tgt.a = 1;
      kick();
    };
    img.src = src;

    return () => {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      window.clearTimeout(timer);
      img.onload = null;
      io?.disconnect();
      mo.disconnect();
      ro.disconnect();
      host.removeEventListener("pointerenter", onEnter);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("webglcontextlost", onLost);
      // No loseContext(): under StrictMode the effect re-runs on the same
      // canvas, and a deliberately lost context would come back dead.
      if (!gl.isContextLost()) {
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.deleteTexture(tex);
        gl.deleteVertexArray(vao);
        gl.deleteProgram(prog);
      }
      canvas.style.visibility = "";
    };
  }, [src, reduced]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}

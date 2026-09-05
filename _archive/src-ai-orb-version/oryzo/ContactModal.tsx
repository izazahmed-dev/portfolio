"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Phone, MapPin, Copy, Check, ArrowUpRight, Send } from "lucide-react";
import { PORTFOLIO_DATA } from "@/lib/portfolio-data";
import { soundFx } from "@/lib/audio";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState("");
  const [senderEmail, setSenderEmail] = useState("");

  if (!isOpen) return null;

  const copyToClipboard = (text: string, fieldName: string) => {
    soundFx.playClick();
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playSuccess();
    setSent(true);
    setTimeout(() => {
      window.location.href = `mailto:${PORTFOLIO_DATA.profile.email}?subject=Engineering Collaboration Inquiry&body=${encodeURIComponent(
        message
      )}`;
      setSent(false);
      onClose();
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6" data-lenis-prevent>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="relative z-10 w-full max-w-2xl rounded-3xl border border-white/12 bg-[#140b06] text-[#ffedd7] p-6 sm:p-8 space-y-6 shadow-2xl shadow-black/80"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/8 pb-4">
            <div>
              <div className="eyebrow-oryzo text-[#ff5700]">
                DIRECT DISPATCH TERMINAL
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#ffedd7] mt-0.5 font-syne">
                Initiate Engineering Collaboration
              </h2>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full border border-white/10 bg-[#0c0704] text-[#c89f82] hover:text-[#ffedd7] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Copy Contact Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              onClick={() => copyToClipboard(PORTFOLIO_DATA.profile.email, "email")}
              className="flex items-center justify-between p-3 rounded-2xl bg-[#0c0704] border border-white/10 hover:border-[#ff5700]/60 transition-colors text-xs font-mono text-left group cursor-pointer active:scale-[0.98]"
            >
              <span className="flex items-center gap-2 text-[#ffedd7] truncate">
                <Mail className="w-4 h-4 text-[#ff5700] shrink-0" />
                <span className="truncate">{PORTFOLIO_DATA.profile.email}</span>
              </span>
              {copiedField === "email" ? (
                <span className="text-[#ff5700] font-bold text-[10px]">COPIED</span>
              ) : (
                <Copy className="w-3.5 h-3.5 text-[#8a654e] group-hover:text-[#ffedd7] shrink-0" />
              )}
            </button>

            <button
              onClick={() => copyToClipboard(PORTFOLIO_DATA.profile.phone, "phone")}
              className="flex items-center justify-between p-3 rounded-2xl bg-[#0c0704] border border-white/10 hover:border-[#ff5700]/60 transition-colors text-xs font-mono text-left group cursor-pointer active:scale-[0.98]"
            >
              <span className="flex items-center gap-2 text-[#ffedd7] tabular-nums">
                <Phone className="w-4 h-4 text-[#ff5700] shrink-0" />
                <span>{PORTFOLIO_DATA.profile.phone}</span>
              </span>
              {copiedField === "phone" ? (
                <span className="text-[#ff5700] font-bold text-[10px]">COPIED</span>
              ) : (
                <Copy className="w-3.5 h-3.5 text-[#8a654e] group-hover:text-[#ffedd7] shrink-0" />
              )}
            </button>
          </div>

          {/* Direct Message Form */}
          <form onSubmit={handleSend} className="space-y-3.5">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-[#8a654e] mb-1">
                Your Email Address
              </label>
              <input
                type="email"
                required
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                placeholder="recruiter@enterprise.ai or partner@domain.com"
                className="w-full bg-[#0c0704] border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-[#ffedd7] placeholder:text-[#8a654e] focus:outline-none focus:border-[#ff5700]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-[#8a654e] mb-1">
                Brief / Project Details
              </label>
              <textarea
                required
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="We would love to discuss your autonomous AI agent workflows or ML internship role..."
                className="w-full bg-[#0c0704] border border-white/10 rounded-2xl p-3.5 text-xs text-[#ffedd7] placeholder:text-[#8a654e] focus:outline-none focus:border-[#ff5700]"
              />
            </div>

            <button
              type="submit"
              disabled={sent}
              className="btn-oryzo-primary w-full py-3 text-xs font-bold cursor-pointer"
            >
              {sent ? (
                <span className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0c0704]" />
                  <span>DISPATCH TRANSMITTED</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send className="w-4 h-4 text-[#0c0704]" />
                  <span>SEND COLLABORATION BRIEF</span>
                </span>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="text-[10px] font-mono text-center text-[#8a654e]">
            PEDDAPALEM IZAZ AHMED // B.TECH AIML (2025–2029) • RMD ENGINEERING COLLEGE
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}


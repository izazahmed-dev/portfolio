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
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6" data-lenis-prevent>
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
          className="relative z-10 w-full max-w-2xl rounded-[36px] border border-white/15 bg-[#181818] text-[#ffedd7] p-8 sm:p-10 space-y-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <div className="eyebrow-oryzo text-[#dc5000]">
                DIRECT DISPATCH TERMINAL
              </div>
              <h2 className="text-2xl font-medium tracking-tight text-[#ffedd7] mt-1">
                Initiate Engineering Collaboration
              </h2>
            </div>

            <button
              onClick={onClose}
              className="p-2.5 rounded-full border border-white/10 bg-[#100904] text-[#c09060] hover:text-[#ffedd7] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Copy Contact Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => copyToClipboard(PORTFOLIO_DATA.profile.email, "email")}
              className="flex items-center justify-between p-3.5 rounded-full bg-[#100904] border border-white/10 hover:border-[#dc5000]/60 transition-colors text-xs font-mono text-left group"
            >
              <span className="flex items-center gap-2 text-[#ffedd7] truncate">
                <Mail className="w-4 h-4 text-[#dc5000]" />
                <span className="truncate">{PORTFOLIO_DATA.profile.email}</span>
              </span>
              {copiedField === "email" ? (
                <span className="text-[#dc5000] font-bold text-[11px]">COPIED</span>
              ) : (
                <Copy className="w-3.5 h-3.5 text-[#a86048] group-hover:text-[#ffedd7]" />
              )}
            </button>

            <button
              onClick={() => copyToClipboard(PORTFOLIO_DATA.profile.phone, "phone")}
              className="flex items-center justify-between p-3.5 rounded-full bg-[#100904] border border-white/10 hover:border-[#dc5000]/60 transition-colors text-xs font-mono text-left group"
            >
              <span className="flex items-center gap-2 text-[#ffedd7]">
                <Phone className="w-4 h-4 text-[#dc5000]" />
                <span>{PORTFOLIO_DATA.profile.phone}</span>
              </span>
              {copiedField === "phone" ? (
                <span className="text-[#dc5000] font-bold text-[11px]">COPIED</span>
              ) : (
                <Copy className="w-3.5 h-3.5 text-[#a86048] group-hover:text-[#ffedd7]" />
              )}
            </button>
          </div>

          {/* Direct Message Form */}
          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#a86048] mb-1.5">
                Your Email Address
              </label>
              <input
                type="email"
                required
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                placeholder="recruiter@enterprise.ai or partner@domain.com"
                className="w-full bg-[#100904] border border-white/15 rounded-full px-5 py-3 text-xs text-[#ffedd7] placeholder:text-[#a86048] focus:outline-none focus:border-[#dc5000]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#a86048] mb-1.5">
                Brief / Project Details
              </label>
              <textarea
                required
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="We would love to discuss your autonomous AI agent workflows or ML internship role..."
                className="w-full bg-[#100904] border border-white/15 rounded-2xl p-4 text-xs text-[#ffedd7] placeholder:text-[#a86048] focus:outline-none focus:border-[#dc5000]"
              />
            </div>

            <button
              type="submit"
              disabled={sent}
              className="btn-oryzo-primary w-full py-4 text-xs font-medium cursor-pointer"
            >
              {sent ? (
                <span className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>DISPATCH TRANSMITTED</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  <span>SEND COLLABORATION BRIEF</span>
                </span>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="text-[11px] font-mono text-center text-[#a86048]">
            PEDDAPALEM IZAZ AHMED // B.TECH AIML (2025–2029) • RMD ENGINEERING COLLEGE
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

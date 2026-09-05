"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { soundFx } from "@/lib/audio";

interface HeaderProps {
  onOpenContact: () => void;
}

export function Header({ onOpenContact }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "INTRO", href: "#hero" },
    { label: "FEATURES", href: "#features" },
    { label: "PRODUCT", href: "#product" },
    { label: "CONTACT", href: "#contact" },
  ];

  const handleNavClick = (href: string) => {
    soundFx.playClick();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 h-16 sm:h-20 transition-all duration-200 px-6 sm:px-10 flex items-center justify-between ${
          isScrolled
            ? "bg-[#100904]/90 backdrop-blur-md border-b border-white/10"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-content w-full mx-auto flex items-center justify-between">
          {/* Left: Wordmark */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("#hero");
            }}
            className="flex items-center gap-2 group"
          >
            <span className="font-heading font-semibold text-lg sm:text-xl tracking-tight text-[#ffedd7]">
              IZAZ<span className="text-[#dc5000]">.AI</span>
            </span>
            <span className="hidden md:inline-block text-[11px] uppercase tracking-widest text-[#c09060] font-medium border-l border-white/15 pl-2 ml-1">
              AUTONOMOUS ARCHITECTURE
            </span>
          </a>

          {/* Center: Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="text-xs font-medium uppercase tracking-[0.08em] text-[#ffedd7]/70 hover:text-[#ffedd7] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right: Primary Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                soundFx.playClick();
                onOpenContact();
              }}
              className="btn-oryzo-primary text-[12px] font-medium uppercase cursor-pointer"
            >
              <span>SEND</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => {
                soundFx.playClick();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="md:hidden p-2 text-[#ffedd7] hover:text-[#dc5000] transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Full-Screen Overlay Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#100904] flex flex-col justify-between px-8 py-24 md:hidden">
          <div className="space-y-6 pt-8">
            {navLinks.map((link) => (
              <div key={link.label}>
                <a
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className="font-heading text-4xl font-medium tracking-tight text-[#ffedd7] hover:text-[#dc5000] transition-colors block py-2"
                >
                  {link.label}
                </a>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-8 space-y-4">
            <button
              onClick={() => {
                soundFx.playClick();
                setMobileMenuOpen(false);
                onOpenContact();
              }}
              className="btn-oryzo-primary w-full text-center"
            >
              INITIATE COLLABORATION // SEND
            </button>
            <div className="text-xs text-[#a86048] font-mono text-center">
              PEDDAPALEM IZAZ AHMED // CLASS OF 2029
            </div>
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import { createPortal } from "react-dom";

const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'textarea',
  'input',
  'select',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  label: string;
  side?: 'right' | 'left';
  children: ReactNode;
}

export function Drawer({ open, onClose, label, side = 'right', children }: DrawerProps) {
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<Element | null>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (open) {
      triggerRef.current = document.activeElement;
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => {
        const first = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTORS);
        first?.focus();
      });
    } else {
      document.body.style.overflow = '';
      (triggerRef.current as HTMLElement | null)?.focus();
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab') return;
      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS);
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!mounted) return null;

  const slideOut = side === 'right' ? 'translate-x-full' : '-translate-x-full';

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={label}
      className={`fixed inset-0 z-[100] ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
    >
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
      />
      {/* Panel */}
      <div
        ref={panelRef}
        className={`absolute top-0 ${side === 'right' ? 'right-0' : 'left-0'} h-full w-full max-w-[480px] bg-[var(--color-surface-container-lowest)] flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : slideOut}`}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

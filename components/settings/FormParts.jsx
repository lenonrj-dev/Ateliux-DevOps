// file: components/settings/FormParts.jsx
"use client";

import { Eye, EyeOff, Copy, Check } from "lucide-react";
import { useState } from "react";

export function SectionHeader({ title, subtitle }) {
  return (
    <div className="mb-4">
      <h3 className="text-base font-medium text-gray-100">{title}</h3>
      {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
    </div>
  );
}

export function FormRow({ label, hint, children }) {
  return (
    <div className="grid sm:grid-cols-[220px_minmax(0,1fr)] gap-3 items-start">
      <div className="pt-2">
        <div className="text-sm text-gray-200">{label}</div>
        {hint && <div className="text-xs text-gray-400">{hint}</div>}
      </div>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

export function Input({ ...props }) {
  return <input {...props} className={`w-full bg-[#0e141b] border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500/40 ${props.className||""}`} />;
}

export function Select({ children, ...props }) {
  return <select {...props} className={`w-full bg-[#0e141b] border border-white/10 rounded-lg px-3 py-2 text-sm ${props.className||""}`}>{children}</select>;
}

export function Switch({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`h-6 w-11 rounded-full border transition relative ${checked ? "bg-cyan-500/40 border-cyan-500/60" : "bg-white/5 border-white/10"}`}
      aria-pressed={checked}
    >
      <span className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition ${checked ? "translate-x-5" : ""}`} />
    </button>
  );
}

export function CodeBox({ value, masked=false }) {
  const [show, setShow] = useState(!masked);
  const [copied, setCopied] = useState(false);
  const txt = show ? value : "•".repeat(Math.min(24, value.length));
  return (
    <div className="flex items-center gap-2">
      <code className="inline-flex items-center rounded-lg border border-white/10 bg-[#0b1117] px-3 py-2 text-xs text-gray-200 break-all">{txt}</code>
      {masked ? (
        <button onClick={() => setShow(s=>!s)} className="p-2 rounded border border-white/10 bg-white/5 hover:border-white/20">{show ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}</button>
      ) : null}
      <button
        onClick={() => { navigator.clipboard.writeText(value); setCopied(true); setTimeout(()=>setCopied(false), 1200); }}
        className="p-2 rounded border border-white/10 bg-white/5 hover:border-white/20"
      >
        {copied ? <Check className="h-4 w-4 text-emerald-300"/> : <Copy className="h-4 w-4"/>}
      </button>
    </div>
  );
}

export function Button({ children, variant="default", ...props }) {
  const cls = variant === "danger"
    ? "border-rose-500/40 bg-rose-500/10 hover:border-rose-500/60"
    : variant === "outline"
    ? "border-white/10 bg-white/5 hover:border-white/20"
    : "border-white/10 bg-cyan-500/10 hover:border-cyan-500/40";
  return <button {...props} className={`text-sm rounded-lg px-3 py-2 border ${cls} ${props.className||""}`}>{children}</button>;
}

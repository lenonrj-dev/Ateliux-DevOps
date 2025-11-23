// file: components/cluster/KVTable.jsx
"use client";

import { Copy } from "lucide-react";

/**
 * KVTable
 * rows: Array<[chave, valor] | [chave, valor, opções?]>
 *  - valor: string | number | ReactNode | Array<any> | object
 *  - opções (opcional por linha):
 *      { copyable?: boolean, monospace?: boolean, title?: string }
 * props extras:
 *  - compact?: reduz o padding vertical (default false)
 *  - className?: classes extras
 *  - onCopy?: callback(chave, valor) quando copiar
 */
export default function KVTable({ rows = [], compact = false, className = "", onCopy }) {
  const formatVal = (v) => {
    if (v == null) return "—";
    if (Array.isArray(v)) return v.join(", ");
    if (typeof v === "object" && !isValidElement(v)) {
      try {
        return JSON.stringify(v);
      } catch {
        return String(v);
      }
    }
    return v;
  };

  const isValidElement = (v) => !!(v && typeof v === "object" && "props" in v);

  const handleCopy = async (key, rawVal) => {
    const text = typeof rawVal === "string" ? rawVal : String(formatVal(rawVal));
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      onCopy?.(key, text);
      alert("Valor copiado!");
    } catch {
      alert("Não foi possível copiar.");
    }
  };

  if (!rows?.length) {
    return <div className="text-sm text-gray-400">Sem dados.</div>;
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm ${className}`}>
      {rows.map((row, idx) => {
        // Row pode vir como [k, v] ou [k, v, opts]
        const [k, v, opts = {}] = row;
        const { copyable = false, monospace = false, title } = opts || {};
        const valueToRender = isValidElement(v) ? v : formatVal(v);
        const displayTitle = title ?? (typeof valueToRender === "string" ? valueToRender : undefined);

        return (
          <div
            key={`${k}-${idx}`}
            className={`flex items-center justify-between gap-4 border-b border-white/10 ${compact ? "py-0.5" : "py-1"}`}
          >
            <span className="text-gray-400">{k}</span>

            <span className={`text-gray-100 truncate text-right ${monospace ? "font-mono" : ""}`} title={displayTitle}>
              {valueToRender}
            </span>

            {copyable && !isValidElement(v) && (
              <button
                onClick={() => handleCopy(k, v)}
                className="ml-1 shrink-0 p-1 rounded hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                aria-label={`Copiar valor de ${k}`}
                title="Copiar valor"
              >
                <Copy className="h-4 w-4 text-gray-300" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

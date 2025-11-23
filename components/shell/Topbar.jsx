"use client";

import { Menu, BellDot, Search, Loader2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useToast } from "../providers/ToastProvider";

const MOCK_RESOURCES = [
  { label: "Overview - status geral", href: "/dashboard/overview" },
  { label: "Serviços - produção", href: "/dashboard/services" },
  { label: "Pipelines - checkout release", href: "/dashboard/pipelines" },
  { label: "Incidentes críticos", href: "/dashboard/incidents" },
  { label: "Streaming de logs", href: "/dashboard/logs" },
  { label: "Pods - api-server", href: "/dashboard/workloads/pods" },
  { label: "Cluster - visão geral", href: "/dashboard/cluster" },
  { label: "Equipes - plataforma", href: "/dashboard/teams" },
];

export default function Topbar({ onToggleSidebar }) {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState([]);
  const [openList, setOpenList] = useState(false);
  const [cursor, setCursor] = useState(-1);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const { pushToast } = useToast();

  const filtered = useMemo(() => {
    if (!q.trim()) return [];
    const k = q.trim().toLowerCase();
    return MOCK_RESOURCES.filter((r) => r.label.toLowerCase().includes(k)).slice(0, 8);
  }, [q]);

  const runSearch = useCallback(() => {
    setLoading(true);
    setError("");
    const timer = setTimeout(() => {
      try {
        if (Math.random() < 0.04) throw new Error("Falha temporária na busca.");
        setResults(filtered);
      } catch (e) {
        setError(e.message || "Erro desconhecido.");
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 260);
    return () => clearTimeout(timer);
  }, [filtered]);

  useEffect(() => {
    if (!q) {
      setResults([]);
      setOpenList(false);
      setCursor(-1);
      return;
    }
    setOpenList(true);
    const cancel = runSearch();
    return cancel;
  }, [q, runSearch]);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (!listRef.current || !inputRef.current) return;
      if (listRef.current.contains(e.target) || inputRef.current.contains(e.target)) return;
      setOpenList(false);
      setCursor(-1);
    };
    window.addEventListener("click", onClickOutside);
    return () => window.removeEventListener("click", onClickOutside);
  }, []);

  const onKeyDown = (e) => {
    if (!openList) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => Math.min(results.length ? results.length - 1 : 0, c + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => Math.max(-1, c - 1));
    } else if (e.key === "Enter") {
      if (cursor >= 0 && results[cursor]) {
        const href = results[cursor].href;
        if (href) window.location.href = href;
      }
    } else if (e.key === "Escape") {
      setOpenList(false);
      setCursor(-1);
    }
  };

  return (
    <header className="h-16 sticky top-0 z-20 bg-[#0b0f14]/90 backdrop-blur border-b border-white/10">
      <div className="h-full max-w-[1600px] mx-auto flex items-center gap-3 px-4 md:px-6 lg:px-8">
        <motion.button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
          aria-label="Alternar sidebar"
          whileTap={{ scale: 0.96 }}
        >
          <Menu className="h-5 w-5" />
        </motion.button>

        <div className="relative flex-1 max-w-xl">
          <label className="sr-only" htmlFor="global-search">
            Buscar
          </label>
          <input
            id="global-search"
            ref={inputRef}
            className="w-full bg-[#0e141b] border border-white/10 rounded-lg pl-9 pr-10 py-2.5 outline-none focus:ring-2 focus:ring-cyan-500/40"
            placeholder="Busque serviços, pipelines, incidentes, pods..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => q && setOpenList(true)}
            onKeyDown={onKeyDown}
            role="combobox"
            aria-expanded={openList}
            aria-controls="search-results"
            aria-autocomplete="list"
            aria-activedescendant={cursor >= 0 ? `result-${cursor}` : undefined}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          {loading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-300" aria-hidden />}

          <AnimatePresence>
            {openList && (
              <motion.div
                ref={listRef}
                id="search-results"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="absolute z-10 mt-2 w-full rounded-lg border border-white/10 bg-[#0e141b] shadow-xl"
                role="listbox"
              >
                {error ? (
                  <div className="px-3 py-2 text-sm text-red-300">Erro: {error}</div>
                ) : results.length === 0 && !loading ? (
                  <div className="px-3 py-2 text-sm text-gray-300">Nenhum resultado encontrado</div>
                ) : (
                  <ul>
                    {results.map((r, idx) => (
                      <li key={r.href}>
                        <Link
                          id={`result-${idx}`}
                          href={r.href}
                          className={`block px-3 py-2 text-sm ${idx === cursor ? "bg-white/5" : "hover:bg-white/5"}`}
                          role="option"
                          aria-selected={idx === cursor}
                          onClick={() => setOpenList(false)}
                        >
                          {r.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.button
          className="p-2 rounded-lg hover:bg-white/5 ml-auto focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
          aria-label="Notificações"
          whileTap={{ scale: 0.96 }}
          onClick={() =>
            pushToast({
              title: "3 incidentes críticos em aberto",
              description: "web-api, pagamentos e build-runner precisam de ação.",
              tone: "warning",
            })
          }
        >
          <BellDot className="h-5 w-5" />
        </motion.button>
      </div>
    </header>
  );
}

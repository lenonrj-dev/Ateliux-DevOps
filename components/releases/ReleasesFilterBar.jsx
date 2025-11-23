// file: components/releases/ReleasesFilterBar.jsx
"use client";

import { Search, ArrowUpDown, ListFilter } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

const sortKeys = [
  { key: "startedAtEpoch", label: "Início" },
  { key: "finishedAtEpoch", label: "Fim" },
  { key: "version", label: "Versão" },
  { key: "service", label: "Serviço" },
  { key: "status", label: "Status" },
];

export default function ReleasesFilterBar({
  query, onQuery,
  env, onEnv,
  status, onStatus,
  sortBy, onSortBy,
  debounce = false,          // opcional: ativa debounce local de 300ms na busca
  onClear,                   // opcional: callback externo ao limpar
}) {
  const toggleDir = () =>
    onSortBy({ key: sortBy.key, dir: sortBy.dir === "asc" ? "desc" : "asc" });

  // Estado interno para suportar debounce sem quebrar controle externo
  const [localQuery, setLocalQuery] = useState(query || "");
  useEffect(() => { setLocalQuery(query || ""); }, [query]);
  useEffect(() => {
    if (!debounce) return;
    const t = setTimeout(() => {
      if (localQuery !== query) onQuery?.(localQuery);
    }, 300);
    return () => clearTimeout(t);
  }, [debounce, localQuery, query, onQuery]);

  const clearFilters = () => {
    onQuery?.("");
    setLocalQuery("");
    onEnv?.("todos");
    onStatus?.("todos");
    onClear?.(); // se existir, notifica o pai
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    if (debounce) {
      setLocalQuery(val);
    } else {
      setLocalQuery(val);
      onQuery?.(val);
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      if (localQuery) {
        clearFilters();
      }
    }
  };

  return (
    <div className="flex flex-col gap-3 mb-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <input
            value={localQuery}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            className="w-full bg-[#0e141b] border border-white/10 rounded-lg pl-10 pr-9 py-2.5 outline-none focus:ring-2 focus:ring-cyan-500/40"
            placeholder="Buscar por serviço, versão, autor, commit…"
            aria-label="Buscar releases por serviço, versão, autor ou commit"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
          {localQuery && (
            <button
              type="button"
              onClick={clearFilters}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-300/80 hover:text-gray-100 px-1 py-0.5 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40"
              aria-label="Limpar busca e filtros"
              title="Limpar busca e filtros"
            >
              ×
            </button>
          )}
        </div>
        <motion.button
          type="button"
          onClick={clearFilters}
          className="inline-flex items-center gap-2 bg-[#0e141b] border border-white/10 rounded-lg px-3 py-2 hover:border-cyan-500/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40"
          aria-label="Limpar filtros"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ListFilter className="h-4 w-4" />
          Limpar filtros
        </motion.button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <select
          value={env}
          onChange={(e)=>onEnv(e.target.value)}
          className="bg-[#0e141b] border border-white/10 rounded-lg px-3 py-2 text-sm"
          aria-label="Filtrar por ambiente"
        >
          <option value="todos">Ambiente: todos</option>
          <option value="prod">Produção</option>
          <option value="stg">Staging</option>
          <option value="dev">Desenvolvimento</option>
        </select>

        <select
          value={status}
          onChange={(e)=>onStatus(e.target.value)}
          className="bg-[#0e141b] border border-white/10 rounded-lg px-3 py-2 text-sm"
          aria-label="Filtrar por status"
        >
          <option value="todos">Status: todos</option>
          <option>Em progresso</option>
          <option>Concluído</option>
          <option>Pausado</option>
          <option>Falhou</option>
        </select>

        <div className="flex items-center gap-2 ml-auto">
          <select
            value={sortBy.key}
            onChange={(e) => onSortBy({ key: e.target.value, dir: "desc" })}
            className="bg-[#0e141b] border border-white/10 rounded-lg px-3 py-2 text-sm"
            aria-label="Ordenar por"
          >
            {sortKeys.map((k) => <option key={k.key} value={k.key}>{k.label}</option>)}
          </select>
          <motion.button
            onClick={toggleDir}
            type="button"
            className="inline-flex items-center gap-2 bg-[#0e141b] border border-white/10 rounded-lg px-3 py-2 hover:border-white/20 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40"
            aria-label={`Alternar direção da ordenação: ${sortBy.dir === "asc" ? "crescente" : "decrescente"}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ArrowUpDown className="h-4 w-4" />
            {sortBy.dir === "asc" ? "ASC" : "DESC"}
          </motion.button>
        </div>
      </div>
    </div>
  );
}

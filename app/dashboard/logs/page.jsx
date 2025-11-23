"use client";

import { useEffect, useMemo, useState } from "react";
import { Pause, Play, Trash2 } from "lucide-react";
import Panel from "../../../components/ui/Panel";
import InputField from "../../../components/ui/InputField";
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";
import Toggle from "../../../components/ui/Toggle";
import { useToast } from "../../../components/providers/ToastProvider";
import { initialLogs, liveLogTemplates } from "../../../lib/devops/logs";

const LEVELS = ["ALL", "INFO", "WARN", "ERROR"];

export default function LogsPage() {
  const [logs, setLogs] = useState(initialLogs);
  const [paused, setPaused] = useState(false);
  const [level, setLevel] = useState("ALL");
  const [query, setQuery] = useState("");
  const [autoScroll, setAutoScroll] = useState(true);
  const { pushToast } = useToast();

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      const fn = liveLogTemplates[Math.floor(Math.random() * liveLogTemplates.length)];
      setLogs((prev) => [...prev, fn()].slice(-120));
    }, 1200);
    return () => clearInterval(id);
  }, [paused]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return logs.filter((log) => {
      const okLevel = level === "ALL" || log.level === level;
      const okQuery = !term || log.message.toLowerCase().includes(term);
      return okLevel && okQuery;
    });
  }, [level, logs, query]);

  useEffect(() => {
    if (!autoScroll || filtered.length === 0) return;
    const last = document.getElementById("log-end");
    if (last) last.scrollIntoView({ behavior: "smooth" });
  }, [filtered, autoScroll]);

  const clearLogs = () => {
    setLogs([]);
    pushToast({ title: "Logs limpos", tone: "info" });
  };

  return (
    <div className="space-y-4">
      <Panel
        title="Streaming de logs"
        subtitle="Filtre e pause/resume o fluxo simulado"
        actions={
          <div className="flex items-center gap-2">
            <Badge tone="info">{logs.length} linhas</Badge>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="rounded-lg border border-white/10 bg-[#0c1118] px-3 py-2 text-sm"
            >
              {LEVELS.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </div>
        }
      >
        <div className="grid md:grid-cols-[1fr_220px] gap-3">
          <InputField label="Busca" placeholder="Trace id, rota, mensagem..." value={query} onChange={(e) => setQuery(e.target.value)} />
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              className="w-full"
              icon={paused ? Play : Pause}
              onClick={() => {
                setPaused((p) => !p);
                pushToast({ title: paused ? "Stream retomado" : "Stream pausado", tone: "info" });
              }}
            >
              {paused ? "Retomar" : "Pausar"}
            </Button>
            <Button variant="secondary" icon={Trash2} onClick={clearLogs}>
              Limpar
            </Button>
          </div>
        </div>

        <Toggle
          checked={autoScroll}
          onChange={setAutoScroll}
          label="Autoscroll"
          description="Mantém o final dos logs visível em tempo real"
        />

        <div className="mt-3 rounded-2xl border border-white/10 bg-[#050910] p-3 max-h-[520px] overflow-auto font-mono text-[13px] leading-relaxed">
          {filtered.map((log, idx) => (
            <LogLine key={`${log.timestamp}-${idx}`} log={log} />
          ))}
          <div id="log-end" />
        </div>
      </Panel>
    </div>
  );
}

function LogLine({ log }) {
  const tone =
    log.level === "ERROR" ? "text-rose-200" : log.level === "WARN" ? "text-amber-200" : "text-cyan-100";
  return (
    <div className="flex gap-2">
      <span className="text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
      <span className={`font-semibold ${tone}`}>{log.level}</span>
      <span className="text-gray-200">{log.message}</span>
    </div>
  );
}

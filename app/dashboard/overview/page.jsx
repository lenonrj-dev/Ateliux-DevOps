"use client";

import { Activity, AlertTriangle, Cpu, Gauge, Globe2, Network, ShieldCheck, Timer, Zap } from "lucide-react";
import { motion } from "framer-motion";
import Panel from "../../../components/ui/Panel";
import StatCard from "../../../components/devops/StatCard";
import StatusBadge from "../../../components/devops/StatusBadge";
import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";
import MiniSpark from "../../../components/k8s/MiniSpark";
import { useToast } from "../../../components/providers/ToastProvider";
import { alertBanners, healthPanels, latestDeployments, metricCards, serviceErrors } from "../../../lib/devops/overview";

const iconMap = {
  cpu: Cpu,
  memory: Gauge,
  latency: Timer,
  errors: AlertTriangle,
  uptime: ShieldCheck,
  deploys: Globe2,
};

const networkFlows = [
  { label: "Edge ingress", value: 1320, delta: "+4.2%", points: [0.4, 0.45, 0.48, 0.5, 0.47, 0.52, 0.55, 0.53] },
  { label: "Serviços internos", value: 980, delta: "+2.1%", points: [0.36, 0.4, 0.44, 0.46, 0.45, 0.47, 0.5, 0.48] },
  { label: "Filas / workers", value: 410, delta: "-1.3%", points: [0.28, 0.3, 0.32, 0.31, 0.33, 0.34, 0.35, 0.34] },
];

const sloItems = [
  { label: "Checkout", slo: "99.9%", status: "OK", trend: [0.12, 0.1, 0.09, 0.08, 0.07, 0.09] },
  { label: "Auth", slo: "99.95%", status: "OK", trend: [0.05, 0.05, 0.06, 0.05, 0.04, 0.05] },
  { label: "Web-API", slo: "99.8%", status: "Risco", trend: [0.11, 0.12, 0.14, 0.13, 0.12, 0.12] },
  { label: "Pagamentos", slo: "99.9%", status: "Risco", trend: [0.13, 0.14, 0.16, 0.14, 0.15, 0.14] },
];

export default function OverviewPage() {
  const { pushToast } = useToast();

  return (
    <div className="space-y-6">
      {/* alertas principais */}
      {alertBanners.map((banner) => (
        <div
          key={banner.title}
          className={`rounded-2xl border border-white/10 px-4 py-3 flex flex-wrap items-center gap-3 ${
            banner.tone === "warning" ? "bg-amber-500/10" : "bg-cyan-500/5"
          }`}
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-200" />
            <div>
              <p className="font-semibold">{banner.title}</p>
              <p className="text-sm text-gray-300">{banner.description}</p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => pushToast({ title: "Ação rápida enviada", description: banner.title })}
            >
              Registrar ação
            </Button>
          </div>
        </div>
      ))}

      {/* métricas principais */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {metricCards.map((metric) => (
          <StatCard
            key={metric.id}
            icon={iconMap[metric.id]}
            title={metric.title}
            value={metric.value}
            delta={metric.delta}
            hint={metric.hint}
            state={metric.state === "warning" ? "warning" : metric.state === "healthy" ? "healthy" : "danger"}
            series={metric.series}
          />
        ))}
      </div>

      {/* saúde e deploys */}
      <div className="grid xl:grid-cols-[1.2fr_1fr] gap-4">
        <Panel
          title="Saúde da Plataforma"
          subtitle="Panorama consolidado por domínio"
          actions={
            <Button
              size="sm"
              variant="secondary"
              onClick={() => pushToast({ title: "Checklist atualizado", description: "Ping nos serviços críticos OK", tone: "success" })}
            >
              Rodar healthcheck
            </Button>
          }
        >
          <div className="grid md:grid-cols-2 gap-3">
            {healthPanels.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 flex items-start gap-3"
              >
                <div className="h-9 w-9 rounded-lg bg-white/5 border border-white/10 grid place-items-center">
                  <ShieldCheck className="h-5 w-5 text-cyan-200" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-gray-300">{item.title}</p>
                  <p className="text-lg font-semibold">{item.status}</p>
                  <p className="text-xs text-gray-400">{item.detail}</p>
                </div>
                <Badge tone={item.sentiment === "warning" ? "warning" : "success"} className="ml-auto shrink-0">
                  {item.sentiment === "warning" ? "atenção" : "ok"}
                </Badge>
              </div>
            ))}
          </div>
        </Panel>

        <Panel
          title="Deploys recentes"
          subtitle="Promoções em produção e stage"
          actions={
            <Button
              size="sm"
              onClick={() => pushToast({ title: "Solicitação enviada", description: "Aprovação de release solicitada" })}
            >
              Aprovar release
            </Button>
          }
        >
          <div className="space-y-3">
            {latestDeployments.map((d) => (
              <div
                key={`${d.service}-${d.version}`}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 flex items-center gap-3"
              >
                <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/10 grid place-items-center border border-white/10">
                  <Activity className="h-5 w-5 text-cyan-100" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm">{d.service}</p>
                    <Badge tone="info">{d.env}</Badge>
                    <StatusBadge value={d.status} />
                  </div>
                  <p className="text-xs text-gray-400">
                    {d.version} - {d.author} - {d.time}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => pushToast({ title: "Deploy verificado", description: `${d.service} ${d.version} ok`, tone: "success" })}
                >
                  Validar
                </Button>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* erros e tráfego */}
      <div className="grid xl:grid-cols-[1.1fr_1fr] gap-4">
        <Panel
          title="Hotspots de Erro"
          subtitle="Endpoints com maiores taxas de falha"
          actions={<Badge tone="warning">Atenção</Badge>}
        >
          <div className="space-y-2">
            {serviceErrors.map((row) => (
              <div key={row.id} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-rose-500/10 border border-rose-400/20 grid place-items-center">
                  <Zap className="h-4 w-4 text-rose-200" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{row.service}</p>
                  <p className="text-xs text-gray-400">{row.path}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm tabular-nums text-gray-100">{row.rate.toFixed(2)}%</span>
                  <Badge tone={row.trend === "up" ? "warning" : row.trend === "down" ? "success" : "neutral"}>
                    {row.trend === "up" ? "Subindo" : row.trend === "down" ? "Caindo" : "Estável"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel
          title="Fluxo de rede"
          subtitle="Tráfego médio (req/s) e variação"
          actions={<StatusBadge value="Em execução" />}
        >
          <div className="space-y-3">
            {networkFlows.map((item) => (
              <div key={item.label} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Network className="h-4 w-4 text-cyan-200" />
                    <p className="text-sm text-gray-200">{item.label}</p>
                  </div>
                  <span className="text-sm font-semibold">{item.value} req/s</span>
                </div>
                <MiniSpark points={item.points} height={40} />
                <p className="text-xs text-emerald-300">{item.delta} vs última hora</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* Experiments */}
      <Panel
        title="SLOs críticos"
        subtitle="Acompanhamento de latência e erros"
        actions={<Badge tone="info">Tempo real</Badge>}
      >
        <div className="grid md:grid-cols-4 gap-3">
          {sloItems.map((item) => (
            <motion.div key={item.label} whileHover={{ y: -2 }} className="rounded-xl border border-white/10 bg-white/5 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-200">{item.label}</p>
                <Badge tone={item.status === "OK" ? "success" : "warning"}>{item.status}</Badge>
              </div>
              <div className="text-lg font-semibold">{item.slo}</div>
              <MiniSpark points={item.trend} height={36} ariaLabel={`Tendência ${item.label}`} />
            </motion.div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

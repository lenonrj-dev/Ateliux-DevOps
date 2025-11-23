"use client";

import {
  ActivitySquare,
  AlertTriangle,
  Box,
  ChevronLeft,
  CloudCog,
  FileText,
  Grid2X2,
  HardDrive,
  Layers3,
  MenuSquare,
  Rocket,
  Server,
  Shield,
  Users2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const SECTIONS = [
  { label: "Overview", icon: ActivitySquare, href: "/dashboard/overview" },
  { label: "Serviços", icon: CloudCog, href: "/dashboard/services" },
  { label: "Pipelines", icon: Rocket, href: "/dashboard/pipelines" },
  { label: "Incidentes", icon: AlertTriangle, href: "/dashboard/incidents" },
  { label: "Logs", icon: FileText, href: "/dashboard/logs" },
  { label: "Configurações", icon: MenuSquare, href: "/dashboard/settings" },
  {
    label: "Kubernetes",
    icon: Server,
    children: [
      { label: "Cluster", href: "/dashboard/cluster" },
      { label: "Nós", href: "/dashboard/nodes", icon: Grid2X2 },
      { label: "Workloads", href: "/dashboard/workloads", icon: Layers3 },
      { label: "Pods", href: "/dashboard/workloads/pods" },
      { label: "Deployments", href: "/dashboard/workloads/deployments" },
      { label: "DaemonSets", href: "/dashboard/workloads/daemonsets" },
      { label: "StatefulSets", href: "/dashboard/workloads/statefulsets" },
      { label: "ReplicaSets", href: "/dashboard/workloads/replicasets" },
      { label: "Jobs", href: "/dashboard/workloads/jobs" },
      { label: "CronJobs", href: "/dashboard/workloads/cronjobs" },
      { label: "Armazenamento", href: "/dashboard/storage", icon: HardDrive },
      { label: "Acesso", href: "/dashboard/access", icon: Shield },
      { label: "Lançamentos", href: "/dashboard/releases", icon: Rocket },
      { label: "Equipes", href: "/dashboard/teams", icon: Users2 },
      { label: "Configuração", href: "/dashboard/settings", icon: Box },
    ],
  },
];

export default function Sidebar({ open, onToggle }) {
  const pathname = usePathname();
  const isActive = (href) => !!href && pathname.startsWith(href);

  return (
    <aside
      className={`transition-[width] duration-300 bg-[#0e141b]/95 backdrop-blur border-r border-white/10 ${open ? "w-72" : "w-[88px]"}`}
      aria-label="Barra lateral de navegação"
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Image src="/logoAteliux.svg" alt="Ateliux" width={32} height={32} className="h-8 w-8" priority />
          {open && <div className="font-semibold tracking-wide">Ateliux Ops</div>}
        </div>
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
          aria-label={open ? "Recolher sidebar" : "Expandir sidebar"}
        >
          <ChevronLeft className={`h-5 w-5 transition-transform ${open ? "rotate-0" : "rotate-180"}`} />
        </button>
      </div>

      <nav className="p-3 space-y-1" role="navigation">
        {SECTIONS.map((s, i) => {
          const sectionActive = (s.href && isActive(s.href)) || (s.children && s.children.some((c) => isActive(c.href)));
          return (
            <div key={i}>
              <Item icon={s.icon} label={s.label} href={s.href} open={open} active={sectionActive} />
              {s.children && (
                <motion.div
                  initial={false}
                  animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                  className={`ml-10 overflow-hidden ${open ? "mt-1" : ""}`}
                  aria-hidden={!open}
                >
                  <div className="space-y-1">
                    {s.children.map((c) => (
                      <Item key={c.label} label={c.label} href={c.href} icon={c.icon} open={open} small active={isActive(c.href)} />
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

function Item({ icon: Icon, label, href = "#", open, small, active }) {
  const classActive = active ? "bg-white/[0.06] border-white/20 text-white" : "hover:bg-white/5 border-transparent hover:border-white/10";

  const inner = (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg border ${small ? "text-sm" : "text-[15px]"} ${classActive}`}
      aria-current={active ? "page" : undefined}
    >
      {Icon ? <Icon className={`h-4 w-4 ${active ? "text-white" : "text-gray-300"}`} /> : <Box className={`h-4 w-4 ${active ? "text-white" : "text-gray-300"}`} />}
      {open && <span className="truncate">{label}</span>}
    </motion.div>
  );
  return href ? (
    <Link href={href} aria-label={label}>
      {inner}
    </Link>
  ) : (
    inner
  );
}

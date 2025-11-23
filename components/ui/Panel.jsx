// file: components/ui/Panel.jsx
"use client";

export default function Panel({
  title,
  subtitle,
  children,
  actions,                 // conteúdo opcional à direita do header (botões, filtros rápidos, etc.)
  footer,                  // rodapé opcional do painel
  loading = false,         // mostra skeletons e aria-busy
  error = null,            // string de erro opcional
  empty = false,           // estado vazio (quando aplicável)
  emptyMessage = "Sem dados para exibir.",
  onRetry,                 // ação opcional para o botão "Tentar novamente" no erro
  className = "",          // permite estender estilos
  id,                      // id opcional para amarrar aria-labelledby
}) {
  const headerId = id ? `${id}-title` : undefined;
  const subtitleId = subtitle ? (id ? `${id}-subtitle` : undefined) : undefined;

  return (
    <section
      role="region"
      aria-labelledby={headerId}
      aria-describedby={subtitle ? subtitleId : undefined}
      className={`rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.03] shadow-xl shadow-black/20 ${className}`}
    >
      <header className="flex items-end justify-between gap-2 px-4 md:px-5 py-3 border-b border-white/10">
        <div className="min-w-0">
          <h2 id={headerId} className="text-lg font-semibold tracking-tight truncate">
            {title}
          </h2>
          {subtitle && (
            <p id={subtitleId} className="text-xs text-gray-400 mt-0.5 truncate">
              {subtitle}
            </p>
          )}
        </div>
        {actions ? (
          <div className="shrink-0 flex items-center gap-2">{actions}</div>
        ) : null}
      </header>

      <div
        className="p-4 md:p-5"
        aria-busy={loading ? "true" : undefined}
      >
        {/* Estado: erro */}
        {error && !loading && (
          <div
            className="mb-3 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200"
            role="alert"
          >
            <div className="flex items-start justify-between gap-3">
              <span>{error}</span>
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="px-2 py-1 rounded border border-white/10 bg-white/5 hover:border-white/20 text-xs"
                  aria-label="Tentar novamente"
                >
                  Tentar novamente
                </button>
              )}
            </div>
          </div>
        )}

        {/* Estado: carregando */}
        {loading && (
          <div className="space-y-3">
            <div className="h-4 w-40 rounded bg-white/10 animate-pulse" />
            <div className="h-3 w-full rounded bg-white/10 animate-pulse" />
            <div className="h-3 w-11/12 rounded bg-white/10 animate-pulse" />
            <div className="h-3 w-10/12 rounded bg-white/10 animate-pulse" />
          </div>
        )}

        {/* Estado: vazio */}
        {!loading && !error && empty && (
          <div className="text-sm text-gray-400">{emptyMessage}</div>
        )}

        {/* Conteúdo padrão */}
        {!loading && !error && !empty && children}
      </div>

      {footer ? (
        <footer className="px-4 md:px-5 py-3 border-t border-white/10">
          {footer}
        </footer>
      ) : null}
    </section>
  );
}

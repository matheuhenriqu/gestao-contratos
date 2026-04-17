type HeaderProps = {
  totalContracts: number;
  totalModalities: number;
  totalVisibleValue: string;
  activeFilterCount: number;
  referenceLabel: string;
};

function QuickLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <a
      href={href}
      className="rounded-full border border-[color:var(--border)] bg-white/85 px-3.5 py-2 text-sm font-medium text-[var(--text)] shadow-sm transition hover:bg-white"
    >
      {label}
    </a>
  );
}

export function Header({
  totalContracts,
  totalModalities,
  totalVisibleValue,
  activeFilterCount,
  referenceLabel,
}: HeaderProps) {
  const logoSrc = `${import.meta.env.BASE_URL}logo-prefeitura-iguape.png`;

  return (
    <header className="panel overflow-hidden">
      <div className="relative bg-[linear-gradient(135deg,rgba(22,73,120,0.13),rgba(22,73,120,0.03)_38%,rgba(255,255,255,0.98))] px-5 py-5 sm:px-7 sm:py-7">
        <div className="absolute inset-y-0 right-0 hidden w-[24rem] bg-[radial-gradient(circle_at_top_right,rgba(22,73,120,0.12),transparent_62%)] lg:block" />

        <div className="relative flex flex-col gap-7">
          <div className="flex flex-col gap-7 xl:flex-row xl:items-start xl:justify-between">
            <div className="flex min-w-0 flex-col gap-5">
              <div className="flex min-w-0 items-center gap-4 sm:gap-5">
                <div className="rounded-2xl border border-[color:var(--border)] bg-white/88 p-2.5 shadow-sm backdrop-blur sm:p-3">
                  <img
                    src={logoSrc}
                    alt="Prefeitura de Iguape/SP"
                    className="h-14 w-auto shrink-0 sm:h-16"
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--brand)]">
                    Painel institucional
                  </p>
                  <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--text)] sm:text-[2.1rem]">
                    Gestão de Contratos
                  </h1>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    Prefeitura de Iguape/SP
                  </p>
                </div>
              </div>

              <div className="max-w-3xl">
                <p className="text-sm leading-6 text-[var(--muted)] sm:text-[0.96rem]">
                  Consulta pública com leitura administrativa, agrupamento por
                  modalidade, foco em vencimentos e atenção à completude
                  cadastral.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-white/88 px-3.5 py-2 text-sm font-medium text-[var(--text)] shadow-sm">
                  Base CONTRATOS.xlsx
                </span>
                <span className="rounded-full bg-white/88 px-3.5 py-2 text-sm font-medium text-[var(--text)] shadow-sm">
                  Referência {referenceLabel}
                </span>
                <span className="rounded-full bg-white/88 px-3.5 py-2 text-sm font-medium text-[var(--text)] shadow-sm">
                  {activeFilterCount} filtro{activeFilterCount === 1 ? "" : "s"} ativo
                  {activeFilterCount === 1 ? "" : "s"}
                </span>
              </div>
            </div>

            <div className="grid max-w-full grid-cols-2 gap-3 sm:grid-cols-4 xl:w-[34rem]">
              <div className="rounded-[1.6rem] border border-[color:var(--border)] bg-white/84 px-4 py-3.5 shadow-sm backdrop-blur">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                  Registros
                </p>
                <p className="mt-2 text-lg font-semibold tracking-tight text-[var(--text)]">
                  {totalContracts}
                </p>
              </div>
              <div className="rounded-[1.6rem] border border-[color:var(--border)] bg-white/84 px-4 py-3.5 shadow-sm backdrop-blur">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                  Modalidades
                </p>
                <p className="mt-2 text-lg font-semibold tracking-tight text-[var(--text)]">
                  {totalModalities}
                </p>
              </div>
              <div className="rounded-[1.6rem] border border-[color:var(--border)] bg-white/84 px-4 py-3.5 shadow-sm backdrop-blur sm:col-span-2">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                  Valor do recorte
                </p>
                <p className="mt-2 text-lg font-semibold tracking-tight text-[var(--text)]">
                  {totalVisibleValue}
                </p>
              </div>
            </div>
          </div>

          <nav className="flex flex-wrap gap-2">
            <QuickLink href="#resumo" label="Resumo executivo" />
            <QuickLink href="#filtros" label="Filtros" />
            <QuickLink href="#modalidades" label="Modalidades" />
            <QuickLink href="#contratos" label="Contratos" />
            <QuickLink href="#graficos" label="Análises" />
          </nav>
        </div>
      </div>
    </header>
  );
}

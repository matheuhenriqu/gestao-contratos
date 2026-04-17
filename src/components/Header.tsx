type HeaderProps = {
  totalContracts: number;
  totalModalities: number;
  totalVisibleValue: string;
};

export function Header({
  totalContracts,
  totalModalities,
  totalVisibleValue,
}: HeaderProps) {
  const logoSrc = `${import.meta.env.BASE_URL}logo-prefeitura-iguape.png`;

  return (
    <header className="panel overflow-hidden">
      <div className="bg-[linear-gradient(135deg,rgba(22,73,120,0.12),rgba(22,73,120,0.02)_42%,rgba(255,255,255,0.98))] px-5 py-5 sm:px-7 sm:py-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-center gap-4 sm:gap-5">
            <div className="rounded-2xl border border-[color:var(--border)] bg-white/80 p-2.5 shadow-sm backdrop-blur sm:p-3">
              <img
                src={logoSrc}
                alt="Prefeitura de Iguape/SP"
                className="h-14 w-auto shrink-0 sm:h-16"
              />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--brand)]">
                Sistema institucional
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--text)] sm:text-3xl">
                Gestão de Contratos
              </h1>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Prefeitura de Iguape/SP
              </p>
            </div>
          </div>

          <div className="grid max-w-full grid-cols-2 gap-3 sm:grid-cols-4 lg:w-auto">
            <div className="rounded-2xl border border-[color:var(--border)] bg-white/78 px-4 py-3 shadow-sm backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                Base
              </p>
              <p className="mt-1 text-sm font-medium text-[var(--text)]">
                CONTRATOS.xlsx
              </p>
            </div>
            <div className="rounded-2xl border border-[color:var(--border)] bg-white/78 px-4 py-3 shadow-sm backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                Registros
              </p>
              <p className="mt-1 text-sm font-medium text-[var(--text)]">
                {totalContracts} contratos
              </p>
            </div>
            <div className="rounded-2xl border border-[color:var(--border)] bg-white/78 px-4 py-3 shadow-sm backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                Modalidades
              </p>
              <p className="mt-1 text-sm font-medium text-[var(--text)]">
                {totalModalities} grupos
              </p>
            </div>
            <div className="rounded-2xl border border-[color:var(--border)] bg-white/78 px-4 py-3 shadow-sm backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                Valor visível
              </p>
              <p className="mt-1 text-sm font-medium text-[var(--text)]">
                {totalVisibleValue}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

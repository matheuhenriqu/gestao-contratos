import type { ModalitySummary } from "../types/contracts";
import { formatCompactNumber, formatCurrency, formatText } from "../utils/format";

type ModalityBoardProps = {
  summaries: ModalitySummary[];
  selectedModality: string;
  onSelect: (modality: string) => void;
};

function SummaryMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-[var(--text)]">{value}</p>
    </div>
  );
}

function ModalityCard({
  title,
  eyebrow,
  metrics,
  active,
  onClick,
}: {
  title: string;
  eyebrow: string;
  metrics: Array<{ label: string; value: string }>;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-[1.6rem] border p-4 text-left transition ${
        active
          ? "border-[color:var(--brand)] bg-[linear-gradient(180deg,rgba(22,73,120,0.13),rgba(22,73,120,0.03))] shadow-sm"
          : "border-[color:var(--border)] bg-[var(--surface-alt)] hover:bg-[var(--surface-strong)]"
      }`}
    >
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">
        {eyebrow}
      </p>
      <h3 className="mt-2 line-clamp-2 text-lg font-semibold tracking-tight text-[var(--text)]">
        {title}
      </h3>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {metrics.map((metric) => (
          <SummaryMetric key={metric.label} label={metric.label} value={metric.value} />
        ))}
      </div>
    </button>
  );
}

export function ModalityBoard({
  summaries,
  selectedModality,
  onSelect,
}: ModalityBoardProps) {
  const totalContracts = summaries.reduce((sum, item) => sum + item.count, 0);
  const totalValue = summaries.reduce((sum, item) => sum + item.totalValue, 0);
  const totalUpcoming = summaries.reduce((sum, item) => sum + item.upcomingCount, 0);
  const totalIncomplete = summaries.reduce(
    (sum, item) => sum + item.incompleteCount,
    0,
  );

  return (
    <section className="panel overflow-hidden">
      <div className="border-b border-[color:var(--border)] px-4 py-4 sm:px-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="section-title">Modalidades</h2>
            <p className="section-subtitle">
              Separação operacional dos contratos por modalidade, sem rolagem
              lateral no mobile e com leitura setorial direta.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            <div className="rounded-2xl border border-[color:var(--border)] bg-[var(--surface-strong)] px-3 py-2.5">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                Modalidades
              </p>
              <p className="mt-1 text-sm font-medium text-[var(--text)]">
                {summaries.length}
              </p>
            </div>
            <div className="rounded-2xl border border-[color:var(--border)] bg-[var(--surface-strong)] px-3 py-2.5">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                Valor consolidado
              </p>
              <p className="mt-1 text-sm font-medium text-[var(--text)]">
                {formatCurrency(totalValue)}
              </p>
            </div>
            <div className="rounded-2xl border border-[color:var(--border)] bg-[var(--surface-strong)] px-3 py-2.5">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                Próximos do vencimento
              </p>
              <p className="mt-1 text-sm font-medium text-[var(--text)]">
                {formatCompactNumber(totalUpcoming)}
              </p>
            </div>
            <div className="rounded-2xl border border-[color:var(--border)] bg-[var(--surface-strong)] px-3 py-2.5">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                Pendências
              </p>
              <p className="mt-1 text-sm font-medium text-[var(--text)]">
                {formatCompactNumber(totalIncomplete)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 sm:px-5">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          <ModalityCard
            title="Todas as modalidades"
            eyebrow="Visão geral"
            active={selectedModality === "all"}
            onClick={() => onSelect("all")}
            metrics={[
              { label: "Contratos", value: formatCompactNumber(totalContracts) },
              { label: "Valor", value: formatCurrency(totalValue) },
              { label: "Próximos", value: formatCompactNumber(totalUpcoming) },
              { label: "Pendências", value: formatCompactNumber(totalIncomplete) },
            ]}
          />

          {summaries.map((summary) => (
            <ModalityCard
              key={summary.key}
              title={formatText(summary.name)}
              eyebrow="Modalidade"
              active={selectedModality === summary.name}
              onClick={() => onSelect(summary.name)}
              metrics={[
                {
                  label: "Contratos",
                  value: formatCompactNumber(summary.count),
                },
                {
                  label: "Valor",
                  value: formatCurrency(summary.totalValue),
                },
                {
                  label: "Vencidos",
                  value: formatCompactNumber(summary.expiredCount),
                },
                {
                  label: "Pendências",
                  value: formatCompactNumber(summary.incompleteCount),
                },
              ]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

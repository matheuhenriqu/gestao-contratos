import type { UiContractRecord } from "../types/contracts";
import { cx, formatCompactNumber, formatText } from "../utils/format";

type ExecutivePanelsProps = {
  records: UiContractRecord[];
  expiryChart: Array<{ name: string; value: number }>;
};

const RADAR_TONES = {
  "Vencidos": {
    bar: "bg-[var(--danger)]",
    text: "text-[var(--danger)]",
    pill: "bg-[var(--danger-soft)] text-[var(--danger)]",
  },
  "Vencem hoje": {
    bar: "bg-[var(--danger)]",
    text: "text-[var(--danger)]",
    pill: "bg-[var(--danger-soft)] text-[var(--danger)]",
  },
  "Até 7 dias": {
    bar: "bg-[var(--warning)]",
    text: "text-[var(--warning)]",
    pill: "bg-[var(--warning-soft)] text-[var(--warning)]",
  },
  "Até 30 dias": {
    bar: "bg-[var(--warning)]",
    text: "text-[var(--warning)]",
    pill: "bg-[var(--warning-soft)] text-[var(--warning)]",
  },
  "Até 60 dias": {
    bar: "bg-[var(--brand)]",
    text: "text-[var(--brand)]",
    pill: "bg-[var(--brand-soft)] text-[var(--brand)]",
  },
  "Até 90 dias": {
    bar: "bg-[var(--brand)]",
    text: "text-[var(--brand)]",
    pill: "bg-[var(--brand-soft)] text-[var(--brand)]",
  },
  "Acima de 90 dias": {
    bar: "bg-[var(--success)]",
    text: "text-[var(--success)]",
    pill: "bg-[var(--success-soft)] text-[var(--success)]",
  },
} as const;

function SummaryChip({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className: string;
}) {
  return (
    <div className={cx("rounded-full px-3 py-2 text-sm font-medium", className)}>
      <span className="mr-2 text-[0.72rem] uppercase tracking-[0.16em] opacity-70">
        {label}
      </span>
      <span>{value}</span>
    </div>
  );
}

function RadarRow({
  label,
  value,
  maxValue,
}: {
  label: string;
  value: number;
  maxValue: number;
}) {
  const tone = RADAR_TONES[label as keyof typeof RADAR_TONES] ?? RADAR_TONES["Até 90 dias"];
  const width = maxValue === 0 ? 0 : Math.max((value / maxValue) * 100, value > 0 ? 10 : 0);

  return (
    <div className="grid gap-2 sm:grid-cols-[minmax(0,11rem)_1fr_auto] sm:items-center">
      <p className="text-sm font-medium text-[var(--text)]">{label}</p>
      <div className="h-2.5 overflow-hidden rounded-full bg-[var(--surface-strong)]">
        <div
          className={cx("h-full rounded-full transition-[width]", tone.bar)}
          style={{ width: `${width}%` }}
        />
      </div>
      <p className={cx("text-sm font-semibold", tone.text)}>
        {formatCompactNumber(value)}
      </p>
    </div>
  );
}

export function ExecutivePanels({
  records,
  expiryChart,
}: ExecutivePanelsProps) {
  const expiryValues = Object.fromEntries(
    expiryChart.map((item) => [item.name, item.value]),
  ) as Record<string, number>;

  const radarRows = expiryChart.filter((item) => item.name !== "Sem data");
  const maxRadarValue = Math.max(...radarRows.map((item) => item.value), 0);
  const urgentCount =
    (expiryValues["Vencidos"] ?? 0) +
    (expiryValues["Vencem hoje"] ?? 0) +
    (expiryValues["Até 7 dias"] ?? 0) +
    (expiryValues["Até 30 dias"] ?? 0);
  const monitorCount =
    (expiryValues["Até 60 dias"] ?? 0) + (expiryValues["Até 90 dias"] ?? 0);
  const stableCount = expiryValues["Acima de 90 dias"] ?? 0;

  const missingHighlights = [...records]
    .filter((record) => record.hasMissingData)
    .sort((left, right) => {
      if (right.missingCount !== left.missingCount) {
        return right.missingCount - left.missingCount;
      }

      const leftDays = left.daysToExpiry ?? Number.POSITIVE_INFINITY;
      const rightDays = right.daysToExpiry ?? Number.POSITIVE_INFINITY;
      return leftDays - rightDays;
    })
    .slice(0, 5);

  const completedContracts = records.filter((record) => !record.hasMissingData).length;
  const completenessRate =
    records.length === 0 ? 0 : Math.round((completedContracts / records.length) * 100);
  const completionDegrees = Math.max(0, Math.min(360, completenessRate * 3.6));

  return (
    <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
      <section className="panel overflow-hidden">
        <div className="border-b border-[color:var(--border)] bg-[linear-gradient(180deg,rgba(22,73,120,0.07),rgba(22,73,120,0.015))] px-4 py-4 sm:px-5">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--brand)]">
            Resumo executivo
          </p>
          <h3 className="mt-2 text-xl font-semibold tracking-tight text-[var(--text)]">
            Radar de vencimentos
          </h3>
          <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">
            Leitura consolidada do recorte atual para identificar urgência
            imediata, monitoramento preventivo e contratos em faixa confortável.
          </p>
        </div>

        <div className="space-y-5 px-4 py-5 sm:px-5">
          <div className="flex flex-wrap gap-2">
            <SummaryChip
              label="Urgente"
              value={`${formatCompactNumber(urgentCount)} contratos`}
              className="bg-[var(--danger-soft)] text-[var(--danger)]"
            />
            <SummaryChip
              label="Monitorar"
              value={`${formatCompactNumber(monitorCount)} contratos`}
              className="bg-[var(--warning-soft)] text-[var(--warning)]"
            />
            <SummaryChip
              label="Estável"
              value={`${formatCompactNumber(stableCount)} contratos`}
              className="bg-[var(--success-soft)] text-[var(--success)]"
            />
          </div>

          <div className="space-y-3">
            {radarRows.map((row) => (
              <RadarRow
                key={row.name}
                label={row.name}
                value={row.value}
                maxValue={maxRadarValue}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="panel overflow-hidden">
        <div className="border-b border-[color:var(--border)] px-4 py-4 sm:px-5">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--brand)]">
            Qualidade cadastral
          </p>
          <h3 className="mt-2 text-xl font-semibold tracking-tight text-[var(--text)]">
            Pendências prioritárias
          </h3>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Contratos com maior necessidade de conferência documental ou
            completude cadastral no recorte atual.
          </p>
        </div>

        <div className="space-y-5 px-4 py-5 sm:px-5">
          <div className="grid gap-4 sm:grid-cols-[8.5rem_1fr] sm:items-center">
            <div
              className="mx-auto flex h-32 w-32 items-center justify-center rounded-full"
              style={{
                background: `conic-gradient(var(--brand) 0deg ${completionDegrees}deg, rgba(22,73,120,0.12) ${completionDegrees}deg 360deg)`,
              }}
            >
              <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-white text-center shadow-sm">
                <span className="text-2xl font-semibold tracking-tight text-[var(--text)]">
                  {completenessRate}%
                </span>
                <span className="mt-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                  completos
                </span>
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <div className="rounded-2xl border border-[color:var(--border)] bg-[var(--surface-strong)] px-4 py-3">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                  Sem pendências
                </p>
                <p className="mt-1 text-lg font-semibold text-[var(--text)]">
                  {formatCompactNumber(completedContracts)}
                </p>
              </div>
              <div className="rounded-2xl border border-[color:var(--border)] bg-[var(--surface-strong)] px-4 py-3">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                  Com pendências
                </p>
                <p className="mt-1 text-lg font-semibold text-[var(--text)]">
                  {formatCompactNumber(records.length - completedContracts)}
                </p>
              </div>
            </div>
          </div>

          {missingHighlights.length > 0 ? (
            <div className="space-y-3">
              {missingHighlights.map((record) => (
                <article
                  key={`${record.id}-${record.sourceIndex}`}
                  className="rounded-[1.6rem] border border-[color:var(--border)] bg-[var(--surface-alt)] px-4 py-3.5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[var(--text)]">
                        {formatText(record.empresaContratada)}
                      </p>
                      <p className="mt-1 line-clamp-2 text-sm text-[var(--muted)]">
                        {formatText(record.modalidade)} · {record.dueSituation}
                      </p>
                    </div>

                    <span className="rounded-full bg-[var(--warning-soft)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--warning)]">
                      {formatCompactNumber(record.missingCount)} pend.
                    </span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-[1.6rem] border border-[color:var(--border)] bg-[var(--success-soft)] px-4 py-4 text-sm text-[var(--success)]">
              O recorte atual não possui contratos com pendências cadastrais.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

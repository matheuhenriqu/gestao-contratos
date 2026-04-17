import type { ReactNode } from "react";

type KpiCardProps = {
  title: string;
  value: string;
  note: string;
  accent: "brand" | "danger" | "warning" | "success" | "neutral";
  icon: ReactNode;
};

const ACCENT_CLASSES = {
  brand: {
    band: "bg-[var(--brand)]",
    icon: "border-[color:color-mix(in_srgb,var(--brand)_18%,var(--border))] bg-[color:var(--brand-soft)] text-[var(--brand)]",
  },
  danger: {
    band: "bg-[var(--danger)]",
    icon: "border-[color:color-mix(in_srgb,var(--danger)_18%,var(--border))] bg-[color:var(--danger-soft)] text-[var(--danger)]",
  },
  warning: {
    band: "bg-[var(--warning)]",
    icon: "border-[color:color-mix(in_srgb,var(--warning)_18%,var(--border))] bg-[color:var(--warning-soft)] text-[var(--warning)]",
  },
  success: {
    band: "bg-[var(--success)]",
    icon: "border-[color:color-mix(in_srgb,var(--success)_18%,var(--border))] bg-[color:var(--success-soft)] text-[var(--success)]",
  },
  neutral: {
    band: "bg-[var(--muted)]",
    icon: "border-[color:var(--border)] bg-[color:var(--neutral-soft)] text-[var(--text)]",
  },
};

export function KpiCard({ title, value, note, accent, icon }: KpiCardProps) {
  return (
    <article className="panel relative overflow-hidden p-4 sm:p-5">
      <div className={`absolute inset-x-0 top-0 h-1 ${ACCENT_CLASSES[accent].band}`} />

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
            {title}
          </p>
          <p className="mt-3 text-2xl font-semibold tracking-tight text-[var(--text)] sm:text-[1.95rem]">
            {value}
          </p>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--muted)]">
            {note}
          </p>
        </div>

        <div
          className={`rounded-[1.35rem] border p-3 shadow-sm ${ACCENT_CLASSES[accent].icon}`}
        >
          {icon}
        </div>
      </div>
    </article>
  );
}

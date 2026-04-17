import type {
  ContractsByModalityGroup,
  SortKey,
  SortState,
  UiContractRecord,
} from "../types/contracts";
import { formatCompactNumber, formatCurrency } from "../utils/format";
import { ContractsTable } from "./ContractsTable";
import { MobileContractList } from "./MobileContractList";

type ContractsByModalityProps = {
  groups: ContractsByModalityGroup[];
  selectedContractId: string | null;
  sortState: SortState;
  onSortChange: (key: SortKey) => void;
  onSelect: (contract: UiContractRecord) => void;
};

function GroupBadge({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-[var(--surface-strong)] px-3 py-2">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-[var(--text)]">{value}</p>
    </div>
  );
}

export function ContractsByModality({
  groups,
  selectedContractId,
  sortState,
  onSortChange,
  onSelect,
}: ContractsByModalityProps) {
  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <article key={group.key} className="panel overflow-hidden">
          <div className="border-b border-[color:var(--border)] bg-[linear-gradient(180deg,rgba(22,73,120,0.06),rgba(22,73,120,0.01))] px-4 py-4 sm:px-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="min-w-0">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">
                  Modalidade
                </p>
                <h3 className="mt-2 text-xl font-semibold tracking-tight text-[var(--text)]">
                  {group.name}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                <GroupBadge
                  label="Contratos"
                  value={formatCompactNumber(group.count)}
                />
                <GroupBadge
                  label="Valor"
                  value={formatCurrency(group.totalValue)}
                />
                <GroupBadge
                  label="Próximos / vencidos"
                  value={`${formatCompactNumber(group.upcomingCount)} / ${formatCompactNumber(group.expiredCount)}`}
                />
                <GroupBadge
                  label="Pendências"
                  value={formatCompactNumber(group.incompleteCount)}
                />
              </div>
            </div>
          </div>

          <div className="hidden lg:block">
            <ContractsTable
              records={group.records}
              selectedContractId={selectedContractId}
              sortState={sortState}
              onSortChange={onSortChange}
              onSelect={onSelect}
              hideModalidadeColumn
            />
          </div>

          <div className="px-4 py-4 sm:px-5 lg:hidden">
            <MobileContractList
              records={group.records}
              selectedContractId={selectedContractId}
              onSelect={onSelect}
              hideModalidade
            />
          </div>
        </article>
      ))}
    </div>
  );
}

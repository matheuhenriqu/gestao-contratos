import {
  Suspense,
  lazy,
  type ReactNode,
  startTransition,
  useDeferredValue,
  useEffect,
  useState,
} from "react";
import contractsData from "./data/contracts.json";
import { ContractDrawer } from "./components/ContractDrawer";
import { ContractsByModality } from "./components/ContractsByModality";
import { ExecutivePanels } from "./components/ExecutivePanels";
import { FiltersPanel } from "./components/FiltersPanel";
import { Header } from "./components/Header";
import { KpiCard } from "./components/KpiCard";
import { ModalityBoard } from "./components/ModalityBoard";
import type { ContractRecord, FiltersState, SortState } from "./types/contracts";
import {
  DEFAULT_FILTERS,
  DEFAULT_SORT,
  buildChartData,
  buildMetrics,
  buildModalitySummaries,
  collectFilterOptions,
  filterAndSortContracts,
  getActiveFilterCount,
  groupContractsByModality,
} from "./utils/contracts";
import { formatCompactNumber, formatCurrency } from "./utils/format";

const CONTRACTS = contractsData as ContractRecord[];
const ChartsSection = lazy(() => import("./components/ChartsSection"));

const SORT_PRESETS: Array<{ label: string; value: string; state: SortState }> = [
  {
    label: "Vencimento mais próximo",
    value: "daysToExpiry:asc",
    state: { key: "daysToExpiry", direction: "asc" },
  },
  {
    label: "Vencimento mais distante",
    value: "daysToExpiry:desc",
    state: { key: "daysToExpiry", direction: "desc" },
  },
  {
    label: "Maior valor",
    value: "valor:desc",
    state: { key: "valor", direction: "desc" },
  },
  {
    label: "Menor valor",
    value: "valor:asc",
    state: { key: "valor", direction: "asc" },
  },
  {
    label: "Empresa A-Z",
    value: "empresaContratada:asc",
    state: { key: "empresaContratada", direction: "asc" },
  },
  {
    label: "Empresa Z-A",
    value: "empresaContratada:desc",
    state: { key: "empresaContratada", direction: "desc" },
  },
];

function IconSquare({ children }: { children: ReactNode }) {
  return <div className="h-6 w-6">{children}</div>;
}

function ContractsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M7 4.5h10A1.5 1.5 0 0 1 18.5 6v12A1.5 1.5 0 0 1 17 19.5H7A1.5 1.5 0 0 1 5.5 18V6A1.5 1.5 0 0 1 7 4.5Z" />
      <path d="M8.5 9h7M8.5 12h7M8.5 15h4.5" />
    </svg>
  );
}

function CurrencyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M12 3.5v17" />
      <path d="M16.8 7.8c0-1.9-2.1-3.3-4.8-3.3S7.2 5.9 7.2 7.8 9 10.5 12 10.5s4.8 1.2 4.8 3.1-2.1 3.9-4.8 3.9-4.8-1.4-4.8-3.3" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="m5 12 4 4 10-10" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M12 8v5" />
      <path d="M12 17h.01" />
      <path d="M10.2 3.9 2.8 17a2 2 0 0 0 1.7 3h14.9a2 2 0 0 0 1.7-3L13.8 3.9a2 2 0 0 0-3.5 0Z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 1.8" />
    </svg>
  );
}

function DatabaseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M4 7.5C4 5.6 7.6 4 12 4s8 1.6 8 3.5S16.4 11 12 11 4 9.4 4 7.5Z" />
      <path d="M4 7.5V12c0 1.9 3.6 3.5 8 3.5s8-1.6 8-3.5V7.5" />
      <path d="M4 12v4.5C4 18.4 7.6 20 12 20s8-1.6 8-3.5V12" />
    </svg>
  );
}

export default function App() {
  const [filters, setFilters] = useState<FiltersState>(DEFAULT_FILTERS);
  const [sortState, setSortState] = useState<SortState>(DEFAULT_SORT);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);

  const deferredSearch = useDeferredValue(filters.search);
  const referenceDate = new Date();
  const referenceLabel = new Intl.DateTimeFormat("pt-BR").format(referenceDate);
  const filterOptions = collectFilterOptions(CONTRACTS);
  const appliedFilters = { ...filters, search: deferredSearch };

  const filteredContracts = filterAndSortContracts(
    CONTRACTS,
    appliedFilters,
    sortState,
    referenceDate,
  );

  const contractsForModalities = filterAndSortContracts(
    CONTRACTS,
    { ...appliedFilters, modalidade: "all" },
    sortState,
    referenceDate,
  );

  const metrics = buildMetrics(filteredContracts);
  const charts = buildChartData(filteredContracts);
  const modalitySummaries = buildModalitySummaries(contractsForModalities);
  const groupedContracts = groupContractsByModality(filteredContracts);
  const activeFilterCount = getActiveFilterCount(filters);
  const selectedContract =
    filteredContracts.find((contract) => contract.id === selectedContractId) ?? null;
  const selectedModalityLabel =
    filters.modalidade === "all" ? "Todas as modalidades" : filters.modalidade;
  const sortPresetValue = `${sortState.key}:${sortState.direction}`;

  useEffect(() => {
    if (
      selectedContractId &&
      !filteredContracts.some((contract) => contract.id === selectedContractId)
    ) {
      setSelectedContractId(null);
    }
  }, [filteredContracts, selectedContractId]);

  function updateFilter<Key extends keyof FiltersState>(
    key: Key,
    value: FiltersState[Key],
  ) {
    startTransition(() => {
      setFilters((current) => ({ ...current, [key]: value }));
    });
  }

  function resetFilters() {
    startTransition(() => {
      setFilters(DEFAULT_FILTERS);
    });
  }

  function handleSortToggle(key: SortState["key"]) {
    startTransition(() => {
      setSortState((current) => ({
        key,
        direction:
          current.key === key && current.direction === "asc" ? "desc" : "asc",
      }));
    });
  }

  function handleSortPresetChange(value: string) {
    const selectedPreset = SORT_PRESETS.find((preset) => preset.value === value);
    if (!selectedPreset) {
      return;
    }

    startTransition(() => {
      setSortState(selectedPreset.state);
    });
  }

  return (
    <div className="min-h-screen overflow-x-hidden pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <main className="mx-auto flex w-full max-w-[1560px] flex-col gap-5 px-4 py-4 sm:gap-6 sm:px-6 lg:px-8">
        <Header
          totalContracts={CONTRACTS.length}
          totalModalities={modalitySummaries.length}
          totalVisibleValue={formatCurrency(metrics.totalValue)}
          activeFilterCount={activeFilterCount}
          referenceLabel={referenceLabel}
        />

        <section id="resumo" className="space-y-4 scroll-mt-6">
          <div className="flex flex-col gap-2">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--brand)]">
              Resumo executivo
            </p>
            <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="section-title">Leitura imediata do recorte atual</h2>
                <p className="section-subtitle">
                  Indicadores consolidados para acompanhamento rápido da carteira
                  de contratos e dos pontos de atenção.
                </p>
              </div>
            </div>
          </div>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
            <KpiCard
              title="Total de contratos"
              value={formatCompactNumber(metrics.totalContracts)}
              note="Registros no recorte visível."
              accent="brand"
              icon={
                <IconSquare>
                  <ContractsIcon />
                </IconSquare>
              }
            />
            <KpiCard
              title="Valor total"
              value={formatCurrency(metrics.totalValue)}
              note="Soma dos valores numéricos informados."
              accent="neutral"
              icon={
                <IconSquare>
                  <CurrencyIcon />
                </IconSquare>
              }
            />
            <KpiCard
              title="Contratos ativos"
              value={formatCompactNumber(metrics.activeContracts)}
              note="Situação cadastrada como ativa."
              accent="success"
              icon={
                <IconSquare>
                  <CheckIcon />
                </IconSquare>
              }
            />
            <KpiCard
              title="Contratos vencidos"
              value={formatCompactNumber(metrics.expiredContracts)}
              note="Vigência encerrada antes da data de referência."
              accent="danger"
              icon={
                <IconSquare>
                  <AlertIcon />
                </IconSquare>
              }
            />
            <KpiCard
              title="Próximos do vencimento"
              value={formatCompactNumber(metrics.upcomingContracts)}
              note="Hoje, até 7 dias e até 30 dias."
              accent="warning"
              icon={
                <IconSquare>
                  <ClockIcon />
                </IconSquare>
              }
            />
            <KpiCard
              title="Dados incompletos"
              value={formatCompactNumber(metrics.incompleteContracts)}
              note="Campos essenciais com pendência."
              accent="neutral"
              icon={
                <IconSquare>
                  <DatabaseIcon />
                </IconSquare>
              }
            />
          </section>

          <ExecutivePanels
            records={filteredContracts}
            expiryChart={charts.expiryChart}
          />
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
          <div id="filtros" className="scroll-mt-6">
            <FiltersPanel
              filters={filters}
              options={filterOptions}
              activeFilterCount={activeFilterCount}
              mobileOpen={mobileFiltersOpen}
              onToggleMobile={() => setMobileFiltersOpen((current) => !current)}
              onReset={resetFilters}
              onChange={updateFilter}
            />
          </div>

          <div id="modalidades" className="scroll-mt-6">
            <ModalityBoard
              summaries={modalitySummaries}
              selectedModality={filters.modalidade}
              onSelect={(modality) => updateFilter("modalidade", modality)}
            />
          </div>
        </section>

        <section id="contratos" className="space-y-4 scroll-mt-6">
          <div className="panel p-4 sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--brand)]">
                  Painel principal
                </p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight text-[var(--text)]">
                  Contratos organizados por modalidade
                </h2>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  Leitura central do sistema, com agrupamento setorial e detalhe
                  completo por registro no desktop e no iPhone.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-end">
                <div className="rounded-2xl border border-[color:var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-sm text-[var(--muted)]">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                    Modalidade ativa
                  </p>
                  <p className="mt-1 font-medium text-[var(--text)]">
                    {selectedModalityLabel}
                  </p>
                </div>

                <div className="rounded-2xl border border-[color:var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-sm text-[var(--muted)]">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                    Registros visíveis
                  </p>
                  <p className="mt-1 font-medium text-[var(--text)]">
                    {formatCompactNumber(filteredContracts.length)}
                  </p>
                </div>

                <div className="rounded-2xl border border-[color:var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-sm text-[var(--muted)]">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                    Grupos visíveis
                  </p>
                  <p className="mt-1 font-medium text-[var(--text)]">
                    {formatCompactNumber(groupedContracts.length)}
                  </p>
                </div>

                <div className="min-w-0 sm:w-[16rem]">
                  <label className="field-label">Ordenação</label>
                  <select
                    className="field-shell"
                    value={sortPresetValue}
                    onChange={(event) => handleSortPresetChange(event.target.value)}
                  >
                    {SORT_PRESETS.map((preset) => (
                      <option key={preset.value} value={preset.value}>
                        {preset.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {filteredContracts.length === 0 ? (
            <div className="panel px-4 py-14 text-center sm:px-5">
              <div className="mx-auto max-w-md">
                <p className="text-lg font-semibold text-[var(--text)]">
                  Nenhum contrato encontrado.
                </p>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  Ajuste os filtros para ampliar a seleção ou limpe os recortes
                  aplicados.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-5 rounded-full bg-[var(--brand)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--brand-strong)]"
                >
                  Limpar filtros
                </button>
              </div>
            </div>
          ) : (
            <ContractsByModality
              groups={groupedContracts}
              selectedContractId={selectedContractId}
              sortState={sortState}
              onSortChange={handleSortToggle}
              onSelect={(contract) => setSelectedContractId(contract.id)}
            />
          )}
        </section>

        {filteredContracts.length > 0 ? (
          <div id="graficos" className="scroll-mt-6">
            <Suspense
              fallback={
                <section className="panel p-5">
                  <h2 className="section-title">Leitura analítica</h2>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    Carregando visualizações analíticas...
                  </p>
                </section>
              }
            >
              <ChartsSection {...charts} />
            </Suspense>
          </div>
        ) : null}
      </main>

      <ContractDrawer
        contract={selectedContract}
        onClose={() => setSelectedContractId(null)}
      />
    </div>
  );
}

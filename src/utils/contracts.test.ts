import { describe, expect, it } from "vitest";
import type { ContractRecord } from "../types/contracts";
import { formatCurrency, formatDate, formatText } from "./format";
import {
  DEFAULT_FILTERS,
  DEFAULT_SORT,
  buildMetrics,
  buildModalitySummaries,
  filterAndSortContracts,
  getDaysToExpiry,
  groupContractsByModality,
  paginateContracts,
} from "./contracts";

const referenceDate = new Date(2026, 3, 17);

const contracts: ContractRecord[] = [
  {
    id: "1",
    sourceIndex: 2,
    modalidade: "Pregão Eletrônico",
    numeroModalidade: "001/2026",
    objeto: "Serviço ativo",
    processo: "10/2026",
    contrato: "CT 001/2026",
    empresaContratada: "Empresa Alfa",
    valor: 100000,
    valorDescricao: null,
    dataInicio: "2026-01-01",
    dataVencimento: "2026-04-17",
    diasParaVencimentoPlanilha: 0,
    status: "Ativo",
    gestor: "Gestor Um",
    fiscal: "Fiscal Um",
    observacoes: null,
    missingFields: [],
    missingCount: 0,
    hasMissingData: false,
    searchText: "pregão eletrônico empresa alfa gestor um fiscal um",
  },
  {
    id: "2",
    sourceIndex: 3,
    modalidade: "Chamada Pública",
    numeroModalidade: "002/2026",
    objeto: "Contrato vencido",
    processo: "11/2026",
    contrato: "CT 002/2026",
    empresaContratada: "Empresa Beta",
    valor: 25000,
    valorDescricao: null,
    dataInicio: "2025-12-01",
    dataVencimento: "2026-04-10",
    diasParaVencimentoPlanilha: -7,
    status: "Vencido",
    gestor: "Gestor Dois",
    fiscal: null,
    observacoes: "Sem fiscal",
    missingFields: ["Fiscal"],
    missingCount: 1,
    hasMissingData: true,
    searchText: "chamada pública empresa beta gestor dois",
  },
  {
    id: "3",
    sourceIndex: 4,
    modalidade: "Prorrogação",
    numeroModalidade: null,
    objeto: "Contrato sem valor",
    processo: null,
    contrato: null,
    empresaContratada: "Empresa Gama",
    valor: null,
    valorDescricao: null,
    dataInicio: null,
    dataVencimento: null,
    diasParaVencimentoPlanilha: null,
    status: "Aguardando",
    gestor: null,
    fiscal: null,
    observacoes: null,
    missingFields: [
      "Nº Modalidade",
      "Processo",
      "Contrato",
      "Valor",
      "Data Início",
      "Data Vencimento",
      "Gestor",
      "Fiscal",
    ],
    missingCount: 8,
    hasMissingData: true,
    searchText: "prorrogação empresa gama aguardando",
  },
];

describe("contracts utils", () => {
  it("calcula dias para vencimento a partir da data", () => {
    expect(getDaysToExpiry(contracts[0], referenceDate)).toBe(0);
    expect(getDaysToExpiry(contracts[1], referenceDate)).toBe(-7);
  });

  it("filtra por busca, vencimento e pendência", () => {
    const result = filterAndSortContracts(
      contracts,
      {
        ...DEFAULT_FILTERS,
        search: "beta",
        expiryBand: "expired",
        pendingData: "missing",
      },
      DEFAULT_SORT,
      referenceDate,
    );

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("2");
  });

  it("ordena por valor decrescente", () => {
    const result = filterAndSortContracts(
      contracts,
      DEFAULT_FILTERS,
      { key: "valor", direction: "desc" },
      referenceDate,
    );

    expect(result.map((item) => item.id)).toEqual(["1", "2", "3"]);
  });

  it("paginar retorna página válida e fatia correta", () => {
    const result = paginateContracts([1, 2, 3, 4, 5], 3, 2);
    expect(result.page).toBe(3);
    expect(result.totalPages).toBe(3);
    expect(result.items).toEqual([5]);
  });

  it("métricas consolidadas respeitam status, vencidos e pendências", () => {
    const uiRecords = filterAndSortContracts(
      contracts,
      DEFAULT_FILTERS,
      DEFAULT_SORT,
      referenceDate,
    );
    const metrics = buildMetrics(uiRecords);

    expect(metrics.totalContracts).toBe(3);
    expect(metrics.activeContracts).toBe(1);
    expect(metrics.expiredContracts).toBe(1);
    expect(metrics.upcomingContracts).toBe(1);
    expect(metrics.incompleteContracts).toBe(2);
    expect(metrics.totalValue).toBe(125000);
  });

  it("resume os contratos por modalidade", () => {
    const uiRecords = filterAndSortContracts(
      contracts,
      DEFAULT_FILTERS,
      DEFAULT_SORT,
      referenceDate,
    );
    const summaries = buildModalitySummaries(uiRecords);
    const chamada = summaries.find((item) => item.name === "Chamada Pública");

    expect(summaries).toHaveLength(3);
    expect(chamada).toMatchObject({
      count: 1,
      totalValue: 25000,
      expiredCount: 1,
      incompleteCount: 1,
    });
  });

  it("agrupa os contratos em seções por modalidade", () => {
    const uiRecords = filterAndSortContracts(
      contracts,
      DEFAULT_FILTERS,
      DEFAULT_SORT,
      referenceDate,
    );
    const groups = groupContractsByModality(uiRecords);
    const prorrogacao = groups.find((item) => item.name === "Prorrogação");

    expect(groups).toHaveLength(3);
    expect(prorrogacao?.records.map((item) => item.id)).toEqual(["3"]);
    expect(prorrogacao?.incompleteCount).toBe(1);
  });
});

describe("format utils", () => {
  it("trata nulos sem quebrar a interface", () => {
    expect(formatText(null)).toBe("Não informado");
    expect(formatDate(null)).toBe("Não informado");
    expect(formatCurrency(null)).toBe("Não informado");
  });

  it("formata datas e valores em padrão brasileiro", () => {
    expect(formatDate("2026-04-17")).toBe("17/04/2026");
    expect(formatCurrency(125000)).toBe("R$\u00a0125.000,00");
  });
});

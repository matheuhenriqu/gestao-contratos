# Gestão de Contratos | Prefeitura de Iguape/SP

Aplicação estática institucional para consulta, organização e acompanhamento dos contratos da Prefeitura de Iguape/SP, construída a partir da planilha `CONTRATOS.xlsx`.

## Visão geral

O sistema foi desenhado para leitura rápida, operação administrativa e publicação estática no GitHub Pages.

Principais recursos:

- indicadores executivos com leitura imediata
- filtros combinados por status, modalidade, empresa, gestor, fiscal, vencimento, valor e pendências
- tabela principal com ordenação, paginação e destaque de criticidade
- experiência mobile com cards próprios para iPhone
- painel lateral de detalhes com todas as informações do contrato
- gráficos objetivos para apoio à gestão

## Stack

- Vite
- React
- TypeScript
- Tailwind CSS
- Recharts
- xlsx
- Vitest

## Como rodar localmente

Pré-requisito: Node.js 20+.

```bash
npm install
npm run dev
```

O ambiente local abre em `http://127.0.0.1:4173/`.

## Como atualizar os dados da planilha

O projeto publica dados estáticos e não depende de backend. A planilha original é convertida para `src/data/contracts.json`.

O script procura a planilha em:

1. `CONTRACTS_SOURCE` no ambiente
2. `./CONTRATOS.xlsx`
3. `../CONTRATOS.xlsx`
4. `../Downloads/CONTRATOS.xlsx`
5. `C:/Users/user/Downloads/CONTRATOS.xlsx`

Para atualizar:

```bash
npm run extract:data
```

Depois da atualização, gere uma nova build ou publique novamente.

## Scripts

- `npm run dev`: ambiente local
- `npm run test`: valida regras de dados e filtros
- `npm run build`: valida TypeScript e gera a build de produção
- `npm run preview`: serve a build local
- `npm run extract:data`: atualiza o JSON estático a partir da planilha

## Como gerar build

```bash
npm run build
```

Os arquivos finais são gerados em `dist/`.

## Como funciona o deploy

O deploy é feito por GitHub Actions usando o workflow em `.github/workflows/deploy-pages.yml`.

Fluxo:

1. instala dependências
2. executa testes
3. gera a build do Vite
4. publica o conteúdo de `dist/` no GitHub Pages

O `base` do Vite é resolvido a partir do nome do repositório no GitHub, o que mantém os assets, favicon e links estáticos funcionando corretamente após a publicação.

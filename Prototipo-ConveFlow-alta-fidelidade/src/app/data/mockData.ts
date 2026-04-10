export type EmpresaStatus = "ativa" | "inativa" | "suspensa";
export type ConvenioStatus = "ativo" | "suspenso" | "encerrado" | "a_vencer";
export type UsuarioPerfil = "admin" | "gestor" | "estagiario";

export interface Empresa {
  id: string;
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  ramoAtividade: string;
  status: EmpresaStatus;
  email: string;
  telefone: string;
  site?: string;
  cep: string;
  endereco: string;
  cidade: string;
  estado: string;
  representanteLegal: string;
  cargo: string;
  contato: string;
  createdAt: string;
  updatedAt?: string; 
}

export interface Convenio {
  id: string;
  empresaId: string;
  empresaNome: string;
  dataInicio: string;
  dataTermino: string;
  status: ConvenioStatus;
  responsavel: string;
  descricao: string;
  documentos: Documento[];
  historico: HistoricoItem[];
  createdAt: string;
}

export interface Documento {
  id: string;
  convenioId: string;
  nome: string;
  tipo: string;
  tamanho: string;
  storagePath?: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface HistoricoItem {
  id: string;
  data: string;
  tipo: "criacao" | "renovacao" | "alteracao" | "suspensao" | "encerramento";
  descricao: string;
  usuario: string;
}

export interface Alerta {
  id: string;
  convenioId: string;
  empresaNome: string;
  tipo: "vencimento_7" | "vencimento_15" | "vencimento_30" | "renovacao_pendente" | "acao_recente";
  mensagem: string;
  data: string;
  lido: boolean;
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  perfil: UsuarioPerfil;
  setor: string;
  status: "ativo" | "inativo";
  createdAt: string;
  ultimoAcesso: string;
}

export const empresas: Empresa[] = [
  { id: "e1", razaoSocial: "Supermercado Bom Preço Ltda", nomeFantasia: "Bom Preço", cnpj: "12.345.678/0001-90", ramoAtividade: "Alimentação", status: "ativa", email: "contato@bompreco.com.br", telefone: "(48) 3322-1100", site: "www.bompreco.com.br", cep: "88010-001", endereco: "Rua Felipe Schmidt, 450", cidade: "Florianópolis", estado: "SC", representanteLegal: "Carlos Eduardo Mendes", cargo: "Diretor Geral", contato: "(48) 99988-7766", createdAt: "2023-03-15" },
  { id: "e2", razaoSocial: "Farmácia Saúde Total S.A.", nomeFantasia: "Saúde Total", cnpj: "23.456.789/0001-01", ramoAtividade: "Saúde", status: "ativa", email: "rh@saudetotal.com.br", telefone: "(48) 3211-4400", site: "www.saudetotal.com.br", cep: "88020-300", endereco: "Av. Mauro Ramos, 1200", cidade: "Florianópolis", estado: "SC", representanteLegal: "Ana Paula Costa", cargo: "Gerente de RH", contato: "(48) 99877-5544", createdAt: "2023-05-20" },
  { id: "e3", razaoSocial: "Academia FitLife Eireli", nomeFantasia: "FitLife", cnpj: "34.567.890/0001-12", ramoAtividade: "Esporte e Lazer", status: "ativa", email: "admin@fitlife.com.br", telefone: "(48) 3366-7788", cep: "88060-001", endereco: "Rua Bocaiuva, 900", cidade: "Florianópolis", estado: "SC", representanteLegal: "Rodrigo Alves", cargo: "Sócio-Proprietário", contato: "(48) 99765-4433", createdAt: "2023-07-10" },
  { id: "e4", razaoSocial: "Restaurante Sabor da Terra Ltda", nomeFantasia: "Sabor da Terra", cnpj: "45.678.901/0001-23", ramoAtividade: "Alimentação", status: "inativa", email: "contato@sabordaterra.com.br", telefone: "(48) 3344-5566", cep: "88070-100", endereco: "Av. Beira Mar Norte, 2000", cidade: "Florianópolis", estado: "SC", representanteLegal: "Mariana Silva", cargo: "Proprietária", contato: "(48) 99654-3322", createdAt: "2022-11-01" },
  { id: "e5", razaoSocial: "Livraria Saber S.A.", nomeFantasia: "Livraria Saber", cnpj: "56.789.012/0001-34", ramoAtividade: "Educação", status: "ativa", email: "parcerias@livrasaber.com.br", telefone: "(48) 3255-6677", site: "www.livrasaber.com.br", cep: "88015-200", endereco: "Rua Conselheiro Mafra, 520", cidade: "Florianópolis", estado: "SC", representanteLegal: "Paulo Roberto Fonseca", cargo: "Diretor Comercial", contato: "(48) 99543-2211", createdAt: "2023-01-25" },
  { id: "e6", razaoSocial: "Clínica Odonto Prime Ltda", nomeFantasia: "Odonto Prime", cnpj: "67.890.123/0001-45", ramoAtividade: "Saúde", status: "ativa", email: "administrativo@odontoprime.com.br", telefone: "(48) 3199-0011", site: "www.odontoprime.com.br", cep: "88025-000", endereco: "Rua Tenente Silveira, 150", cidade: "Florianópolis", estado: "SC", representanteLegal: "Dra. Fernanda Luz", cargo: "Diretora Clínica", contato: "(48) 99432-1100", createdAt: "2023-09-05" },
  { id: "e7", razaoSocial: "Transporte Veloz Ltda", nomeFantasia: "Veloz", cnpj: "78.901.234/0001-56", ramoAtividade: "Transporte", status: "suspensa", email: "rh@veloz.com.br", telefone: "(48) 3088-9900", cep: "88080-100", endereco: "Rodovia SC-401, km 5", cidade: "Florianópolis", estado: "SC", representanteLegal: "Jorge Neto", cargo: "Gerente", contato: "(48) 99321-0099", createdAt: "2022-06-18" },
  { id: "e8", razaoSocial: "Papelaria Central Eireli", nomeFantasia: "Papelaria Central", cnpj: "89.012.345/0001-67", ramoAtividade: "Varejo", status: "ativa", email: "contato@papelariacentral.com.br", telefone: "(48) 3177-8899", cep: "88010-500", endereco: "Rua Arcipreste Paiva, 30", cidade: "Florianópolis", estado: "SC", representanteLegal: "Sandra Mello", cargo: "Gerente Comercial", contato: "(48) 99210-9988", createdAt: "2023-02-14" },
];

export const convenios: Convenio[] = [
  {
    id: "c1", empresaId: "e1", empresaNome: "Bom Preço", dataInicio: "2024-01-10", dataTermino: "2024-12-31", status: "a_vencer", responsavel: "Maria Oliveira", descricao: "Convênio de desconto em produtos alimentícios para servidores",
    documentos: [
      { id: "d1", convenioId: "c1", nome: "Minuta_BomPreco_2024.pdf", tipo: "PDF", tamanho: "1.2 MB", uploadedAt: "2024-01-10", uploadedBy: "Maria Oliveira" },
      { id: "d2", convenioId: "c1", nome: "Contrato_Assinado_BomPreco.pdf", tipo: "PDF", tamanho: "3.4 MB", uploadedAt: "2024-01-15", uploadedBy: "João Silva" },
    ],
    historico: [
      { id: "h1", data: "2024-01-10", tipo: "criacao", descricao: "Convênio criado no sistema", usuario: "Maria Oliveira" },
      { id: "h2", data: "2024-01-15", tipo: "alteracao", descricao: "Documentação complementar adicionada", usuario: "João Silva" },
    ],
    createdAt: "2024-01-10"
  },
  {
    id: "c2", empresaId: "e2", empresaNome: "Saúde Total", dataInicio: "2023-06-01", dataTermino: "2025-05-31", status: "ativo", responsavel: "João Silva", descricao: "Convênio farmacêutico com desconto de 15% para servidores e dependentes",
    documentos: [
      { id: "d3", convenioId: "c2", nome: "Contrato_SaudeTotal.pdf", tipo: "PDF", tamanho: "2.1 MB", uploadedAt: "2023-06-01", uploadedBy: "João Silva" },
    ],
    historico: [
      { id: "h3", data: "2023-06-01", tipo: "criacao", descricao: "Convênio criado no sistema", usuario: "João Silva" },
      { id: "h4", data: "2024-05-28", tipo: "renovacao", descricao: "Convênio renovado por mais 12 meses", usuario: "Maria Oliveira" },
    ],
    createdAt: "2023-06-01"
  },
  {
    id: "c3", empresaId: "e3", empresaNome: "FitLife", dataInicio: "2024-02-01", dataTermino: "2026-01-31", status: "ativo", responsavel: "Carlos Pereira", descricao: "Planos de academia com mensalidade reduzida",
    documentos: [
      { id: "d4", convenioId: "c3", nome: "Minuta_FitLife.pdf", tipo: "PDF", tamanho: "980 KB", uploadedAt: "2024-02-01", uploadedBy: "Carlos Pereira" },
    ],
    historico: [
      { id: "h5", data: "2024-02-01", tipo: "criacao", descricao: "Convênio criado no sistema", usuario: "Carlos Pereira" },
    ],
    createdAt: "2024-02-01"
  },
  {
    id: "c4", empresaId: "e4", empresaNome: "Sabor da Terra", dataInicio: "2022-11-01", dataTermino: "2023-10-31", status: "encerrado", responsavel: "Maria Oliveira", descricao: "Convênio de refeições empresariais encerrado",
    documentos: [],
    historico: [
      { id: "h6", data: "2022-11-01", tipo: "criacao", descricao: "Convênio criado no sistema", usuario: "Maria Oliveira" },
      { id: "h7", data: "2023-10-31", tipo: "encerramento", descricao: "Convênio encerrado por término de vigência", usuario: "Sistema" },
    ],
    createdAt: "2022-11-01"
  },
  {
    id: "c5", empresaId: "e5", empresaNome: "Livraria Saber", dataInicio: "2024-03-15", dataTermino: "2025-03-14", status: "a_vencer", responsavel: "Ana Costa", descricao: "Desconto de 20% em livros técnicos e didáticos",
    documentos: [
      { id: "d5", convenioId: "c5", nome: "Contrato_LivSaber.pdf", tipo: "PDF", tamanho: "1.7 MB", uploadedAt: "2024-03-15", uploadedBy: "Ana Costa" },
      { id: "d6", convenioId: "c5", nome: "Anexo_Catalogo.xlsx", tipo: "XLSX", tamanho: "450 KB", uploadedAt: "2024-03-16", uploadedBy: "Ana Costa" },
    ],
    historico: [
      { id: "h8", data: "2024-03-15", tipo: "criacao", descricao: "Convênio criado no sistema", usuario: "Ana Costa" },
    ],
    createdAt: "2024-03-15"
  },
  {
    id: "c6", empresaId: "e6", empresaNome: "Odonto Prime", dataInicio: "2024-05-01", dataTermino: "2026-04-30", status: "ativo", responsavel: "João Silva", descricao: "Atendimento odontológico com planos especiais",
    documentos: [
      { id: "d7", convenioId: "c6", nome: "Contrato_OdontoPrime.pdf", tipo: "PDF", tamanho: "2.9 MB", uploadedAt: "2024-05-01", uploadedBy: "João Silva" },
    ],
    historico: [
      { id: "h9", data: "2024-05-01", tipo: "criacao", descricao: "Convênio criado no sistema", usuario: "João Silva" },
    ],
    createdAt: "2024-05-01"
  },
  {
    id: "c7", empresaId: "e7", empresaNome: "Veloz", dataInicio: "2023-01-10", dataTermino: "2024-01-09", status: "suspenso", responsavel: "Carlos Pereira", descricao: "Transporte de funcionários — suspenso por irregularidades",
    documentos: [
      { id: "d8", convenioId: "c7", nome: "Contrato_Veloz.pdf", tipo: "PDF", tamanho: "1.5 MB", uploadedAt: "2023-01-10", uploadedBy: "Carlos Pereira" },
    ],
    historico: [
      { id: "h10", data: "2023-01-10", tipo: "criacao", descricao: "Convênio criado no sistema", usuario: "Carlos Pereira" },
      { id: "h11", data: "2023-08-20", tipo: "suspensao", descricao: "Convênio suspenso por irregularidades fiscais da empresa", usuario: "Maria Oliveira" },
    ],
    createdAt: "2023-01-10"
  },
  {
    id: "c8", empresaId: "e8", empresaNome: "Papelaria Central", dataInicio: "2024-04-01", dataTermino: "2025-03-31", status: "a_vencer", responsavel: "Ana Costa", descricao: "Fornecimento de material de escritório com desconto",
    documentos: [
      { id: "d9", convenioId: "c8", nome: "Contrato_Papelaria.pdf", tipo: "PDF", tamanho: "1.1 MB", uploadedAt: "2024-04-01", uploadedBy: "Ana Costa" },
    ],
    historico: [
      { id: "h12", data: "2024-04-01", tipo: "criacao", descricao: "Convênio criado no sistema", usuario: "Ana Costa" },
    ],
    createdAt: "2024-04-01"
  },
];

export const alertas: Alerta[] = [
  { id: "a1", convenioId: "c1", empresaNome: "Bom Preço", tipo: "vencimento_7", mensagem: "Convênio vence em 7 dias (31/12/2024)", data: "2024-12-24", lido: false },
  { id: "a2", convenioId: "c5", empresaNome: "Livraria Saber", tipo: "vencimento_15", mensagem: "Convênio vence em 14 dias (14/03/2025)", data: "2025-02-28", lido: false },
  { id: "a3", convenioId: "c8", empresaNome: "Papelaria Central", tipo: "vencimento_30", mensagem: "Convênio vence em 28 dias (31/03/2025)", data: "2025-03-03", lido: false },
  { id: "a4", convenioId: "c1", empresaNome: "Bom Preço", tipo: "renovacao_pendente", mensagem: "Renovação do convênio pendente de assinatura", data: "2024-12-20", lido: true },
  { id: "a5", convenioId: "c7", empresaNome: "Veloz", tipo: "acao_recente", mensagem: "Convênio suspenso por irregularidades fiscais", data: "2023-08-20", lido: true },
  { id: "a6", convenioId: "c6", empresaNome: "Odonto Prime", tipo: "acao_recente", mensagem: "Novo convênio cadastrado com sucesso", data: "2024-05-01", lido: true },
];

export const usuarios: Usuario[] = [
  { id: "u1", nome: "Maria Oliveira", email: "maria.oliveira@instituicao.edu.br", perfil: "admin", setor: "TEIA", status: "ativo", createdAt: "2022-01-10", ultimoAcesso: "2025-03-25" },
  { id: "u2", nome: "João Silva", email: "joao.silva@instituicao.edu.br", perfil: "gestor", setor: "Núcleo de Carreiras", status: "ativo", createdAt: "2022-03-15", ultimoAcesso: "2025-03-24" },
  { id: "u3", nome: "Carlos Pereira", email: "carlos.pereira@instituicao.edu.br", perfil: "gestor", setor: "TEIA", status: "ativo", createdAt: "2022-06-20", ultimoAcesso: "2025-03-23" },
  { id: "u4", nome: "Ana Costa", email: "ana.costa@instituicao.edu.br", perfil: "gestor", setor: "Núcleo de Carreiras", status: "ativo", createdAt: "2023-01-05", ultimoAcesso: "2025-03-22" },
  { id: "u5", nome: "Pedro Lima", email: "pedro.lima@instituicao.edu.br", perfil: "estagiario", setor: "TEIA", status: "ativo", createdAt: "2024-02-10", ultimoAcesso: "2025-03-21" },
  { id: "u6", nome: "Fernanda Santos", email: "fernanda.santos@instituicao.edu.br", perfil: "estagiario", setor: "Núcleo de Carreiras", status: "inativo", createdAt: "2023-07-18", ultimoAcesso: "2024-12-15" },
];

export const conveniosPorMes = [
  { mes: "Jul", ativos: 5, novos: 1 },
  { mes: "Ago", ativos: 5, novos: 0 },
  { mes: "Set", ativos: 6, novos: 1 },
  { mes: "Out", ativos: 6, novos: 2 },
  { mes: "Nov", ativos: 7, novos: 1 },
  { mes: "Dez", ativos: 7, novos: 0 },
  { mes: "Jan", ativos: 7, novos: 2 },
  { mes: "Fev", ativos: 8, novos: 1 },
  { mes: "Mar", ativos: 8, novos: 1 },
];

export const conveniosPorRamo = [
  { ramo: "Saúde", quantidade: 2 },
  { ramo: "Alimentação", quantidade: 2 },
  { ramo: "Educação", quantidade: 1 },
  { ramo: "Esporte", quantidade: 1 },
  { ramo: "Transporte", quantidade: 1 },
  { ramo: "Varejo", quantidade: 1 },
];

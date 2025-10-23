
export enum CategoriaProduto {
  ALIMENTO = 'Alimento',
  BEBIDA = 'Bebida',
  LIMPEZA = 'Limpeza',
  HIGIENE = 'Higiene',
  HORTIFRUTI = 'Hortifruti',
  ACOUGUE = 'Açougue',
}

export enum TipoBonificacao {
  PRODUTO = 'Produto',
  DESCONTO_NOTA = 'Desconto em Nota',
  CREDITO = 'Crédito',
}

export enum MotivoPerda {
  VENCIMENTO = 'Vencimento',
  AVARIA = 'Avaria',
  FURTO = 'Furto',
  QUEBRA_OPERACIONAL = 'Quebra Operacional',
}

export interface Fornecedor {
  id: string;
  nome: string;
  cnpj: string;
  contato: string;
  telefone: string;
  categoria: CategoriaProduto;
  tipo: 'Indústria' | 'Distribuidor' | 'Representante';
  dataInicioParceria: string;
  status: boolean;
  avaliacao: number; // 1 to 5
}

export interface Bonificacao {
  id: string;
  fornecedorId: string;
  tipo: TipoBonificacao;
  valorTotal: number;
  dataNegociacao: string;
  status: 'Pendente' | 'Recebido';
  observacoes: string;
}

export interface ProdutoBonificado {
    id: string;
    bonificacaoId: string;
    produto: string;
    quantidade: number;
    valorUnitario: number;
    dataRecebimento: string;
}

export interface Perda {
  id: string;
  produto: string;
  categoria: CategoriaProduto;
  motivo: MotivoPerda;
  quantidade: number;
  valorTotal: number;
  responsavel: 'Fornecedor' | 'Loja' | 'Transporte';
  fornecedorId?: string;
  data: string;
}

export interface PontoGondola {
  id: string;
  fornecedorId: string;
  tipo: 'Ponta de gôndola' | 'Ilha' | 'Checkout' | 'Display';
  valorAcordado: number;
  contrapartida: string;
  vigenciaInicio: string;
  vigenciaFim: string;
  status: 'Ativo' | 'Expirado';
}

export interface Negociacao {
  id: string;
  fornecedorId: string;
  dataNegociacao: string;
  itensNegociados: string;
  condicoesComerciais: string;
  resultado: string;
  valorTotalGanho: number;
}

export type StatusTarefa = 'pendente' | 'concluida';
export type Prioridade = 'baixa' | 'media' | 'alta';

export interface Tarefa {
  id: string;
  titulo: string;
  descricao?: string;
  categoria?: string;
  prioridade: Prioridade;
  data_vencimento?: string; // ISO: YYYY-MM-DD
  status: StatusTarefa;
}

export interface ListaCompra {
  id: string;
  nome: string;
  data_criacao: string; // ISO: YYYY-MM-DD
}

export interface ItemCompra {
  id: string;
  lista_id: string;
  nome: string;
  quantidade?: string; // ex: "2 caixas", "5kg"
  observacao?: string;
  comprado: boolean;
}

export interface Evento {
  id: string;
  titulo: string;
  data_inicio: string; // ISO: YYYY-MM-DD
  data_fim?: string;   // ISO: YYYY-MM-DD
  categoria?: string;  // pessoal, manutenção, limpeza...
  descricao?: string;
}

export interface Lembrete {
  id: string;
  titulo: string;
  data: string; // ISO: YYYY-MM-DD
  hora?: string; // HH:mm
  categoria?: string; // pagamento, manutenção, evento, pessoal
  descricao?: string;
}

// Tipos para o módulo financeiro
export type TipoTransacao = 'receita' | 'despesa';
export type StatusMeta = 'ativa' | 'concluida' | 'pausada';

export interface CategoriaFinanceira {
  id: string;
  nome: string;
  tipo: TipoTransacao;
  cor: string; // hex color
  icone: string; // emoji ou nome do ícone
}

export interface Transacao {
  id: string;
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  categoria_id: string;
  data: string; // ISO: YYYY-MM-DD
  observacao?: string;
  origem?: 'manual' | 'compra' | 'tarefa'; // para rastrear integrações
  origem_id?: string; // ID da compra/tarefa que gerou a transação
}

export interface MetaFinanceira {
  id: string;
  titulo: string;
  descricao?: string;
  valor_objetivo: number;
  valor_atual: number;
  data_inicio: string; // ISO: YYYY-MM-DD
  data_limite: string; // ISO: YYYY-MM-DD
  status: StatusMeta;
  categoria?: string;
}

export interface ResumoFinanceiro {
  saldo_atual: number;
  receitas_mes: number;
  despesas_mes: number;
  economia_mes: number;
  transacoes_recentes: Transacao[];
}
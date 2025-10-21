import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import type { 
  Transacao, 
  CategoriaFinanceira, 
  MetaFinanceira, 
  TipoTransacao, 
  StatusMeta,
  ResumoFinanceiro 
} from './types';

interface FinanceState {
  transacoes: Transacao[];
  categorias: CategoriaFinanceira[];
  metas: MetaFinanceira[];
}

interface FinanceActions {
  // Transações
  addTransacao: (data: Omit<Transacao, 'id'>) => string;
  updateTransacao: (id: string, changes: Partial<Transacao>) => void;
  deleteTransacao: (id: string) => void;
  getTransacoesPorPeriodo: (dataInicio: string, dataFim: string) => Transacao[];
  getTransacoesPorCategoria: (categoriaId: string) => Transacao[];

  // Categorias
  addCategoria: (data: Omit<CategoriaFinanceira, 'id'>) => string;
  updateCategoria: (id: string, changes: Partial<CategoriaFinanceira>) => void;
  deleteCategoria: (id: string) => void;
  getCategoriasPorTipo: (tipo: TipoTransacao) => CategoriaFinanceira[];

  // Metas
  addMeta: (data: Omit<MetaFinanceira, 'id'>) => string;
  updateMeta: (id: string, changes: Partial<MetaFinanceira>) => void;
  deleteMeta: (id: string) => void;
  updateProgressoMeta: (id: string, novoValor: number) => void;

  // Relatórios e resumos
  getResumoFinanceiro: () => ResumoFinanceiro;
  getSaldoAtual: () => number;
  getReceitasMes: (ano?: number, mes?: number) => number;
  getDespesasMes: (ano?: number, mes?: number) => number;
  getDespesasPorCategoria: (ano?: number, mes?: number) => { categoria: string; valor: number; cor: string }[];

  // Integrações
  criarTransacaoDeCompra: (compraId: string, descricao: string, valor: number, categoriaId: string) => string;
  criarTransacaoDeTarefa: (tarefaId: string, descricao: string, valor: number, categoriaId: string) => string;
}

// Categorias padrão do sistema
const categoriasIniciais: CategoriaFinanceira[] = [
  // Despesas
  { id: 'cat-alimentacao', nome: 'Alimentação', tipo: 'despesa', cor: '#ef4444', icone: '🍽️' },
  { id: 'cat-contas', nome: 'Contas', tipo: 'despesa', cor: '#f97316', icone: '📄' },
  { id: 'cat-lazer', nome: 'Lazer', tipo: 'despesa', cor: '#8b5cf6', icone: '🎉' },
  { id: 'cat-transporte', nome: 'Transporte', tipo: 'despesa', cor: '#06b6d4', icone: '🚗' },
  { id: 'cat-saude', nome: 'Saúde', tipo: 'despesa', cor: '#ec4899', icone: '🏥' },
  { id: 'cat-casa', nome: 'Casa', tipo: 'despesa', cor: '#84cc16', icone: '🏠' },
  
  // Receitas
  { id: 'cat-salario', nome: 'Salário', tipo: 'receita', cor: '#22c55e', icone: '💼' },
  { id: 'cat-freelance', nome: 'Freelance', tipo: 'receita', cor: '#3b82f6', icone: '💻' },
  { id: 'cat-reembolso', nome: 'Reembolso', tipo: 'receita', cor: '#10b981', icone: '💰' },
  { id: 'cat-investimento', nome: 'Investimento', tipo: 'receita', cor: '#6366f1', icone: '📈' },
];

export const useFinanceStore = create<FinanceState & FinanceActions>()(
  persist(
    (set, get) => ({
      transacoes: [],
      categorias: categoriasIniciais,
      metas: [],

      // Transações
      addTransacao: (data) => {
        const id = nanoid();
        const novaTransacao: Transacao = { ...data, id };
        set((state) => ({
          transacoes: [...state.transacoes, novaTransacao]
        }));
        return id;
      },

      updateTransacao: (id, changes) => {
        set((state) => ({
          transacoes: state.transacoes.map(t => 
            t.id === id ? { ...t, ...changes } : t
          )
        }));
      },

      deleteTransacao: (id) => {
        set((state) => ({
          transacoes: state.transacoes.filter(t => t.id !== id)
        }));
      },

      getTransacoesPorPeriodo: (dataInicio, dataFim) => {
        const { transacoes } = get();
        return transacoes.filter(t => 
          t.data >= dataInicio && t.data <= dataFim
        );
      },

      getTransacoesPorCategoria: (categoriaId) => {
        const { transacoes } = get();
        return transacoes.filter(t => t.categoria_id === categoriaId);
      },

      // Categorias
      addCategoria: (data) => {
        const id = nanoid();
        const novaCategoria: CategoriaFinanceira = { ...data, id };
        set((state) => ({
          categorias: [...state.categorias, novaCategoria]
        }));
        return id;
      },

      updateCategoria: (id, changes) => {
        set((state) => ({
          categorias: state.categorias.map(c => 
            c.id === id ? { ...c, ...changes } : c
          )
        }));
      },

      deleteCategoria: (id) => {
        set((state) => ({
          categorias: state.categorias.filter(c => c.id !== id)
        }));
      },

      getCategoriasPorTipo: (tipo) => {
        const { categorias } = get();
        return categorias.filter(c => c.tipo === tipo);
      },

      // Metas
      addMeta: (data) => {
        const id = nanoid();
        const novaMeta: MetaFinanceira = { ...data, id };
        set((state) => ({
          metas: [...state.metas, novaMeta]
        }));
        return id;
      },

      updateMeta: (id, changes) => {
        set((state) => ({
          metas: state.metas.map(m => 
            m.id === id ? { ...m, ...changes } : m
          )
        }));
      },

      deleteMeta: (id) => {
        set((state) => ({
          metas: state.metas.filter(m => m.id !== id)
        }));
      },

      updateProgressoMeta: (id, novoValor) => {
        set((state) => ({
          metas: state.metas.map(m => 
            m.id === id ? { ...m, valor_atual: novoValor } : m
          )
        }));
      },

      // Relatórios e resumos
      getResumoFinanceiro: () => {
        const { transacoes } = get();
        const hoje = new Date();
        const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1).toISOString().split('T')[0];
        const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).toISOString().split('T')[0];
        
        const transacoesMes = transacoes.filter(t => 
          t.data >= inicioMes && t.data <= fimMes
        );

        const receitas_mes = transacoesMes
          .filter(t => t.tipo === 'receita')
          .reduce((sum, t) => sum + t.valor, 0);

        const despesas_mes = transacoesMes
          .filter(t => t.tipo === 'despesa')
          .reduce((sum, t) => sum + t.valor, 0);

        const saldo_atual = receitas_mes - despesas_mes;
        const economia_mes = receitas_mes > 0 ? (saldo_atual / receitas_mes) * 100 : 0;

        const transacoes_recentes = transacoes
          .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
          .slice(0, 5);

        return {
          saldo_atual,
          receitas_mes,
          despesas_mes,
          economia_mes,
          transacoes_recentes
        };
      },

      getSaldoAtual: () => {
        const { transacoes } = get();
        const receitas = transacoes
          .filter(t => t.tipo === 'receita')
          .reduce((sum, t) => sum + t.valor, 0);
        const despesas = transacoes
          .filter(t => t.tipo === 'despesa')
          .reduce((sum, t) => sum + t.valor, 0);
        return receitas - despesas;
      },

      getReceitasMes: (ano, mes) => {
        const { transacoes } = get();
        const dataAtual = new Date();
        const anoFiltro = ano ?? dataAtual.getFullYear();
        const mesFiltro = mes ?? dataAtual.getMonth() + 1;
        
        return transacoes
          .filter(t => {
            const dataTransacao = new Date(t.data);
            return t.tipo === 'receita' && 
                   dataTransacao.getFullYear() === anoFiltro &&
                   dataTransacao.getMonth() + 1 === mesFiltro;
          })
          .reduce((sum, t) => sum + t.valor, 0);
      },

      getDespesasMes: (ano, mes) => {
        const { transacoes } = get();
        const dataAtual = new Date();
        const anoFiltro = ano ?? dataAtual.getFullYear();
        const mesFiltro = mes ?? dataAtual.getMonth() + 1;
        
        return transacoes
          .filter(t => {
            const dataTransacao = new Date(t.data);
            return t.tipo === 'despesa' && 
                   dataTransacao.getFullYear() === anoFiltro &&
                   dataTransacao.getMonth() + 1 === mesFiltro;
          })
          .reduce((sum, t) => sum + t.valor, 0);
      },

      getDespesasPorCategoria: (ano, mes) => {
        const { transacoes, categorias } = get();
        const dataAtual = new Date();
        const anoFiltro = ano ?? dataAtual.getFullYear();
        const mesFiltro = mes ?? dataAtual.getMonth() + 1;
        
        const despesasMes = transacoes.filter(t => {
          const dataTransacao = new Date(t.data);
          return t.tipo === 'despesa' && 
                 dataTransacao.getFullYear() === anoFiltro &&
                 dataTransacao.getMonth() + 1 === mesFiltro;
        });

        const despesasPorCategoria = despesasMes.reduce((acc, transacao) => {
          const categoria = categorias.find(c => c.id === transacao.categoria_id);
          if (categoria) {
            if (!acc[categoria.id]) {
              acc[categoria.id] = {
                categoria: categoria.nome,
                valor: 0,
                cor: categoria.cor
              };
            }
            acc[categoria.id].valor += transacao.valor;
          }
          return acc;
        }, {} as Record<string, { categoria: string; valor: number; cor: string }>);

        return Object.values(despesasPorCategoria);
      },

      // Integrações
      criarTransacaoDeCompra: (compraId, descricao, valor, categoriaId) => {
        const id = nanoid();
        const novaTransacao: Transacao = {
          id,
          descricao,
          valor,
          tipo: 'despesa',
          categoria_id: categoriaId,
          data: new Date().toISOString().split('T')[0],
          origem: 'compra',
          origem_id: compraId
        };
        set((state) => ({
          transacoes: [...state.transacoes, novaTransacao]
        }));
        return id;
      },

      criarTransacaoDeTarefa: (tarefaId, descricao, valor, categoriaId) => {
        const id = nanoid();
        const novaTransacao: Transacao = {
          id,
          descricao,
          valor,
          tipo: 'receita',
          categoria_id: categoriaId,
          data: new Date().toISOString().split('T')[0],
          origem: 'tarefa',
          origem_id: tarefaId
        };
        set((state) => ({
          transacoes: [...state.transacoes, novaTransacao]
        }));
        return id;
      },
    }),
    {
      name: 'finance-storage',
    }
  )
);
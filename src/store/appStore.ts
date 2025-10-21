import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import type { Tarefa, ListaCompra, ItemCompra, Evento, Lembrete, StatusTarefa, Prioridade } from './types';

interface AppState {
  tarefas: Tarefa[];
  listas: ListaCompra[];
  itens: ItemCompra[]; // itens de todas as listas
  eventos: Evento[];
  lembretes: Lembrete[];
}

interface AppActions {
  // Tarefas
  addTarefa: (data: Omit<Tarefa, 'id'>) => string;
  updateTarefa: (id: string, changes: Partial<Tarefa>) => void;
  deleteTarefa: (id: string) => void;

  // Listas e itens
  addLista: (nome: string) => string;
  renameLista: (id: string, nome: string) => void;
  deleteLista: (id: string) => void;
  duplicateLista: (id: string) => string; // retorna novo id

  addItem: (lista_id: string, nome: string, quantidade?: string, observacao?: string) => string;
  toggleItemComprado: (id: string, comprado?: boolean) => void;
  updateItem: (id: string, changes: Partial<ItemCompra>) => void;
  deleteItem: (id: string) => void;

  // Eventos
  addEvento: (data: Omit<Evento, 'id'>) => string;
  updateEvento: (id: string, changes: Partial<Evento>) => void;
  deleteEvento: (id: string) => void;

  // Lembretes
  addLembrete: (data: Omit<Lembrete, 'id'>) => string;
  updateLembrete: (id: string, changes: Partial<Lembrete>) => void;
  deleteLembrete: (id: string) => void;
}

export const useAppStore = create<AppState & AppActions>()(
  persist(
    (set, get) => ({
      tarefas: [],
      listas: [],
      itens: [],
      eventos: [],
      lembretes: [],

      addTarefa: (data) => {
        const id = nanoid();
        set((state) => ({ tarefas: [...state.tarefas, { id, ...data }] }));
        return id;
      },
      updateTarefa: (id, changes) => {
        set((state) => ({ tarefas: state.tarefas.map(t => t.id === id ? { ...t, ...changes } : t) }));
      },
      deleteTarefa: (id) => {
        set((state) => ({ tarefas: state.tarefas.filter(t => t.id !== id) }));
      },

      addLista: (nome) => {
        const id = nanoid();
        const data_criacao = new Date().toISOString().slice(0,10);
        set((state) => ({ listas: [...state.listas, { id, nome, data_criacao }] }));
        return id;
      },
      renameLista: (id, nome) => {
        set((state) => ({ listas: state.listas.map(l => l.id === id ? { ...l, nome } : l) }));
      },
      deleteLista: (id) => {
        set((state) => ({
          listas: state.listas.filter(l => l.id !== id),
          itens: state.itens.filter(i => i.lista_id !== id),
        }));
      },
      duplicateLista: (id) => {
        const lista = get().listas.find(l => l.id === id);
        if (!lista) return '';
        const novoId = nanoid();
        const novaLista = { ...lista, id: novoId, nome: `${lista.nome} (cópia)` };
        const itensDaLista = get().itens.filter(i => i.lista_id === id);
        const novosItens = itensDaLista.map(i => ({ ...i, id: nanoid(), lista_id: novoId, comprado: false }));
        set((state) => ({
          listas: [...state.listas, novaLista],
          itens: [...state.itens, ...novosItens],
        }));
        return novoId;
      },

      addItem: (lista_id, nome, quantidade, observacao) => {
        const id = nanoid();
        set((state) => ({ itens: [...state.itens, { id, lista_id, nome, quantidade, observacao, comprado: false }] }));
        return id;
      },
      toggleItemComprado: (id, comprado) => {
        set((state) => ({ itens: state.itens.map(i => i.id === id ? { ...i, comprado: comprado ?? !i.comprado } : i) }));
      },
      updateItem: (id, changes) => {
        set((state) => ({ itens: state.itens.map(i => i.id === id ? { ...i, ...changes } : i) }));
      },
      deleteItem: (id) => {
        set((state) => ({ itens: state.itens.filter(i => i.id !== id) }));
      },

      addEvento: (data) => {
        const id = nanoid();
        set((state) => ({ eventos: [...state.eventos, { id, ...data }] }));
        return id;
      },
      updateEvento: (id, changes) => {
        set((state) => ({ eventos: state.eventos.map(e => e.id === id ? { ...e, ...changes } : e) }));
      },
      deleteEvento: (id) => {
        set((state) => ({ eventos: state.eventos.filter(e => e.id !== id) }));
      },

      addLembrete: (data) => {
        const id = nanoid();
        set((state) => ({ lembretes: [...state.lembretes, { id, ...data }] }));
        return id;
      },
      updateLembrete: (id, changes) => {
        set((state) => ({ lembretes: state.lembretes.map(l => l.id === id ? { ...l, ...changes } : l) }));
      },
      deleteLembrete: (id) => {
        set((state) => ({ lembretes: state.lembretes.filter(l => l.id !== id) }));
      },
    }),
    {
      name: 'cia-app-store',
      version: 1,
      partialize: (state) => ({
        tarefas: state.tarefas,
        listas: state.listas,
        itens: state.itens,
        eventos: state.eventos,
        lembretes: state.lembretes,
      }),
    }
  )
);

export type { Tarefa, ListaCompra, ItemCompra, Evento, Lembrete, StatusTarefa, Prioridade };
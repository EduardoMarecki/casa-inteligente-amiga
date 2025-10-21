import { useMemo, useState } from 'react';
import { useAppStore } from '../store/appStore';

const ShoppingPageImpl = () => {
  const { listas, itens, addLista, renameLista, deleteLista, duplicateLista, addItem, toggleItemComprado, deleteItem } = useAppStore();
  const [novoNomeLista, setNovoNomeLista] = useState('');
  const [selectedListId, setSelectedListId] = useState<string | null>(null);

  const itensDaSelecionada = useMemo(() => itens.filter(i => i.lista_id === selectedListId), [itens, selectedListId]);

  const [nomeItem, setNomeItem] = useState('');
  const [quantidadeItem, setQuantidadeItem] = useState('');
  const [observacaoItem, setObservacaoItem] = useState('');

  const criarLista = () => {
    if (!novoNomeLista.trim()) return;
    const id = addLista(novoNomeLista.trim());
    setNovoNomeLista('');
    setSelectedListId(id);
  };

  const duplicarSelecionada = () => {
    if (!selectedListId) return;
    const novoId = duplicateLista(selectedListId);
    if (novoId) setSelectedListId(novoId);
  };

  const adicionarItem = () => {
    if (!selectedListId || !nomeItem.trim()) return;
    addItem(selectedListId, nomeItem.trim(), quantidadeItem.trim() || undefined, observacaoItem.trim() || undefined);
    setNomeItem('');
    setQuantidadeItem('');
    setObservacaoItem('');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Listas de Compras</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1 space-y-4">
          <div className="card bg-base-100 shadow-sm border border-base-300">
            <div className="card-body">
              <h2 className="card-title">Nova Lista</h2>
              <div className="flex gap-2">
                <input className="input input-bordered w-full" placeholder="Ex: Supermercado" value={novoNomeLista} onChange={e => setNovoNomeLista(e.target.value)} />
                <button className="btn btn-primary" onClick={criarLista}>Criar</button>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-sm border border-base-300">
            <div className="card-body">
              <h2 className="card-title">Minhas Listas</h2>
              <ul className="menu bg-base-100/80 rounded-box border border-base-300 shadow-sm">
                {listas.map(l => (
                  <li key={l.id}>
                    <a className={selectedListId === l.id ? 'active' : ''} onClick={() => setSelectedListId(l.id)}>
                      {l.nome}
                    </a>
                    <div className="flex gap-2 mt-2">
                      <button className="btn btn-sm" onClick={() => setSelectedListId(l.id)}>Abrir</button>
                      <button className="btn btn-sm btn-outline" onClick={() => renameLista(l.id, prompt('Novo nome da lista?', l.nome) || l.nome)}>Renomear</button>
                      <button className="btn btn-sm btn-secondary" onClick={() => duplicateLista(l.id)}>Duplicar</button>
                      <button className="btn btn-sm btn-error" onClick={() => { if (confirm('Excluir a lista e seus itens?')) deleteLista(l.id); }}>Excluir</button>
                    </div>
                  </li>
                ))}
                {listas.length === 0 && <li><span>Nenhuma lista criada.</span></li>}
              </ul>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-4">
          <div className="card bg-base-100 shadow-sm border border-base-300">
            <div className="card-body">
              <h2 className="card-title">Itens da Lista</h2>
              {!selectedListId ? (
                <div className="alert shadow-sm">Selecione uma lista para ver os itens.</div>
              ) : (
                <>
                  <div className="flex gap-2">
                    <input className="input input-bordered w-full" placeholder="Ex: Leite" value={nomeItem} onChange={e => setNomeItem(e.target.value)} />
                    <input className="input input-bordered" placeholder="Quantidade" value={quantidadeItem} onChange={e => setQuantidadeItem(e.target.value)} />
                    <input className="input input-bordered" placeholder="Observação" value={observacaoItem} onChange={e => setObservacaoItem(e.target.value)} />
                    <button className="btn btn-primary" onClick={adicionarItem}>Adicionar</button>
                  </div>
                  <div className="divider" />
                  <ul className="space-y-2">
                    {itensDaSelecionada.map(i => (
                      <li key={i.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <input type="checkbox" className="checkbox" checked={i.comprado} onChange={() => toggleItemComprado(i.id)} />
                          <div>
                            <div className={i.comprado ? 'line-through opacity-70' : ''}>{i.nome}</div>
                            <div className="text-sm opacity-70 flex flex-wrap gap-2 items-center">
                              {i.quantidade && <span>Qtd: {i.quantidade} </span>}
                              {i.observacao && <span>• {i.observacao}</span>}
                              <span className={`badge ${i.comprado ? 'badge-success' : 'badge-warning'}`}>{i.comprado ? 'comprado' : 'pendente'}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="btn btn-outline btn-sm" onClick={() => toggleItemComprado(i.id)}>{i.comprado ? 'Desmarcar' : 'Comprar'}</button>
                          <button className="btn btn-error btn-sm" onClick={() => deleteItem(i.id)}>Excluir</button>
                        </div>
                      </li>
                    ))}
                    {itensDaSelecionada.length === 0 && <li className="opacity-70">Nenhum item.</li>}
                  </ul>
                </>
              )}
            </div>
          </div>

          {selectedListId && (
            <div className="flex gap-2">
              <button className="btn btn-secondary" onClick={duplicarSelecionada}>Duplicar esta Lista</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingPageImpl;
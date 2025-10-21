import { useState, useMemo } from 'react';
import { useFinanceStore } from '../store/financeStore';

export function FinancePageImpl() {
  const {
    getResumoFinanceiro,
    getDespesasPorCategoria,
    transacoes,
    metas,
    addTransacao,
    getCategoriasPorTipo
  } = useFinanceStore();

  const [novaTransacao, setNovaTransacao] = useState({
    descricao: '',
    valor: '',
    tipo: 'despesa' as 'receita' | 'despesa',
    categoria_id: '',
    data: new Date().toISOString().split('T')[0],
    observacao: ''
  });

  const resumo = useMemo(() => getResumoFinanceiro(), [transacoes]);
  const despesasPorCategoria = useMemo(() => getDespesasPorCategoria(), [transacoes]);
  const categorias = getCategoriasPorTipo(novaTransacao.tipo);

  const handleSubmitTransacao = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaTransacao.descricao || !novaTransacao.valor || !novaTransacao.categoria_id) return;

    addTransacao({
      ...novaTransacao,
      valor: parseFloat(novaTransacao.valor),
      origem: 'manual'
    });

    setNovaTransacao({
      descricao: '',
      valor: '',
      tipo: 'despesa',
      categoria_id: '',
      data: new Date().toISOString().split('T')[0],
      observacao: ''
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  // Alertas financeiros
  const alertas = useMemo(() => {
    const alerts = [];
    
    // Alerta de gastos altos
    if (resumo.despesas_mes > resumo.receitas_mes * 0.8) {
      alerts.push({
        tipo: 'warning',
        mensagem: 'Gastos altos este mês! Você já gastou mais de 80% da sua receita.'
      });
    }

    // Alerta de saldo negativo
    if (resumo.saldo_atual < 0) {
      alerts.push({
        tipo: 'error',
        mensagem: 'Saldo negativo! Suas despesas superaram as receitas.'
      });
    }

    // Alerta de metas próximas do vencimento
    const hoje = new Date();
    const metasProximasVencimento = metas.filter(meta => {
      const dataLimite = new Date(meta.data_limite);
      const diasRestantes = Math.ceil((dataLimite.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
      return meta.status === 'ativa' && diasRestantes <= 7 && diasRestantes > 0;
    });

    metasProximasVencimento.forEach(meta => {
      const diasRestantes = Math.ceil((new Date(meta.data_limite).getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
      alerts.push({
        tipo: 'info',
        mensagem: `Meta "${meta.titulo}" vence em ${diasRestantes} dia(s)!`
      });
    });

    return alerts;
  }, [resumo, metas]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-base-content">💰 Controle Financeiro</h1>
        <div className="text-sm text-base-content/60">
          {new Date().toLocaleDateString('pt-BR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Alertas */}
      {alertas.length > 0 && (
        <div className="mb-6 space-y-2">
          {alertas.map((alerta, index) => (
            <div 
              key={index}
              className={`alert ${
                alerta.tipo === 'error' ? 'alert-error' : 
                alerta.tipo === 'warning' ? 'alert-warning' : 
                'alert-info'
              } shadow-sm border border-base-300`}
            >
              <span>{alerta.mensagem}</span>
            </div>
          ))}
        </div>
      )}

      {/* Resumo Financeiro */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/60">Saldo Atual</p>
                <p className={`text-2xl font-bold ${
                  resumo.saldo_atual >= 0 ? 'text-success' : 'text-error'
                }`}>
                  {formatCurrency(resumo.saldo_atual)}
                </p>
              </div>
              <div className="text-3xl">💙</div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/60">Receitas do Mês</p>
                <p className="text-2xl font-bold text-success">
                  {formatCurrency(resumo.receitas_mes)}
                </p>
              </div>
              <div className="text-3xl">💚</div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/60">Despesas do Mês</p>
                <p className="text-2xl font-bold text-error">
                  {formatCurrency(resumo.despesas_mes)}
                </p>
              </div>
              <div className="text-3xl">❤️</div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/60">Taxa de Economia</p>
                <p className="text-2xl font-bold text-info">
                  {resumo.economia_mes.toFixed(1)}%
                </p>
              </div>
              <div className="text-3xl">📊</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Gráfico de Despesas por Categoria */}
        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body">
            <h3 className="card-title text-lg mb-4">Despesas por Categoria</h3>
            {despesasPorCategoria.length > 0 ? (
              <div className="space-y-3">
                {despesasPorCategoria.map((item, index) => {
                  const porcentagem = (item.valor / resumo.despesas_mes) * 100;
                  return (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: item.cor }}
                        ></div>
                        <span className="text-sm">{item.categoria}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{formatCurrency(item.valor)}</div>
                        <div className="text-xs text-base-content/60">{porcentagem.toFixed(1)}%</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center text-base-content/60 py-8">
                <div className="text-4xl mb-2">📊</div>
                <p>Nenhuma despesa registrada este mês</p>
              </div>
            )}
          </div>
        </div>

        {/* Transações Recentes */}
        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body">
            <h3 className="card-title text-lg mb-4">Transações Recentes</h3>
            {resumo.transacoes_recentes.length > 0 ? (
              <div className="space-y-3">
                {resumo.transacoes_recentes.map((transacao) => (
                  <div key={transacao.id} className="flex items-center justify-between p-3 rounded-md bg-base-100 shadow-sm border border-base-300">
                    <div>
                      <p className="font-medium">{transacao.descricao}</p>
                      <p className="text-sm text-base-content/60">{formatDate(transacao.data)}</p>
                    </div>
                    <div className={`text-right ${
                      transacao.tipo === 'receita' ? 'text-success' : 'text-error'
                    }`}>
                      <p className="font-medium">
                        {transacao.tipo === 'receita' ? '+' : '-'}{formatCurrency(transacao.valor)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-base-content/60 py-8">
                <div className="text-4xl mb-2">💳</div>
                <p>Nenhuma transação registrada</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Formulário de Nova Transação */}
      <div className="card bg-base-100 shadow-sm border border-base-300">
        <div className="card-body">
          <h3 className="card-title text-lg mb-4">➕ Nova Transação</h3>
          <form onSubmit={handleSubmitTransacao} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Descrição</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered input-sm"
                  value={novaTransacao.descricao}
                  onChange={(e) => setNovaTransacao(prev => ({ ...prev, descricao: e.target.value }))}
                  placeholder="Ex: Almoço no restaurante"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Valor</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="input input-bordered input-sm"
                  value={novaTransacao.valor}
                  onChange={(e) => setNovaTransacao(prev => ({ ...prev, valor: e.target.value }))}
                  placeholder="0,00"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Tipo</span>
                </label>
                <select
                  className="select select-bordered select-sm"
                  value={novaTransacao.tipo}
                  onChange={(e) => setNovaTransacao(prev => ({ 
                    ...prev, 
                    tipo: e.target.value as 'receita' | 'despesa',
                    categoria_id: '' // Reset categoria quando muda o tipo
                  }))}
                >
                  <option value="despesa">💸 Despesa</option>
                  <option value="receita">💰 Receita</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Categoria</span>
                </label>
                <select
                  className="select select-bordered select-sm"
                  value={novaTransacao.categoria_id}
                  onChange={(e) => setNovaTransacao(prev => ({ ...prev, categoria_id: e.target.value }))}
                  required
                >
                  <option value="">Selecione uma categoria</option>
                  {categorias.map(categoria => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.icone} {categoria.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Data</span>
                </label>
                <input
                  type="date"
                  className="input input-bordered input-sm"
                  value={novaTransacao.data}
                  onChange={(e) => setNovaTransacao(prev => ({ ...prev, data: e.target.value }))}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Observação (opcional)</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered input-sm"
                  value={novaTransacao.observacao}
                  onChange={(e) => setNovaTransacao(prev => ({ ...prev, observacao: e.target.value }))}
                  placeholder="Observações adicionais"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button type="submit" className="btn btn-primary btn-sm">
                Adicionar Transação
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Metas Ativas */}
      {metas.filter(m => m.status === 'ativa').length > 0 && (
        <div className="card bg-base-100 shadow-sm border border-base-300 mt-6">
          <div className="card-body">
            <h3 className="card-title text-lg mb-4">🎯 Metas Ativas</h3>
            <div className="space-y-4">
              {metas.filter(m => m.status === 'ativa').map(meta => {
                const progresso = (meta.valor_atual / meta.valor_objetivo) * 100;
                const diasRestantes = Math.ceil((new Date(meta.data_limite).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                
                return (
                  <div key={meta.id} className="p-4 rounded-md bg-base-100 shadow-sm border border-base-300">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{meta.titulo}</h4>
                        <p className="text-sm text-base-content/60">
                          {formatCurrency(meta.valor_atual)} de {formatCurrency(meta.valor_objetivo)}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{progresso.toFixed(1)}%</div>
                        <div className="text-xs text-base-content/60">
                          {diasRestantes > 0 ? `${diasRestantes} dias restantes` : 'Vencida'}
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-base-300 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          progresso >= 100 ? 'bg-success' : 
                          progresso >= 75 ? 'bg-info' : 
                          progresso >= 50 ? 'bg-warning' : 'bg-error'
                        }`}
                        style={{ width: `${Math.min(progresso, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
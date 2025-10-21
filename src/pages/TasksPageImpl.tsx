import { useMemo, useState } from 'react';
import { useAppStore } from '../store/appStore';
import type { Tarefa, Prioridade, StatusTarefa } from '../store/types';
import dayjs from 'dayjs';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FaCheck, FaUndo, FaTrash, FaCalendarAlt, FaListUl, FaFilter, FaPlus, FaTag, FaHeading, FaAlignLeft, FaFlag, FaCheckCircle, FaTasks } from 'react-icons/fa'

const prioridades: Prioridade[] = ['baixa', 'media', 'alta'];
const statusList: StatusTarefa[] = ['pendente', 'concluida'];
const prioridadeBadge: Record<Prioridade, string> = {
  baixa: 'badge-success',
  media: 'badge-warning',
  alta: 'badge-error',
};
const prioridadeBorder: Record<Prioridade, string> = {
  baixa: 'border-success',
  media: 'border-warning',
  alta: 'border-error',
};
const categoriaBadgeClass = (cat?: string) => {
  if (!cat) return '';
  const palette = ['badge-primary', 'badge-secondary', 'badge-accent', 'badge-info', 'badge-warning', 'badge-success'];
  const hash = [...cat].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  return palette[hash % palette.length];
};
const isOverdue = (t: Tarefa) => !!t.data_vencimento && dayjs(t.data_vencimento).isBefore(dayjs(), 'day') && t.status === 'pendente';

const TasksPageImpl = () => {
  const { tarefas, addTarefa, updateTarefa, deleteTarefa } = useAppStore();
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('');
  const [prioridade, setPrioridade] = useState<Prioridade>('media');
  const [dataVenc, setDataVenc] = useState<string>('');
  const [status, setStatus] = useState<StatusTarefa>('pendente');

  const [filtroStatus, setFiltroStatus] = useState<StatusTarefa | 'todos'>('todos');
  const [filtroPrioridade, setFiltroPrioridade] = useState<Prioridade | 'todas'>('todas');
  const [filtroCategoria, setFiltroCategoria] = useState<string>('');
  const [calendarMode, setCalendarMode] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  const categoriasExistentes = useMemo(() => {
    return Array.from(new Set(tarefas.map(t => t.categoria).filter(Boolean))) as string[];
  }, [tarefas]);

  const tarefasFiltradas = useMemo(() => {
    return tarefas.filter(t => {
      if (filtroStatus !== 'todos' && t.status !== filtroStatus) return false;
      if (filtroPrioridade !== 'todas' && t.prioridade !== filtroPrioridade) return false;
      if (filtroCategoria && t.categoria !== filtroCategoria) return false;
      return true;
    }).sort((a, b) => {
      const aDate = a.data_vencimento ? dayjs(a.data_vencimento).valueOf() : Number.MAX_SAFE_INTEGER;
      const bDate = b.data_vencimento ? dayjs(b.data_vencimento).valueOf() : Number.MAX_SAFE_INTEGER;
      return aDate - bDate;
    });
  }, [tarefas, filtroStatus, filtroPrioridade, filtroCategoria]);
  const pendentesCount = tarefasFiltradas.filter(t => t.status === 'pendente').length;
  const concluidasCount = tarefasFiltradas.length - pendentesCount;
  const atrasadasCount = tarefasFiltradas.filter(isOverdue).length;
  const completionPercent = tarefasFiltradas.length ? Math.round((concluidasCount * 100) / tarefasFiltradas.length) : 0;

  const handleAdd = () => {
    if (!titulo.trim()) return;
    addTarefa({
      titulo: titulo.trim(),
      descricao: descricao.trim() || undefined,
      categoria: categoria.trim() || undefined,
      prioridade,
      data_vencimento: dataVenc || undefined,
      status,
    });
    setTitulo('');
    setDescricao('');
    setCategoria('');
    setPrioridade('media');
    setDataVenc('');
    setStatus('pendente');
  };

  const toggleConcluida = (t: Tarefa) => {
    updateTarefa(t.id, { status: t.status === 'pendente' ? 'concluida' : 'pendente' });
  };

  const tileContent = ({ date }: { date: Date }) => {
    const iso = dayjs(date).format('YYYY-MM-DD');
    const tasksInDay = tarefas.filter(t => t.data_vencimento === iso);
    if (!tasksInDay.length) return null;
    return (
      <ul className="mt-1">
        {tasksInDay.slice(0, 3).map(t => (
          <li key={t.id} className="text-xs">
            • {t.titulo}
          </li>
        ))}
        {tasksInDay.length > 3 && (
          <li className="text-[10px] opacity-70">+{tasksInDay.length - 3} tarefas</li>
        )}
      </ul>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center"><FaTasks className="mr-2"/>Tarefas</h1>
        <div className="flex gap-2">
          <button className="btn btn-outline" onClick={() => setCalendarMode(!calendarMode)}>
            {calendarMode ? (<><FaListUl className="mr-2"/>Ver Lista</>) : (<><FaCalendarAlt className="mr-2"/>Ver Calendário</>)}
          </button>
        </div>
      </div>

      {/* Formulário de criação */}
      <div className="card bg-base-100 shadow-sm border border-base-300">
        <div className="card-body">
          <h2 className="card-title">Nova Tarefa</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Título <span className="badge badge-primary badge-xs ml-2">obrigatório</span></span>
                <span className="label-text-alt">Nome curto</span>
              </label>
              <div className="relative">
                <FaHeading className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60 pointer-events-none" />
                <input className="input input-bordered input-primary pl-10" value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Ex: Lavar roupa" />
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Categoria <span className="badge badge-ghost badge-xs ml-2">opcional</span></span>
                <span className="label-text-alt">Sugestões pelas existentes</span>
              </label>
              <div className="relative">
                <FaTag className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60 pointer-events-none" />
                <input list="categorias-list" className="input input-bordered input-accent pl-10" value={categoria} onChange={e => setCategoria(e.target.value)} placeholder="Ex: Limpeza" />
              </div>
              <datalist id="categorias-list">
                {categoriasExistentes.map(c => <option key={c} value={c} />)}
              </datalist>
            </div>
            <div className="form-control md:col-span-2">
              <label className="label">
                <span className="label-text">Descrição <span className="badge badge-ghost badge-xs ml-2">opcional</span></span>
                <span className="label-text-alt">Detalhes adicionais</span>
              </label>
              <div className="relative">
                <FaAlignLeft className="absolute left-3 top-3 opacity-60 pointer-events-none" />
                <textarea className="textarea textarea-bordered pl-10 min-h-24" value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="Detalhes opcionais" />
              </div>
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Prioridade</span><span className="label-text-alt">baixa/média/alta</span></label>
              <div className="relative">
                <FaFlag className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60 pointer-events-none" />
                <div className="btn-group pl-10">
                  <button type="button" className={`btn btn-sm ${prioridade === 'baixa' ? 'btn-success' : 'btn-ghost'}`} onClick={() => setPrioridade('baixa')}>baixa</button>
                  <button type="button" className={`btn btn-sm ${prioridade === 'media' ? 'btn-warning' : 'btn-ghost'}`} onClick={() => setPrioridade('media')}>média</button>
                  <button type="button" className={`btn btn-sm ${prioridade === 'alta' ? 'btn-error' : 'btn-ghost'}`} onClick={() => setPrioridade('alta')}>alta</button>
                </div>
              </div>
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Vencimento</span><span className="label-text-alt">opcional</span></label>
              <div className="relative">
                <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60 pointer-events-none" />
                <input type="date" className="input input-bordered input-info pl-10" value={dataVenc} onChange={e => setDataVenc(e.target.value)} />
              </div>
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Status</span><span className="label-text-alt">pendente/concluída</span></label>
              <div className="relative">
                <FaCheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60 pointer-events-none" />
                <div className="btn-group pl-10">
                  <button type="button" className={`btn btn-sm ${status === 'pendente' ? 'btn-info' : 'btn-ghost'}`} onClick={() => setStatus('pendente')}>pendente</button>
                  <button type="button" className={`btn btn-sm ${status === 'concluida' ? 'btn-neutral' : 'btn-ghost'}`} onClick={() => setStatus('concluida')}>concluída</button>
                </div>
              </div>
            </div>
          </div>
          <div className="card-actions justify-end">
            <button className="btn btn-primary" onClick={handleAdd}><FaPlus className="mr-2"/>Adicionar</button>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="card bg-base-100 shadow-sm border border-base-300">
        <div className="card-body">
          <div className="flex items-center justify-between">
            <h2 className="card-title">Filtros</h2>
            <button className="btn btn-ghost btn-sm" onClick={() => setShowFilters(!showFilters)}>{showFilters ? 'Ocultar' : 'Mostrar'}</button>
          </div>
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="form-control">
                <label className="label"><span className="label-text">Status</span></label>
                <div className="relative">
                  <FaCheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60 pointer-events-none" />
                  <select className="select select-bordered pl-10" value={filtroStatus} onChange={e => setFiltroStatus(e.target.value as any)}>
                    <option value="todos">Todos</option>
                    {statusList.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Prioridade</span></label>
                <div className="relative">
                  <FaFlag className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60 pointer-events-none" />
                  <select className="select select-bordered pl-10" value={filtroPrioridade} onChange={e => setFiltroPrioridade(e.target.value as any)}>
                    <option value="todas">Todas</option>
                    {prioridades.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Categoria</span></label>
                <div className="relative">
                  <FaTag className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60 pointer-events-none" />
                  <select className="select select-bordered pl-10" value={filtroCategoria} onChange={e => setFiltroCategoria(e.target.value)}>
                    <option value="">Todas</option>
                    {categoriasExistentes.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lista ou Calendário */}
      {!calendarMode ? (
        <div className="grid gap-2">
          {tarefasFiltradas.length === 0 ? (
            <div className="alert alert-info"><span className="flex items-center"><FaFilter className="mr-2"/>Nenhuma tarefa encontrada.</span></div>
          ) : (
            tarefasFiltradas.map((t) => (
              <div key={t.id} className={`card bg-base-100 shadow-sm hover:shadow-md transition rounded-xl border border-base-300 border-l-4 ${prioridadeBorder[t.prioridade]}`}>
                <div className="card-body">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className={`font-semibold ${t.status === 'concluida' ? 'line-through opacity-70' : ''}`}>{t.titulo}</h3>
                      <p className="text-sm opacity-70">{t.descricao}</p>
                      <div className="text-sm mt-1 flex flex-wrap gap-2 opacity-80">
                        {t.categoria && <span className={`badge badge-outline ${categoriaBadgeClass(t.categoria)}`}>{t.categoria}</span>}
                        <span className={`badge ${prioridadeBadge[t.prioridade]}`}>Prioridade: {t.prioridade}</span>
                        {t.data_vencimento && (
                          <span className={`badge ${isOverdue(t) ? 'badge-error' : 'badge-outline'}`}>
                            <FaCalendarAlt className="mr-1"/>
                            {isOverdue(t) ? `Atrasada • ${dayjs(t.data_vencimento).format('DD/MM/YYYY')}` : `Vence: ${dayjs(t.data_vencimento).format('DD/MM/YYYY')}`}
                          </span>
                        )}
                        <span className={`badge ${t.status === 'pendente' ? 'badge-info' : 'badge-neutral'}`}>{t.status}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="btn btn-outline" onClick={() => toggleConcluida(t)}>
                        {t.status === 'pendente' ? (<><FaCheck className="mr-2"/>Concluir</>) : (<><FaUndo className="mr-2"/>Reabrir</>)}
                      </button>
                      <button className="btn btn-error" onClick={() => deleteTarefa(t.id)}><FaTrash className="mr-2"/>Excluir</button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <Calendar tileContent={tileContent as any} />
          </div>
        </div>
      )}
      <div className="card bg-base-100 shadow-sm border border-base-300 rounded-xl">
        <div className="card-body">
          <div className="flex items-center justify-between">
            <span className="text-sm opacity-80">Progresso</span>
            <span className="text-sm font-semibold">{completionPercent}%</span>
          </div>
          <progress className="progress progress-primary" value={completionPercent} max="100"></progress>
        </div>
      </div>
      <div className="stats bg-base-100 shadow-sm border border-base-300 rounded-xl">
        <div className="stat">
          <div className="stat-title">Pendentes</div>
          <div className="stat-value text-warning">{pendentesCount}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Concluídas</div>
          <div className="stat-value text-neutral">{concluidasCount}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Atrasadas</div>
          <div className="stat-value text-error">{atrasadasCount}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Total</div>
          <div className="stat-value">{tarefasFiltradas.length}</div>
        </div>
      </div>
    </div>
  );
};

export default TasksPageImpl;
import { useState, useMemo } from 'react';
import { useAppStore } from '../store/appStore';
import dayjs from 'dayjs';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FaCalendarAlt, FaTag, FaHeading, FaAlignLeft, FaPlus, FaEdit, FaTrash, FaFilter } from 'react-icons/fa';

const categoriaBadgeClass = (cat?: string) => {
  if (!cat) return 'badge-ghost';
  const palette = ['badge-primary', 'badge-secondary', 'badge-accent', 'badge-info', 'badge-warning', 'badge-success'];
  const hash = [...cat].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  return palette[hash % palette.length];
};

const AgendaPageImpl = () => {
  const { eventos, addEvento, updateEvento, deleteEvento } = useAppStore();
  const [titulo, setTitulo] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [categoria, setCategoria] = useState('pessoal');
  const [descricao, setDescricao] = useState('');

  const [dataSelecionada, setDataSelecionada] = useState<Date | null>(null);
const [showForm, setShowForm] = useState<boolean>(true);
const [filterRange, setFilterRange] = useState<'todos' | 'hoje' | 'semana' | 'mes'>('todos');
const [filterCategory, setFilterCategory] = useState<string>('');

  const categoriasExistentes = useMemo(() => {
    return Array.from(new Set(eventos.map(e => e.categoria).filter(Boolean))) as string[];
  }, [eventos]);

  const handleAdd = () => {
    if (!titulo.trim() || !dataInicio) return;
    addEvento({
      titulo: titulo.trim(),
      data_inicio: dataInicio,
      data_fim: dataFim || undefined,
      categoria,
      descricao: descricao.trim() || undefined,
    });
    setTitulo('');
    setDataInicio('');
    setDataFim('');
    setDescricao('');
  };

  // Utilidades de status do evento e classes visuais
  const getEventStatus = (ev: any) => {
    const start = dayjs(ev.data_inicio);
    const end = dayjs(ev.data_fim ?? ev.data_inicio);
    const today = dayjs();
    if (end.isBefore(today, 'day')) return 'passado';
    if (start.isAfter(today, 'day')) return 'proximo';
    if (start.isSame(today, 'day') || end.isSame(today, 'day')) return 'hoje';
    return 'andamento';
  };
  const getBorderClass = (ev: any) => {
    const status = getEventStatus(ev);
    switch (status) {
      case 'passado':
        return 'border-l-4 border-gray-300';
      case 'proximo':
        return 'border-l-4 border-sky-400';
      case 'hoje':
        return 'border-l-4 border-amber-400';
      case 'andamento':
        return 'border-l-4 border-emerald-500';
      default:
        return 'border-l-4 border-base-300';
    }
  };

  // Aplicar filtros rápidos de período e categoria
  const eventosFiltrados = useMemo(() => {
    return eventos.filter((ev) => {
      const byCategory = filterCategory ? ev.categoria?.toLowerCase() === filterCategory.toLowerCase() : true;
      if (!byCategory) return false;
      if (filterRange === 'todos') return true;
      const start = dayjs(ev.data_inicio);
      const end = dayjs(ev.data_fim ?? ev.data_inicio);
      const today = dayjs();
      if (filterRange === 'hoje') return start.isSame(today, 'day') || end.isSame(today, 'day');
      if (filterRange === 'semana') {
        const startWeek = today.startOf('week');
        const endWeek = today.endOf('week');
        return (start.isAfter(startWeek.subtract(1, 'day')) && start.isBefore(endWeek.add(1, 'day'))) ||
               (end.isAfter(startWeek.subtract(1, 'day')) && end.isBefore(endWeek.add(1, 'day')));
      }
      if (filterRange === 'mes') {
        const startMonth = today.startOf('month');
        const endMonth = today.endOf('month');
        return (start.isAfter(startMonth.subtract(1, 'day')) && start.isBefore(endMonth.add(1, 'day'))) ||
               (end.isAfter(startMonth.subtract(1, 'day')) && end.isBefore(endMonth.add(1, 'day')));
      }
      return true;
    });
  }, [eventos, filterRange, filterCategory]);

  const eventosOrdenados = useMemo(() => {
    return [...eventosFiltrados].sort((a, b) => dayjs(a.data_inicio).valueOf() - dayjs(b.data_inicio).valueOf());
  }, [eventosFiltrados]);

  // Estatísticas baseadas nos filtros
  const totalEventos = eventosFiltrados.length;
  const proximosCount = eventosFiltrados.filter(e => getEventStatus(e) === 'proximo').length;
  const hojeCount = eventosFiltrados.filter(e => getEventStatus(e) === 'hoje').length;
  const passadosCount = eventosFiltrados.filter(e => getEventStatus(e) === 'passado').length;

  const tileContent = ({ date }: { date: Date }) => {
    const iso = dayjs(date).format('YYYY-MM-DD');
    const list = eventos.filter(e => e.data_inicio === iso || e.data_fim === iso);
    if (!list.length) return null;
    return (
      <ul className="mt-1">
        {list.slice(0, 3).map(e => (
          <li key={e.id} className="text-xs">
            • {e.titulo}
          </li>
        ))}
        {list.length > 3 && (
          <li className="text-[10px] opacity-70">+{list.length - 3} eventos</li>
        )}
      </ul>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FaCalendarAlt className="text-sky-600" />
          Agenda de Eventos
        </h1>
        <div className="flex gap-2">
          <button className="btn btn-sm btn-outline" onClick={() => setShowForm(v => !v)}>{showForm ? 'Ocultar formulário' : 'Novo evento'}</button>
        </div>
      </div>

      {/* Toolbar de filtros rápidos */}
      <div className="card bg-base-100 shadow-sm border border-base-300">
        <div className="card-body py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <FaFilter className="text-base-content/70" />
              <span className="font-medium">Filtros</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <div className="btn-group">
              <button className={`btn btn-sm ${filterRange === 'todos' ? 'btn-active' : 'btn-outline'}`} onClick={() => setFilterRange('todos')}>Todos</button>
              <button className={`btn btn-sm ${filterRange === 'hoje' ? 'btn-active' : 'btn-outline'}`} onClick={() => setFilterRange('hoje')}>Hoje</button>
              <button className={`btn btn-sm ${filterRange === 'semana' ? 'btn-active' : 'btn-outline'}`} onClick={() => setFilterRange('semana')}>Próx. 7 dias</button>
              <button className={`btn btn-sm ${filterRange === 'mes' ? 'btn-active' : 'btn-outline'}`} onClick={() => setFilterRange('mes')}>Este mês</button>
            </div>
            <div className="divider divider-horizontal m-0"></div>
            <div className="flex items-center gap-2">
              <label className="text-sm">Categoria</label>
              <select className="select select-sm select-bordered" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
                <option value="">Todas</option>
                {[...new Set(eventos.map(e => e.categoria).filter(Boolean))].map((c: any) => <option key={String(c)} value={String(c)}>{String(c)}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {showForm && (
          <div className="card bg-base-100 shadow-sm border border-base-300">
            <div className="card-body">
              <h2 className="card-title">Novo Evento</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text">Título <span className="badge badge-primary badge-xs ml-2">obrigatório</span></span>
                    <span className="label-text-alt">Nome curto</span>
                  </label>
                  <div className="relative">
                    <FaHeading className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60 pointer-events-none" />
                    <input className="input input-bordered input-primary pl-10" value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Ex: Revisão do carro" />
                  </div>
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">Início</span><span className="label-text-alt">obrigatório</span></label>
                  <div className="relative">
                    <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60 pointer-events-none" />
                    <input type="date" className="input input-bordered input-info pl-10" value={dataInicio} onChange={e => setDataInicio(e.target.value)} />
                  </div>
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">Fim</span><span className="label-text-alt">opcional</span></label>
                  <div className="relative">
                    <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60 pointer-events-none" />
                    <input type="date" className="input input-bordered input-accent pl-10" value={dataFim} onChange={e => setDataFim(e.target.value)} />
                  </div>
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">Categoria</span><span className="label-text-alt">opcional</span></label>
                  <div className="relative">
                    <FaTag className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60 pointer-events-none" />
                    <input list="agenda-categorias-list" className="input input-bordered input-accent pl-10" value={categoria} onChange={e => setCategoria(e.target.value)} placeholder="Ex: pessoal" />
                  </div>
                  <datalist id="agenda-categorias-list">
                    {[...new Set(['pessoal', 'manutencao', 'limpeza', 'evento', ...categoriasExistentes])].map(c => <option key={c} value={c} />)}
                  </datalist>
                </div>
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text">Descrição <span className="badge badge-ghost badge-xs ml-2">opcional</span></span>
                    <span className="label-text-alt">Detalhes adicionais</span>
                  </label>
                  <div className="relative">
                    <FaAlignLeft className="absolute left-3 top-3 opacity-60 pointer-events-none" />
                    <textarea className="textarea textarea-bordered pl-10 min-h-24" value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="Detalhes" />
                  </div>
                </div>
              </div>
              <div className="card-actions justify-end">
                <button className="btn btn-primary" onClick={handleAdd}><FaPlus className="mr-2"/>Adicionar</button>
              </div>
            </div>
          </div>
        )}

        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body">
            <h2 className="card-title">Calendário</h2>
            <Calendar value={dataSelecionada} onChange={(v) => setDataSelecionada(v as Date)} tileContent={tileContent as any} />
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h2 className="card-title">Eventos</h2>
          <div className="grid gap-2">
            {eventosOrdenados.length === 0 ? (
              <div className="alert alert-info"><span className="flex items-center"><FaCalendarAlt className="mr-2"/>Nenhum evento encontrado.</span></div>
            ) : (
              eventosOrdenados.map(e => (
                <div key={e.id} className={`flex items-start justify-between p-3 rounded-lg bg-base-100 shadow-sm border border-base-300 hover:shadow-md transition ${getBorderClass(e)}`}>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-base">{e.titulo}</span>
                      {e.categoria && <span className={`badge badge-outline ${categoriaBadgeClass(e.categoria)}`}><FaTag className="mr-1" />{e.categoria}</span>}
                    </div>
                    <div className="text-sm opacity-80 mt-1">
                      <span className="badge badge-outline"><FaCalendarAlt className="mr-1" />{dayjs(e.data_inicio).format('DD/MM/YYYY')}</span>
                      {e.data_fim && <span className="badge badge-outline ml-2">até {dayjs(e.data_fim).format('DD/MM/YYYY')}</span>}
                      {/* Badges de status */}
                      {getEventStatus(e) === 'hoje' && <span className="badge badge-warning ml-2">Hoje</span>}
                      {getEventStatus(e) === 'andamento' && <span className="badge badge-success ml-2">Em andamento</span>}
                      {getEventStatus(e) === 'proximo' && <span className="badge badge-info ml-2">Próximo</span>}
                      {getEventStatus(e) === 'passado' && <span className="badge ml-2">Passado</span>}
                    </div>
                    {e.descricao && <div className="text-sm opacity-70 mt-1"><FaAlignLeft className="inline mr-2" />{e.descricao}</div>}
                  </div>
                  <div className="flex gap-2">
                    <button className="btn btn-outline btn-sm" onClick={() => updateEvento(e.id, { titulo: prompt('Novo título?', e.titulo) || e.titulo })}><FaEdit className="mr-2"/>Editar</button>
                    <button className="btn btn-error btn-sm" onClick={() => { if (confirm('Excluir evento?')) deleteEvento(e.id); }}><FaTrash className="mr-2"/>Excluir</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="stats bg-base-100 shadow-sm border border-base-300 rounded-xl">
        <div className="stat">
          <div className="stat-title">Próximos</div>
          <div className="stat-value text-info">{proximosCount}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Hoje</div>
          <div className="stat-value text-warning">{hojeCount}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Passados</div>
          <div className="stat-value text-neutral">{passadosCount}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Total</div>
          <div className="stat-value">{totalEventos}</div>
        </div>
      </div>
    </div>
  );
};

export default AgendaPageImpl;
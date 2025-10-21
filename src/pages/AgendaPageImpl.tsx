import { useState, useMemo } from 'react';
import { useAppStore } from '../store/appStore';
import dayjs from 'dayjs';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FaCalendarAlt, FaTag, FaHeading, FaAlignLeft, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

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

  const eventosOrdenados = useMemo(() => {
    return [...eventos].sort((a, b) => dayjs(a.data_inicio).valueOf() - dayjs(b.data_inicio).valueOf());
  }, [eventos]);
  const hojeIso = dayjs().format('YYYY-MM-DD');
  const proximosCount = eventosOrdenados.filter(e => dayjs(e.data_inicio).isAfter(dayjs(), 'day')).length;
  const hojeCount = eventosOrdenados.filter(e => e.data_inicio === hojeIso || e.data_fim === hojeIso).length;
  const passadosCount = eventosOrdenados.filter(e => dayjs(e.data_fim ?? e.data_inicio).isBefore(dayjs(), 'day')).length;

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
      <h1 className="text-2xl font-bold">Agenda de Eventos</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div key={e.id} className="flex items-start justify-between p-3 rounded-md bg-base-100 shadow-sm border border-base-300">
                  <div>
                    <div className="font-semibold">{e.titulo}</div>
                    <div className="text-sm opacity-80">
                      <span className="badge badge-outline">{dayjs(e.data_inicio).format('DD/MM/YYYY')}</span>
                      {e.data_fim && <span className="badge badge-outline ml-2">até {dayjs(e.data_fim).format('DD/MM/YYYY')}</span>}
                      {e.categoria && <span className={`badge badge-outline ml-2 ${categoriaBadgeClass(e.categoria)}`}>{e.categoria}</span>}
                    </div>
                    {e.descricao && <div className="text-sm opacity-70 mt-1">{e.descricao}</div>}
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
          <div className="stat-value">{eventosOrdenados.length}</div>
        </div>
      </div>
    </div>
  );
};

export default AgendaPageImpl;
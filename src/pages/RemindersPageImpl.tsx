import { useMemo, useState } from 'react';
import { useAppStore } from '../store/appStore';
import dayjs from 'dayjs';
import { FaCalendarAlt, FaClock, FaTag, FaHeading, FaAlignLeft, FaPlus, FaEdit, FaTrash, FaFilter } from 'react-icons/fa';

const categorias = ['pagamento', 'manutencao', 'evento', 'pessoal'];
const categoriaBadgeClass = (cat?: string) => {
  if (!cat) return 'badge-ghost';
  const palette = ['badge-primary', 'badge-secondary', 'badge-accent', 'badge-info', 'badge-warning', 'badge-success'];
  const hash = [...(cat || '')].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  return palette[hash % palette.length];
};

const RemindersPageImpl = () => {
  const { lembretes, addLembrete, updateLembrete, deleteLembrete } = useAppStore();
  const [titulo, setTitulo] = useState('');
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [categoria, setCategoria] = useState('pagamento');
  const [descricao, setDescricao] = useState('');

  // UI: filtros e colapsar formulário
  const [showForm, setShowForm] = useState(true);
  const [filterRange, setFilterRange] = useState<'todos'|'hoje'|'semana'|'mes'>('todos');
  const [filterCategory, setFilterCategory] = useState<string>('todas');

  const categoriasExistentes = useMemo(() => {
    return Array.from(new Set(lembretes.map(l => l.categoria).filter(Boolean))) as string[];
  }, [lembretes]);

  const handleAdd = () => {
    if (!titulo.trim() || !data) return;
    addLembrete({
      titulo: titulo.trim(),
      data,
      hora: hora || undefined,
      categoria,
      descricao: descricao.trim() || undefined,
    });
    setTitulo('');
    setData('');
    setHora('');
    setDescricao('');
  };

  const hoje = dayjs();

  // Funções auxiliares de estilo
  const statusDoLembrete = (l: any) => {
    const d = dayjs(l.data);
    if (d.isSame(hoje, 'day')) return 'hoje';
    if (d.isBefore(hoje, 'day')) return 'passado';
    return 'proximo';
  };
  const statusBorderClass = (l: any) => {
    const s = statusDoLembrete(l);
    // Paleta ajustada: hoje=warning, próximos=success, passados=info
    if (s === 'hoje') return 'border-l-4 border-warning';
    if (s === 'passado') return 'border-l-4 border-info';
    return 'border-l-4 border-success';
  };

  // Filtros visuais
  const lembretesFiltrados = useMemo(() => {
    let arr = lembretes;
    if (filterCategory && filterCategory !== 'todas') {
      arr = arr.filter(l => l.categoria === filterCategory);
    }
    return arr.filter(l => {
      const d = dayjs(l.data);
      if (filterRange === 'hoje') return d.isSame(hoje, 'day');
      if (filterRange === 'semana') {
        const s = hoje.startOf('week');
        const e = hoje.endOf('week');
        return d.isAfter(s.subtract(1, 'day')) && d.isBefore(e.add(1, 'day'));
      }
      if (filterRange === 'mes') {
        const s = hoje.startOf('month');
        const e = hoje.endOf('month');
        return d.isAfter(s.subtract(1, 'day')) && d.isBefore(e.add(1, 'day'));
      }
      return true;
    });
  }, [lembretes, filterRange, filterCategory]);

  const futuros = useMemo(() =>
    lembretesFiltrados
      .filter(l => dayjs(l.data).isSame(hoje, 'day') || dayjs(l.data).isAfter(hoje))
      .sort(
        (a, b) =>
          dayjs(a.data + (a.hora ? ' ' + a.hora : '')).valueOf() -
          dayjs(b.data + (b.hora ? ' ' + b.hora : '')).valueOf()
      ),
    [lembretesFiltrados, hoje]
  );
  const passados = useMemo(() =>
    lembretesFiltrados
      .filter(l => dayjs(l.data).isBefore(hoje, 'day'))
      .sort((a, b) => dayjs(b.data).valueOf() - dayjs(a.data).valueOf()),
    [lembretesFiltrados, hoje]
  );
  const proximosCount = futuros.length;
  const hojeCount = lembretesFiltrados.filter(l => dayjs(l.data).isSame(hoje, 'day')).length;
  const passadosCount = passados.length;
  const totalCount = lembretesFiltrados.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center"><FaCalendarAlt className="mr-2"/>Lembretes</h1>
        <button className="btn btn-outline btn-sm" onClick={() => setShowForm(v => !v)}>{showForm ? 'Ocultar formulário' : 'Ver formulário'}</button>
      </div>

      <div className="card bg-base-100 shadow-sm border border-base-300">
        <div className="card-body py-3">
          <div className="flex items-center gap-3">
            <FaFilter className="opacity-60"/>
            <div className="btn-group btn-group-sm">
              <button className={`btn ${filterRange==='todos'?'btn-active':''}`} onClick={()=>setFilterRange('todos')}>Todos</button>
              <button className={`btn ${filterRange==='hoje'?'btn-active':''}`} onClick={()=>setFilterRange('hoje')}>Hoje</button>
              <button className={`btn ${filterRange==='semana'?'btn-active':''}`} onClick={()=>setFilterRange('semana')}>Semana</button>
              <button className={`btn ${filterRange==='mes'?'btn-active':''}`} onClick={()=>setFilterRange('mes')}>Mês</button>
            </div>
            <select className="select select-bordered select-sm ml-auto" value={filterCategory} onChange={e=>setFilterCategory(e.target.value)}>
              <option value="todas">Categoria: Todas</option>
              {[...new Set([...categorias, ...categoriasExistentes])].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      {showForm && (
      <div className="card bg-base-100 shadow-sm border border-base-300">
        <div className="card-body">
          <h2 className="card-title">Novo Lembrete</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="form-control md:col-span-3">
              <label className="label">
                <span className="label-text">Título <span className="badge badge-primary badge-xs ml-2">obrigatório</span></span>
                <span className="label-text-alt">Nome curto</span>
              </label>
              <div className="relative">
                <FaHeading className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60 pointer-events-none" />
                <input className="input input-bordered input-primary pl-10" value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Ex: Pagar conta de luz" />
              </div>
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Data</span><span className="label-text-alt">obrigatório</span></label>
              <div className="relative">
                <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60 pointer-events-none" />
                <input type="date" className="input input-bordered input-info pl-10" value={data} onChange={e => setData(e.target.value)} />
              </div>
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Hora</span><span className="label-text-alt">opcional</span></label>
              <div className="relative">
                <FaClock className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60 pointer-events-none" />
                <input type="time" className="input input-bordered input-accent pl-10" value={hora} onChange={e => setHora(e.target.value)} />
              </div>
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Categoria</span><span className="label-text-alt">opcional</span></label>
              <div className="relative">
                <FaTag className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60 pointer-events-none" />
                <input list="rem-categorias-list" className="input input-bordered input-accent pl-10" value={categoria} onChange={e => setCategoria(e.target.value)} placeholder="Ex: pagamento" />
              </div>
              <datalist id="rem-categorias-list">
                {[...new Set([...categorias, ...categoriasExistentes])].map(c => <option key={c} value={c} />)}
              </datalist>
            </div>
            <div className="form-control md:col-span-3">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body">
            <h2 className="card-title">Próximos</h2>
            <div className="space-y-2">
              {futuros.length === 0 ? (
                <div className="alert alert-info"><span className="flex items-center"><FaCalendarAlt className="mr-2"/>Nenhum lembrete próximo.</span></div>
              ) : futuros.map(l => (
                <div key={l.id} className={`flex items-start justify-between p-3 rounded-md bg-base-100 shadow-sm border border-base-300 hover:bg-base-200 transition ${statusBorderClass(l)}`}>
                  <div>
                    <div className="font-semibold">{l.titulo}</div>
                    <div className="text-sm opacity-80">
                      <span className="badge badge-outline">{dayjs(l.data).format('DD/MM/YYYY')}</span>
                      {l.hora && <span className="badge badge-outline ml-2">{l.hora}</span>}
                      {l.categoria && <span className={`badge rounded-full ml-2 ${categoriaBadgeClass(l.categoria)}`}>{l.categoria}</span>}
                    </div>
                    {l.descricao && <div className="text-sm opacity-70 mt-1">{l.descricao}</div>}
                  </div>
                  <div className="flex gap-2">
                    <button className="btn btn-outline btn-sm" onClick={() => updateLembrete(l.id, { titulo: prompt('Novo título?', l.titulo) || l.titulo })}><FaEdit className="mr-2"/>Editar</button>
                    <button className="btn btn-error btn-sm" onClick={() => { if (confirm('Excluir lembrete?')) deleteLembrete(l.id); }}><FaTrash className="mr-2"/>Excluir</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body">
            <h2 className="card-title">Passados</h2>
            <div className="space-y-2">
              {passados.length === 0 ? (
                <div className="alert alert-info"><span className="flex items-center"><FaCalendarAlt className="mr-2"/>Nenhum lembrete passado.</span></div>
              ) : passados.map(l => (
                <div key={l.id} className={`flex items-start justify-between p-3 rounded-md bg-base-100 shadow-sm border border-base-300 hover:bg-base-200 transition ${statusBorderClass(l)}`}>
                  <div>
                    <div className="font-semibold">{l.titulo}</div>
                    <div className="text-sm opacity-80">
                      <span className="badge badge-outline">{dayjs(l.data).format('DD/MM/YYYY')}</span>
                      {l.hora && <span className="badge badge-outline ml-2">{l.hora}</span>}
                      {l.categoria && <span className={`badge rounded-full ml-2 ${categoriaBadgeClass(l.categoria)}`}>{l.categoria}</span>}
                    </div>
                    {l.descricao && <div className="text-sm opacity-70 mt-1">{l.descricao}</div>}
                  </div>
                  <div className="flex gap-2">
                    <button className="btn btn-outline btn-sm" onClick={() => updateLembrete(l.id, { titulo: prompt('Novo título?', l.titulo) || l.titulo })}><FaEdit className="mr-2"/>Editar</button>
                    <button className="btn btn-error btn-sm" onClick={() => { if (confirm('Excluir lembrete?')) deleteLembrete(l.id); }}><FaTrash className="mr-2"/>Excluir</button>
                  </div>
                </div>
              ))}
            </div>
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
          <div className="stat-value">{totalCount}</div>
        </div>
      </div>
    </div>
  );
};

export default RemindersPageImpl;
import { useAppStore } from '../store/appStore';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import { FaTasks, FaShoppingBasket, FaCalendarAlt, FaBell } from 'react-icons/fa';

const Dashboard = () => {
  const { tarefas, eventos, lembretes } = useAppStore();

  const pendentesHoje = tarefas.filter(t => t.status === 'pendente' && t.data_vencimento === dayjs().format('YYYY-MM-DD'));
  const pendentesSemana = tarefas.filter(t => t.status === 'pendente' && t.data_vencimento && dayjs(t.data_vencimento).isAfter(dayjs().subtract(1, 'day')) && dayjs(t.data_vencimento).isBefore(dayjs().add(7, 'day')));

  const proximosEventos = [...eventos]
    .filter(e => dayjs(e.data_inicio).isAfter(dayjs().subtract(1, 'day')))
    .sort((a,b) => dayjs(a.data_inicio).valueOf() - dayjs(b.data_inicio).valueOf())
    .slice(0, 5);

  const proximosLembretes = [...lembretes]
    .filter(l => dayjs(l.data).isSame(dayjs(), 'day') || dayjs(l.data).isAfter(dayjs()))
    .sort((a,b) => dayjs(a.data + (a.hora ? ' ' + a.hora : '')).valueOf() - dayjs(b.data + (b.hora ? ' ' + b.hora : '')).valueOf())
    .slice(0, 5);

  return (
    <div className="grid gap-6">
      <div className="hero bg-base-100 shadow-sm border border-base-300 rounded-xl">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-3xl font-bold">Painel Principal</h1>
            <p className="py-2 opacity-80">Resumo das tarefas, eventos e lembretes para acompanhar sua casa de forma simples.</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Link to="/tarefas" className="btn btn-primary"><FaTasks className="mr-2"/>Tarefas</Link>
              <Link to="/compras" className="btn btn-secondary"><FaShoppingBasket className="mr-2"/>Compras</Link>
              <Link to="/agenda" className="btn btn-accent"><FaCalendarAlt className="mr-2"/>Agenda</Link>
              <Link to="/lembretes" className="btn"><FaBell className="mr-2"/>Lembretes</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="stats stats-vertical lg:stats-horizontal bg-base-100 shadow-sm border border-base-300 rounded-xl">
        <div className="stat">
          <div className="stat-figure text-primary">
            <FaTasks />
          </div>
          <div className="stat-title">Tarefas pendentes hoje</div>
          <div className="stat-value text-primary">{pendentesHoje.length}</div>
          <div className="stat-desc">Na próxima semana: {pendentesSemana.length}</div>
        </div>
        <div className="stat">
          <div className="stat-figure text-secondary">
            <FaCalendarAlt />
          </div>
          <div className="stat-title">Próximos eventos</div>
          <div className="stat-value text-secondary">{proximosEventos.length}</div>
          <div className="stat-desc">Até 5 listados abaixo</div>
        </div>
        <div className="stat">
          <div className="stat-figure">
            <FaBell />
          </div>
          <div className="stat-title">Lembretes próximos</div>
          <div className="stat-value">{proximosLembretes.length}</div>
          <div className="stat-desc">Hoje e futuros</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body">
            <h2 className="card-title">Tarefas pendentes</h2>
            <div className="text-sm opacity-80">Hoje: {pendentesHoje.length}</div>
            <div className="text-sm opacity-80">Próxima semana: {pendentesSemana.length}</div>
            <ul className="mt-2 space-y-1">
              {pendentesHoje.slice(0,3).map(t => (
                <li key={t.id} className="flex justify-between p-3 rounded-md bg-base-100 shadow-sm border border-base-300">
                  <span>{t.titulo}</span>
                  {t.data_vencimento && <span className="badge badge-outline">{dayjs(t.data_vencimento).format('DD/MM')}</span>}
                </li>
              ))}
              {pendentesHoje.length === 0 && <li className="opacity-70">Sem tarefas para hoje.</li>}
            </ul>
          </div>
        </div>
        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body">
            <h2 className="card-title">Próximos eventos</h2>
            <ul className="space-y-1">
              {proximosEventos.map(e => (
                <li key={e.id} className="flex justify-between p-3 rounded-md bg-base-100 shadow-sm border border-base-300">
                  <span>{e.titulo}</span>
                  <span className="badge badge-outline">{dayjs(e.data_inicio).format('DD/MM')}</span>
                </li>
              ))}
              {proximosEventos.length === 0 && <li className="opacity-70">Sem eventos próximos.</li>}
            </ul>
          </div>
        </div>
        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body">
            <h2 className="card-title">Lembretes</h2>
            <ul className="space-y-1">
              {proximosLembretes.map(l => (
                <li key={l.id} className="flex justify-between p-3 rounded-md bg-base-100 shadow-sm border border-base-300">
                  <span>{l.titulo}</span>
                  <span className="badge badge-outline">{dayjs(l.data).format('DD/MM')}{l.hora ? ' ' + l.hora : ''}</span>
                </li>
              ))}
              {proximosLembretes.length === 0 && <li className="opacity-70">Sem lembretes próximos.</li>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
import { Link, NavLink } from 'react-router-dom';
import { useThemeStore } from '../store/themeStore';
import { FaSun, FaMoon, FaBars } from 'react-icons/fa';

const NavBar = () => {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <div className="navbar bg-base-100/95 border-b border-base-300 backdrop-blur sticky top-0 z-50">
      <div className="navbar-start">
        <Link to="/" className="btn btn-ghost text-base md:text-lg font-semibold tracking-tight">Casa Inteligente Amiga</Link>
      </div>

      {/* Menu desktop */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-2 gap-1">
          <li><NavLink to="/" end className={({ isActive }) => ["px-3 py-2 rounded-btn", isActive ? "bg-base-200 font-medium" : "hover:bg-base-200"].join(" ")}>Dashboard</NavLink></li>
          <li><NavLink to="/tarefas" className={({ isActive }) => ["px-3 py-2 rounded-btn", isActive ? "bg-base-200 font-medium" : "hover:bg-base-200"].join(" ")}>Tarefas</NavLink></li>
          <li><NavLink to="/compras" className={({ isActive }) => ["px-3 py-2 rounded-btn", isActive ? "bg-base-200 font-medium" : "hover:bg-base-200"].join(" ")}>Compras</NavLink></li>
          <li><NavLink to="/agenda" className={({ isActive }) => ["px-3 py-2 rounded-btn", isActive ? "bg-base-200 font-medium" : "hover:bg-base-200"].join(" ")}>Agenda</NavLink></li>
          <li><NavLink to="/lembretes" className={({ isActive }) => ["px-3 py-2 rounded-btn", isActive ? "bg-base-200 font-medium" : "hover:bg-base-200"].join(" ")}>Lembretes</NavLink></li>
          <li><NavLink to="/financeiro" className={({ isActive }) => ["px-3 py-2 rounded-btn", isActive ? "bg-base-200 font-medium" : "hover:bg-base-200"].join(" ")}>Financeiro</NavLink></li>
          <li><NavLink to="/config" className={({ isActive }) => ["px-3 py-2 rounded-btn", isActive ? "bg-base-200 font-medium" : "hover:bg-base-200"].join(" ")}>Configurações</NavLink></li>
        </ul>
      </div>

      <div className="navbar-end">
        {/* Toggle de tema */}
        <button aria-label="Alternar tema" className="btn btn-ghost" onClick={toggleTheme}>
          {theme === 'light' ? <FaMoon /> : <FaSun />}
        </button>

        {/* Menu mobile */}
        <div className="dropdown dropdown-end lg:hidden">
          <button tabIndex={0} aria-label="Abrir menu" className="btn btn-ghost btn-square">
            <FaBars />
          </button>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-sm border border-base-300 bg-base-100 rounded-box w-52">
            <li><NavLink to="/" end className={({ isActive }) => ["px-3 py-2 rounded-btn", isActive ? "bg-base-200 font-medium" : "hover:bg-base-200"].join(" ")}>Dashboard</NavLink></li>
            <li><NavLink to="/tarefas" className={({ isActive }) => ["px-3 py-2 rounded-btn", isActive ? "bg-base-200 font-medium" : "hover:bg-base-200"].join(" ")}>Tarefas</NavLink></li>
            <li><NavLink to="/compras" className={({ isActive }) => ["px-3 py-2 rounded-btn", isActive ? "bg-base-200 font-medium" : "hover:bg-base-200"].join(" ")}>Compras</NavLink></li>
            <li><NavLink to="/agenda" className={({ isActive }) => ["px-3 py-2 rounded-btn", isActive ? "bg-base-200 font-medium" : "hover:bg-base-200"].join(" ")}>Agenda</NavLink></li>
            <li><NavLink to="/lembretes" className={({ isActive }) => ["px-3 py-2 rounded-btn", isActive ? "bg-base-200 font-medium" : "hover:bg-base-200"].join(" ")}>Lembretes</NavLink></li>
            <li><NavLink to="/financeiro" className={({ isActive }) => ["px-3 py-2 rounded-btn", isActive ? "bg-base-200 font-medium" : "hover:bg-base-200"].join(" ")}>Financeiro</NavLink></li>
            <li><NavLink to="/config" className={({ isActive }) => ["px-3 py-2 rounded-btn", isActive ? "bg-base-200 font-medium" : "hover:bg-base-200"].join(" ")}>Configurações</NavLink></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
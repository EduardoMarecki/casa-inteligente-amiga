import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/TasksPageImpl';
import Shopping from './pages/ShoppingPageImpl';
import Agenda from './pages/AgendaPageImpl';
import Reminders from './pages/RemindersPageImpl';
import Finance from './pages/Finance';
import Settings from './pages/Settings';

function App() {
  return (
    <BrowserRouter basename="/casa-inteligente-amiga">
      <Routes>
        <Route path="/" element={<Layout />}> 
          <Route index element={<Dashboard />} />
          <Route path="tarefas" element={<Tasks />} />
          <Route path="compras" element={<Shopping />} />
          <Route path="agenda" element={<Agenda />} />
          <Route path="lembretes" element={<Reminders />} />
          <Route path="financeiro" element={<Finance />} />
          <Route path="config" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import { useThemeStore } from '../store/themeStore';
import type { Theme } from '../store/themeStore';
import { useAppStore } from '../store/appStore';
import { useFinanceStore } from '../store/financeStore';
import { useRef } from 'react';

const Settings = () => {
  const { theme, setTheme, toggleTheme } = useThemeStore();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleExport = () => {
    try {
      const app = useAppStore.getState();
      const fin = useFinanceStore.getState();
      const th = useThemeStore.getState();
      const backup = {
        version: 1,
        generated_at: new Date().toISOString(),
        app: {
          tarefas: app.tarefas,
          listas: app.listas,
          itens: app.itens,
          eventos: app.eventos,
          lembretes: app.lembretes,
        },
        finance: {
          transacoes: fin.transacoes,
          categorias: fin.categorias,
          metas: fin.metas,
        },
        theme: {
          theme: th.theme,
        },
      };
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const date = new Date();
      const fn = `cia-backup-${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}.json`;
      a.href = url;
      a.download = fn;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert('Falha ao exportar dados.');
      console.error(e);
    }
  };

  const handleImportFileChange: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      // Validações básicas
      if (!data || typeof data !== 'object' || !data.version) {
        alert('Arquivo inválido.');
        return;
      }
      // Aplicar App Store
      if (data.app) {
        useAppStore.setState({
          tarefas: Array.isArray(data.app.tarefas) ? data.app.tarefas : [],
          listas: Array.isArray(data.app.listas) ? data.app.listas : [],
          itens: Array.isArray(data.app.itens) ? data.app.itens : [],
          eventos: Array.isArray(data.app.eventos) ? data.app.eventos : [],
          lembretes: Array.isArray(data.app.lembretes) ? data.app.lembretes : [],
        });
      }
      // Aplicar Finance Store
      if (data.finance) {
        useFinanceStore.setState({
          transacoes: Array.isArray(data.finance.transacoes) ? data.finance.transacoes : [],
          categorias: Array.isArray(data.finance.categorias) ? data.finance.categorias : [],
          metas: Array.isArray(data.finance.metas) ? data.finance.metas : [],
        });
      }
      // Aplicar Theme Store
      if (data.theme && typeof data.theme.theme === 'string') {
        setTheme(data.theme.theme as Theme);
      }
      alert('Importação concluída com sucesso!');
      // Limpar input
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      console.error(err);
      alert('Falha ao importar. Verifique o arquivo JSON.');
    }
  };

  const handleResetAll = () => {
    const step1 = confirm('Tem certeza que deseja apagar TODOS os dados? Esta ação não pode ser desfeita.');
    if (!step1) return;
    const step2 = confirm('Confirmar novamente: Tarefas, Agenda, Compras, Lembretes, Financeiro e Tema serão removidos do dispositivo.');
    if (!step2) return;
    try {
      // Remover persistência local
      localStorage.removeItem('cia-app-store');
      localStorage.removeItem('finance-storage');
      localStorage.removeItem('theme-storage');
      // Limpar estado em memória imediatamente
      useAppStore.setState({ tarefas: [], listas: [], itens: [], eventos: [], lembretes: [] });
      useFinanceStore.setState({ transacoes: [], categorias: [], metas: [] });
      setTheme('light');
      alert('Dados removidos. O aplicativo será recarregado para aplicar o estado padrão.');
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Falha ao zerar sistema. Verifique permissões de armazenamento.');
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Configurações</h1>
      <div className="card bg-base-100 shadow-sm border border-base-300">
        <div className="card-body">
          <p>Preferências de tema (claro/escuro) e notificações (em breve).</p>
          <div className="flex flex-wrap gap-2 items-center">
            <span className="opacity-70">Tema atual:</span>
            <span className="badge badge-outline">{theme}</span>
            <button className="btn" onClick={() => setTheme('light')}>Tema Claro</button>
            <button className="btn" onClick={() => setTheme('dark')}>Tema Escuro</button>
            <button className="btn btn-outline" onClick={toggleTheme}>Alternar</button>
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow-sm border border-base-300">
        <div className="card-body">
          <h2 className="card-title">Backup e Restauração de Dados</h2>
          <p className="opacity-80 text-sm">Exporte seus dados em um arquivo .json e importe quando precisar restaurar. O backup inclui Tarefas, Agenda, Compras, Lembretes, Financeiro e preferências de tema.</p>
          <div className="flex flex-wrap gap-2">
            <button className="btn btn-primary" onClick={handleExport}>Exportar dados (JSON)</button>
            <label className="btn btn-outline" htmlFor="import-json">Importar dados (JSON)</label>
            <input id="import-json" ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleImportFileChange} />
          </div>
          <div className="mt-2 text-xs opacity-70">
            <ul className="list-disc ml-4">
              <li>O backup é local e não sincroniza entre dispositivos.</li>
              <li>Importar substitui os dados atuais pelos do arquivo.</li>
              <li>Recomendado revisar o arquivo antes de importar.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow-sm border border-base-300">
        <div className="card-body">
          <h2 className="card-title text-error">Zerar Sistema (Apagar tudo)</h2>
          <p className="opacity-80 text-sm">Apaga permanentemente todas as informações salvas localmente: Tarefas, Agenda, Compras, Lembretes, Financeiro e Tema. Recomendamos fazer um backup antes.</p>
          <button className="btn btn-error" onClick={handleResetAll}>Apagar todas as informações</button>
          <div className="mt-2 text-xs opacity-70">Essa ação exige confirmação dupla e recarregará o aplicativo.</div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
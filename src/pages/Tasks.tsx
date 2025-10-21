const Tasks = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Tarefas</h1>
      <div className="card bg-base-100 shadow-sm border border-base-300">
        <div className="card-body">
          <p>Em breve: criar, editar, excluir tarefas + filtros e calendário.</p>
          <div className="flex gap-2">
            <button className="btn btn-primary">Nova Tarefa</button>
            <button className="btn">Filtros</button>
            <button className="btn btn-outline">Ver Calendário</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
const Agenda = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Agenda de Eventos</h1>
      <div className="card bg-base-100 shadow-sm border border-base-300">
        <div className="card-body">
          <p>Em breve: calendário e eventos por categoria com cores.</p>
          <button className="btn btn-primary">Novo Evento</button>
        </div>
      </div>
    </div>
  );
};

export default Agenda;
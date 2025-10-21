const Reminders = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Lembretes</h1>
      <div className="card bg-base-100 shadow-sm border border-base-300">
        <div className="card-body">
          <p>Em breve: lembretes com data e hora, categorias e visualização.</p>
          <button className="btn btn-primary">Novo Lembrete</button>
        </div>
      </div>
    </div>
  );
};

export default Reminders;
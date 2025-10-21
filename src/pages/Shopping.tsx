const Shopping = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Listas de Compras</h1>
      <div className="card bg-base-100 shadow-sm border border-base-300">
        <div className="card-body">
          <p>Em breve: múltiplas listas, itens e duplicação de listas.</p>
          <div className="flex gap-2">
            <button className="btn btn-primary">Nova Lista</button>
            <button className="btn btn-outline">Duplicar Lista</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shopping;
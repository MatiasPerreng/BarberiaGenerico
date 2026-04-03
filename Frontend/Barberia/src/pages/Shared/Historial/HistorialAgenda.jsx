import { useEffect, useState } from "react";
import API_URL from "../../../services/api";
import "./HistorialAgenda.css";

const obtenerFechaLocal = () => {
  const d = new Date();
  return d.toLocaleDateString("sv-SE"); 
};

const hoy = obtenerFechaLocal();

const HistorialAgenda = () => {
  const [turnos, setTurnos] = useState([]);
  const [error, setError] = useState(null);

  const [fecha, setFecha] = useState(hoy);
  const [modoTodos, setModoTodos] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const FILAS_POR_PAGINA = 5;

  useEffect(() => {
    setError(null);

    let url = `${API_URL}/visitas/historial`;
    if (!modoTodos) {
      url += `?fecha=${fecha}`;
    }

    fetch(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTurnos(data);
        } else {
          setTurnos([]);
          setError("No se pudo cargar el historial");
        }
      })
      .catch(() => {
        setError("Error de conexión");
      });
  }, [fecha, modoTodos]);

  useEffect(() => {
    setPaginaActual(1);
  }, [fecha, modoTodos, busqueda, turnos]);

  if (error) {
    return <p className="kb-error">{error}</p>;
  }

  return (
    <div className="kb-historial">
      <h2 className="kb-title">Historial de agenda</h2>

      {/* 📅 FILTRO DE FECHA */}
      <div className="kb-filtro-fecha">
        <input
          type="date"
          className="kb-date-filter"
          value={fecha}
          onChange={(e) => {
            setFecha(e.target.value);
            setModoTodos(false);
          }}
        />

        {!modoTodos && (
          <button
            type="button"
            className="kb-btn-todos"
            onClick={() => {
              setModoTodos(true);
              setFecha(hoy); 
            }}
          >
            Todos
          </button>
        )}
      </div>

      {/* 🔍 BUSCADOR POR NOMBRE */}
      <div className="kb-filtro-busqueda">
        <input
          type="search"
          className="kb-search-input"
          placeholder="Buscar por nombre del cliente…"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {(() => {
        const termino = busqueda.trim().toLowerCase();
        const turnosFiltrados = termino
          ? turnos.filter((t) => {
              const nombre = (t.cliente_nombre || "").toLowerCase();
              const apellido = (t.cliente_apellido || "").toLowerCase();
              const nombreCompleto = `${nombre} ${apellido}`.trim();
              return (
                nombre.includes(termino) ||
                apellido.includes(termino) ||
                nombreCompleto.includes(termino)
              );
            })
          : turnos;
        const totalPaginas = Math.ceil(turnosFiltrados.length / FILAS_POR_PAGINA);
        const inicio = (paginaActual - 1) * FILAS_POR_PAGINA;
        const turnosPaginados = turnosFiltrados.slice(
          inicio,
          inicio + FILAS_POR_PAGINA
        );

        return (
          <>
            {turnos.length === 0 && (
              <p className="kb-empty">No hay turnos en el historial</p>
            )}

            {turnos.length > 0 && turnosFiltrados.length === 0 && (
              <p className="kb-empty">
                Ningún cliente coincide con "{busqueda}"
              </p>
            )}

            {turnosFiltrados.length > 0 && (
              <div className="kb-list">
                {turnosPaginados.map((t) => {
          const stringFecha = t.fecha_hora.replace(" ", "T");
          const d = new Date(stringFecha);
          

          const fechaTexto = d.toLocaleDateString("es-UY", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            timeZone: "America/Montevideo"
          });

          const horaTexto = d.toLocaleTimeString("es-UY", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
            timeZone: "America/Montevideo"
          });

          const fechaLinea =
            fechaTexto.charAt(0).toUpperCase() + fechaTexto.slice(1);

          const nombreCliente =
            `${t.cliente_nombre || ""} ${t.cliente_apellido || ""}`.trim() ||
            "—";
          const nombreServicio = (t.servicio_nombre || "").trim() || "—";
          const nombreBarbero = (t.barbero_nombre || "").trim();

          return (
            <div key={t.id_visita} className="kb-card">
              <p className="kb-card-narrativa">
                <span className="kb-narrativa-lead">
                  <span className="kb-narrativa-fecha">El día {fechaLinea}</span>{" "}
                  <span className="kb-narrativa-hora">
                    a las {horaTexto}
                    {"\u00a0"}
                    hs
                  </span>
                </span>
                <span
                  className="kb-narrativa-sep kb-narrativa-sep--comma"
                  aria-hidden="true"
                >
                  ,{" "}
                </span>
                <span className="kb-narrativa-rest">
                  <span className="kb-narrativa-cliente">{nombreCliente}</span>
                  {" se\u00a0hizo "}
                  <span className="kb-narrativa-servicio">{nombreServicio}</span>
                  {nombreBarbero ? (
                    <>
                      {" con el barbero "}
                      <span className="kb-narrativa-barbero">{nombreBarbero}</span>
                    </>
                  ) : null}
                  {"."}
                </span>
              </p>
            </div>
          );
        })}
              </div>
            )}

            {turnosFiltrados.length > 0 && totalPaginas > 1 && (
              <div className="kb-pagination">
                <button
                  type="button"
                  className="kb-page-btn"
                  onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
                  disabled={paginaActual === 1}
                >
                  Anterior
                </button>
                <span className="kb-page-indicator">
                  Página {paginaActual} de {totalPaginas}
                </span>
                <button
                  type="button"
                  className="kb-page-btn"
                  onClick={() =>
                    setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))
                  }
                  disabled={paginaActual === totalPaginas}
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        );
      })()}
    </div>
  );
};

export default HistorialAgenda;
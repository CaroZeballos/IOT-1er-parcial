import { useEffect, useState } from "react";
import "./Calcular.css";

function Calcular({ usuario, irA }) {
  const [series, setSeries] = useState([]);
  const [serieSeleccionada, setSerieSeleccionada] = useState("");

  const [x, setX] = useState("");
  const [n, setN] = useState("");

  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);

  // Obtener las series desde MongoDB mediante el backend
  useEffect(() => {
    const obtenerSeries = async () => {
      try {
        const respuesta = await fetch(
          "http://localhost:3030/api/series"
        );

        const datos = await respuesta.json();

        if (!respuesta.ok) {
          throw new Error("No se pudieron obtener las series");
        }

        setSeries(datos);

        if (datos.length > 0) {
          setSerieSeleccionada(datos[0].serie_id);
        }

      } catch (error) {
        console.error(error);
        alert("No se pudieron cargar las series");
      }
    };

    obtenerSeries();
  }, []);

  const serieActual = series.find(
    (serie) => serie.serie_id === serieSeleccionada
  );

  const realizarCalculo = async (e) => {
    e.preventDefault();

    if (!usuario) {
      alert("No se encontró el usuario");
      return;
    }

    if (!serieSeleccionada || x === "" || n === "") {
      alert("Completa todos los campos");
      return;
    }

    setCargando(true);
    setResultado(null);

    try {
      const respuesta = await fetch(
        "http://localhost:3030/api/calculos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            calculo_id: "CAL" + Date.now(),
            usuario_id: usuario.usuario_id,
            serie_id: serieSeleccionada,
            x: Number(x),
            n: Number(n)
          })
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        alert(datos.mensaje || "Error al realizar el cálculo");
        return;
      }

      setResultado(datos.calculo);

    } catch (error) {
      console.error(error);
      alert("No se pudo conectar con el servidor");

    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="calcular-container">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="sidebar-brand">
          <span>∑</span>
          <strong>SeriesLab</strong>
        </div>

        <div className="sidebar-section">
          <span className="sidebar-title">PRINCIPAL</span>

          <button
            className="sidebar-item"
            onClick={() => irA("inicio")}
          >
            <span>⌂</span>
            Inicio
          </button>

          <button
            className="sidebar-item active"
            onClick={() => irA("calcular")}
          >
            <span>∑</span>
            Calcular
          </button>

          <button
            className="sidebar-item"
            onClick={() => irA("dashboard")}
          >
            <span>◫</span>
            Dashboard
          </button>

          <button
            className="sidebar-item"
            onClick={() => irA("historial")}
          >
            <span>◷</span>
            Historial
          </button>
        </div>

        <div className="sidebar-section">
          <span className="sidebar-title">GESTIÓN</span>

          <button className="sidebar-item">
            <span>♙</span>
            Usuarios
          </button>

          <button className="sidebar-item">
            <span>⚙</span>
            Ajustes
          </button>
        </div>

        <div className="sidebar-bottom">
          <div className="user-mini">
            <div className="user-avatar">
              {usuario?.nombre?.charAt(0)?.toUpperCase() || "A"}
            </div>

            <div>
              <strong>{usuario?.nombre || "Usuario"}</strong>
              <small>Mi cuenta</small>
            </div>
          </div>
        </div>

      </aside>

      {/* CONTENIDO */}
      <main className="calcular-main">

        <header className="calcular-header">
          <div className="breadcrumb">
            SERIESLAB <span>/</span> CALCULAR
          </div>
        </header>

        <section className="calcular-content">

          <div className="calcular-heading">
            <span>LABORATORIO MATEMÁTICO</span>

            <h1>
              Analiza una <em>serie.</em>
            </h1>

            <p>
              Selecciona una serie y define sus parámetros
              para obtener una aproximación matemática.
            </p>
          </div>

          {/* FORMULARIO */}
          <form
            className="calcular-card"
            onSubmit={realizarCalculo}
          >

            <div className="card-title">
              <div className="card-icon">∑</div>

              <div>
                <h2>Nueva serie</h2>
                <p>
                  Configura los valores para comenzar.
                </p>
              </div>
            </div>

            <div className="form-grid">

              {/* SERIE */}
              <div className="form-group">
                <label>SERIE MATEMÁTICA</label>

                <select
                  value={serieSeleccionada}
                  onChange={(e) =>
                    setSerieSeleccionada(e.target.value)
                  }
                  required
                >
                  {series.map((serie) => (
                    <option
                      key={serie.serie_id}
                      value={serie.serie_id}
                    >
                      {serie.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* TIPO */}
              <div className="form-group">
                <label>TIPO</label>

                <div className="info-field">
                  {serieActual?.tipo || "—"}
                </div>
              </div>

              {/* FUNCIÓN */}
              <div className="form-group full-width">
                <label>FUNCIÓN</label>

                <div className="function-field">
                  {serieActual?.funcion || "—"}
                </div>
              </div>

              {/* X */}
              <div className="form-group">
                <label>VALOR DE X</label>

                <input
                  type="number"
                  step="any"
                  placeholder="Ej. 0.5"
                  value={x}
                  onChange={(e) => setX(e.target.value)}
                  required
                />
              </div>

              {/* N */}
              <div className="form-group">
                <label>NÚMERO DE TÉRMINOS (N)</label>

                <input
                  type="number"
                  min="1"
                  step="1"
                  placeholder="Ej. 5"
                  value={n}
                  onChange={(e) => setN(e.target.value)}
                  required
                />
              </div>

            </div>

            <button
              type="submit"
              className="calcular-button"
              disabled={cargando}
            >
              {cargando ? "Calculando..." : "Calcular serie"}
              {!cargando && <span>→</span>}
            </button>

          </form>

          {/* RESULTADO */}
          {resultado && (
            <section className="resultado-card">

              <div className="resultado-heading">
                <span>RESULTADO DEL CÁLCULO</span>

                <h2>
                  {serieActual?.nombre}
                </h2>

                <p>
                  x = {resultado.x} &nbsp;·&nbsp;
                  n = {resultado.n}
                </p>
              </div>

              <div className="result-grid">

                <div className="result-item">
                  <span>VALOR APROXIMADO</span>
                  <strong>
                    {resultado.valor_aproximado}
                  </strong>
                </div>

                <div className="result-item">
                  <span>VALOR REAL</span>
                  <strong>
                    {resultado.valor_real}
                  </strong>
                </div>

                <div className="result-item">
                  <span>ERROR ABSOLUTO</span>
                  <strong>
                    {resultado.error_absoluto}
                  </strong>
                </div>

                <div className="result-item">
                  <span>ERROR PORCENTUAL</span>
                  <strong>
                    {resultado.error_porcentual}%
                  </strong>
                </div>

              </div>

            </section>
          )}

        </section>

      </main>

    </div>
  );
}

export default Calcular;
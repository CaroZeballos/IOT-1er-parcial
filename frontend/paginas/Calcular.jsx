import { useEffect, useState } from "react";
import "./Calcular.css";
import MenuCuenta from "../componentes/MenuCuenta.jsx";

function Calcular({ usuario, irA, cerrarSesion }) {
  const [series, setSeries] = useState([]);
  const [serieSeleccionada, setSerieSeleccionada] = useState("");

  const [x, setX] = useState("");
  const [n, setN] = useState("");

  const [resultado, setResultado] = useState(null);
  const [aproximaciones, setAproximaciones] = useState([]);
  const [cargando, setCargando] = useState(false);

  // Obtener las series desde MongoDB mediante el backend
  useEffect(() => {
    const obtenerSeries = async () => {
      try {
        const respuesta = await fetch(
          "/api/series"
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

  const valoresGrafica = aproximaciones
    .map((punto) => Number(punto.valor))
    .filter(Number.isFinite);
  const valorRealGrafica = Number(resultado?.valor_real);
  const todosLosValores = Number.isFinite(valorRealGrafica)
    ? [...valoresGrafica, valorRealGrafica]
    : valoresGrafica;
  const minimoGrafica = Math.min(...todosLosValores, 0);
  const maximoGrafica = Math.max(...todosLosValores, 0);
  const rangoGrafica = maximoGrafica - minimoGrafica || 1;
  const puntoX = (indice) =>
    55 + (indice / Math.max(aproximaciones.length - 1, 1)) * 690;
  const puntoY = (valor) =>
    245 - ((valor - minimoGrafica) / rangoGrafica) * 195;

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
    setAproximaciones([]);

    try {
      const respuesta = await fetch(
        "/api/calculos",
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
      setAproximaciones(datos.aproximaciones || []);

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

        <div className="sidebar-bottom">
          <MenuCuenta usuario={usuario} cerrarSesion={cerrarSesion} />
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
                  max="999"
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

              {aproximaciones.length > 0 && (
                <div className="convergencia-card">
                  <div className="convergencia-header">
                    <div>
                      <span>CONVERGENCIA POR TÉRMINO</span>
                      <h3>Aproximación en cada repetición</h3>
                    </div>
                    <div className="convergencia-leyenda">
                      <i></i> Aproximación
                      <i className="real"></i> Valor real
                    </div>
                  </div>

                  <div className="convergencia-grafica">
                    <svg viewBox="0 0 800 285" role="img" aria-label="Gráfica de aproximación por término">
                      {[50, 115, 180, 245].map((y) => (
                        <line key={y} x1="55" y1={y} x2="745" y2={y} className="convergencia-grid" />
                      ))}
                      <line x1="55" y1="50" x2="55" y2="245" className="convergencia-eje" />
                      <line x1="55" y1="245" x2="745" y2="245" className="convergencia-eje" />

                      {Number.isFinite(valorRealGrafica) && (
                        <line
                          x1="55"
                          y1={puntoY(valorRealGrafica)}
                          x2="745"
                          y2={puntoY(valorRealGrafica)}
                          className="convergencia-real"
                        />
                      )}

                      <polyline
                        points={aproximaciones
                          .map((punto, indice) => `${puntoX(indice)},${puntoY(Number(punto.valor))}`)
                          .join(" ")}
                        className="convergencia-linea"
                      />

                      {aproximaciones.map((punto, indice) => (
                        <g key={punto.termino}>
                          <circle
                            cx={puntoX(indice)}
                            cy={puntoY(Number(punto.valor))}
                            r="5"
                            className="convergencia-punto"
                          >
                            <title>{`Término ${punto.termino}: ${Number(punto.valor).toPrecision(8)}`}</title>
                          </circle>
                          {(aproximaciones.length <= 12 || indice === 0 || indice === aproximaciones.length - 1) && (
                            <text x={puntoX(indice)} y="268" textAnchor="middle">
                              {punto.termino}
                            </text>
                          )}
                        </g>
                      ))}
                    </svg>
                    <p>Número de términos (n)</p>
                  </div>
                </div>
              )}

            </section>
          )}

        </section>

      </main>

    </div>
  );
}

export default Calcular;

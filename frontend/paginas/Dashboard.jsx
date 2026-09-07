import { useEffect, useState } from "react";
import "./Dashboard.css";

function Dashboard({ usuario, irA }) {
  const [calculos, setCalculos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerDatos = async () => {
      if (!usuario?.usuario_id) return;

      try {
        const respuesta = await fetch(
          `http://localhost:3030/api/calculos/usuario/${usuario.usuario_id}`
        );

        const datos = await respuesta.json();

        if (!respuesta.ok) {
          throw new Error("No se pudieron obtener los datos");
        }

        setCalculos(datos);
      } catch (error) {
        console.error(error);
        alert("No se pudo cargar el Dashboard");
      } finally {
        setCargando(false);
      }
    };

    obtenerDatos();
  }, [usuario]);

  const obtenerNombreSerie = (serieId) => {
    const nombres = {
      SER001: "Seno",
      SER002: "Coseno",
      SER003: "Exponencial",
    };

    return nombres[serieId] || serieId;
  };

  const totalCalculos = calculos.length;

  const errorPromedio =
    totalCalculos > 0
      ? calculos.reduce(
          (total, calculo) =>
            total + Number(calculo.error_porcentual || 0),
          0
        ) / totalCalculos
      : 0;

  const menorError =
    totalCalculos > 0
      ? Math.min(
          ...calculos.map((calculo) =>
            Number(calculo.error_porcentual || 0)
          )
        )
      : 0;

  const cantidadesSeries = {
    Seno: calculos.filter((c) => c.serie_id === "SER001").length,
    Coseno: calculos.filter((c) => c.serie_id === "SER002").length,
    Exponencial: calculos.filter((c) => c.serie_id === "SER003").length,
  };

  const serieMasUtilizada =
    totalCalculos > 0
      ? Object.entries(cantidadesSeries).sort((a, b) => b[1] - a[1])[0][0]
      : "—";

  const maxCantidad = Math.max(
    cantidadesSeries.Seno,
    cantidadesSeries.Coseno,
    cantidadesSeries.Exponencial,
    1
  );

  const calculosOrdenados = [...calculos].sort(
  (a, b) => Number(a.n) - Number(b.n)
);

  const maxError = Math.max(
    ...calculos.map((calculo) =>
      Number(calculo.error_porcentual || 0)
    ),
    1
  );

  if (cargando) {
    return (
      <div className="dashboard-cargando">
        <div className="dashboard-spinner"></div>
        <p>Cargando Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">

      {/* SIDEBAR */}
      <aside className="dashboard-sidebar">

        <div className="dashboard-logo">
          <span>∑</span>
          <h2>SeriesLab</h2>
        </div>

        <div className="dashboard-menu">

          <p>PRINCIPAL</p>

          <button onClick={() => irA("inicio")}>
            🏠 Inicio
          </button>

          <button onClick={() => irA("calcular")}>
            🧮 Calcular
          </button>

          <button className="dashboard-activo">
            📊 Dashboard
          </button>

          <button onClick={() => irA("historial")}>
            📋 Historial
          </button>

          <p>GESTIÓN</p>

          <button>
            👥 Usuarios
          </button>

          <button>
            ⚙️ Ajustes
          </button>

        </div>
      </aside>

      {/* CONTENIDO */}
      <main className="dashboard-contenido">

        <div className="dashboard-header">
          <div>
            <span className="dashboard-etiqueta">
              ANÁLISIS DE DATOS
            </span>

            <h1>Dashboard</h1>

            <p>
              Visualización de tus cálculos y errores matemáticos.
            </p>
          </div>

          <div className="dashboard-usuario">
            <span>Usuario</span>
            <strong>{usuario?.nombre}</strong>
          </div>
        </div>

        {/* TARJETAS */}
        <section className="dashboard-tarjetas">

          <div className="dashboard-tarjeta">
            <span className="tarjeta-icono">∑</span>
            <div>
              <p>Total de cálculos</p>
              <h2>{totalCalculos}</h2>
            </div>
          </div>

          <div className="dashboard-tarjeta">
            <span className="tarjeta-icono">%</span>
            <div>
              <p>Error promedio</p>
              <h2>{errorPromedio.toFixed(6)}%</h2>
            </div>
          </div>

          <div className="dashboard-tarjeta">
            <span className="tarjeta-icono">✓</span>
            <div>
              <p>Menor error</p>
              <h2>{menorError.toFixed(6)}%</h2>
            </div>
          </div>

          <div className="dashboard-tarjeta">
            <span className="tarjeta-icono">★</span>
            <div>
              <p>Serie más utilizada</p>
              <h2>{serieMasUtilizada}</h2>
            </div>
          </div>

        </section>

        {/* GRAFICOS */}
        <section className="dashboard-graficos">

          {/* GRAFICO DE BARRAS */}
          <div className="grafico-card">

            <div className="grafico-header">
              <div>
                <h3>Cálculos por serie</h3>
                <p>Cantidad de cálculos realizados</p>
              </div>
            </div>

            <div className="grafico-barras">

              <div className="barra-item">
                <span>Seno</span>

                <div className="barra-fondo">
                  <div
                    className="barra"
                    style={{
                      width: `${(cantidadesSeries.Seno / maxCantidad) * 100}%`,
                    }}
                  ></div>
                </div>

                <strong>{cantidadesSeries.Seno}</strong>
              </div>

              <div className="barra-item">
                <span>Coseno</span>

                <div className="barra-fondo">
                  <div
                    className="barra"
                    style={{
                      width: `${(cantidadesSeries.Coseno / maxCantidad) * 100}%`,
                    }}
                  ></div>
                </div>

                <strong>{cantidadesSeries.Coseno}</strong>
              </div>

              <div className="barra-item">
                <span>Exponencial</span>

                <div className="barra-fondo">
                  <div
                    className="barra"
                    style={{
                      width: `${(cantidadesSeries.Exponencial / maxCantidad) * 100}%`,
                    }}
                  ></div>
                </div>

                <strong>{cantidadesSeries.Exponencial}</strong>
              </div>

            </div>
          </div>

          {/* ERROR */}
          <div className="grafico-card">

            <div className="grafico-header">
              <div>
                <h3>Error porcentual</h3>
                <p>Error de cada cálculo realizado</p>
              </div>
            </div>

            <div className="grafico-errores">

              {calculos.length === 0 ? (
                <div className="sin-datos">
                  No hay datos para mostrar.
                </div>
              ) : (
                calculos.map((calculo, index) => {

                  const error = Number(
                    calculo.error_porcentual || 0
                  );

                  return (
                    <div
                      className="error-item"
                      key={calculo.calculo_id}
                    >
                      <div className="error-info">
                        <span>
                          #{index + 1}{" "}
                          {obtenerNombreSerie(calculo.serie_id)}
                        </span>

                        <strong>
                          {error.toFixed(6)}%
                        </strong>
                      </div>

                      <div className="error-fondo">
                        <div
                          className="error-barra"
                          style={{
                            width: `${(error / maxError) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })
              )}

            </div>
          </div>

        </section>

        {/* GRAFICO ERROR VS N */}
<section className="grafico-card grafico-n">

  <div className="grafico-header">
    <div>
      <h3>Error según número de términos</h3>
      <p>
        Relación entre el número de términos (n) y el error porcentual
      </p>
    </div>
  </div>

  

  {calculos.length === 0 ? (
    <div className="sin-datos">
      No hay datos para mostrar.
    </div>
  ) : (
    <div className="grafico-linea-contenedor">

      <svg
        viewBox="0 0 800 300"
        className="grafico-linea"
        preserveAspectRatio="none"
      >

        {/* Líneas horizontales */}
        <line x1="60" y1="40" x2="760" y2="40" className="linea-grid" />
        <line x1="60" y1="100" x2="760" y2="100" className="linea-grid" />
        <line x1="60" y1="160" x2="760" y2="160" className="linea-grid" />
        <line x1="60" y1="220" x2="760" y2="220" className="linea-grid" />
        <line x1="60" y1="260" x2="760" y2="260" className="linea-eje" />

        {/* Eje vertical */}
        <line x1="60" y1="40" x2="60" y2="260" className="linea-eje" />

        {/* Línea del gráfico */}
        <polyline
          points={calculosOrdenados
            .map((calculo, index) => {
              const x =
                60 +
                (index / Math.max(calculos.length - 1, 1)) * 700;

              const error = Number(
                calculo.error_porcentual || 0
              );

              const y =
                260 -
                (error / maxError) * 220;

              return `${x},${y}`;
            })
            .join(" ")}
          className="linea-grafico"
        />

        {/* Puntos */}
        {calculosOrdenados
        .map((calculo, index) => {
          const x =
            60 +
            (index / Math.max(calculos.length - 1, 1)) * 700;

          const error = Number(
            calculo.error_porcentual || 0
          );

          const y =
            260 -
            (error / maxError) * 220;

          return (
            <circle
              key={calculo.calculo_id}
              cx={x}
              cy={y}
              r="5"
              className="punto-grafico"
            />
          );
        })}

      </svg>

      <div className="eje-x">
        <span>1</span>
        <span>2</span>
        <span>3</span>
        <span>4</span>
        <span>5</span>
      </div>

      <div className="etiqueta-eje-x">
        Número de términos (n)
      </div>

    </div>
  )}

</section>

        {/* TABLA */}
        <section className="dashboard-tabla-card">

          <div className="grafico-header">
            <div>
              <h3>Detalle de cálculos</h3>
              <p>Datos generados por {usuario?.nombre}</p>
            </div>
          </div>

          {calculos.length === 0 ? (
            <div className="sin-datos">
              Todavía no has realizado cálculos.
            </div>
          ) : (
            <div className="dashboard-tabla-contenedor">

              <table className="dashboard-tabla">

                <thead>
                  <tr>
                    <th>Serie</th>
                    <th>x</th>
                    <th>n</th>
                    <th>Aproximado</th>
                    <th>Real</th>
                    <th>Error absoluto</th>
                    <th>Error %</th>
                  </tr>
                </thead>

                <tbody>

                  {calculos.map((calculo) => (
                    <tr key={calculo.calculo_id}>

                      <td>
                        <span className="dashboard-serie">
                          {obtenerNombreSerie(calculo.serie_id)}
                        </span>
                      </td>

                      <td>{calculo.x}</td>

                      <td>{calculo.n}</td>

                      <td>
                        {Number(calculo.valor_aproximado).toFixed(6)}
                      </td>

                      <td>
                        {Number(calculo.valor_real).toFixed(6)}
                      </td>

                      <td>
                        {Number(calculo.error_absoluto).toExponential(4)}
                      </td>

                      <td>
                        {Number(calculo.error_porcentual).toFixed(6)}%
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}

        </section>

      </main>
    </div>
  );
}

export default Dashboard;
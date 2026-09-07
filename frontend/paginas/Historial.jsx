import { useEffect, useState } from "react";
import "./Historial.css";

function Historial({ usuario, irA }) {
  const [calculos, setCalculos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerHistorial = async () => {
      if (!usuario?.usuario_id) return;

      try {
        const respuesta = await fetch(
          `http://localhost:3030/api/calculos/usuario/${usuario.usuario_id}`
        );

        const datos = await respuesta.json();

        if (!respuesta.ok) {
          throw new Error("No se pudo obtener el historial");
        }

        setCalculos(datos);
      } catch (error) {
        console.error(error);
        alert("No se pudo cargar el historial");
      } finally {
        setCargando(false);
      }
    };

    obtenerHistorial();
  }, [usuario]);

  const obtenerNombreSerie = (serieId) => {
    const nombres = {
      SER001: "Seno",
      SER002: "Coseno",
      SER003: "Exponencial",
    };

    return nombres[serieId] || serieId;
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-BO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="historial-layout">

      <aside className="historial-sidebar">
        <div className="historial-logo">
          <span>∑</span>
          <h2>SeriesLab</h2>
        </div>

        <div className="historial-menu">
          <p>PRINCIPAL</p>

          <button onClick={() => irA("inicio")}>
            🏠 Inicio
          </button>

          <button onClick={() => irA("calcular")}>
            🧮 Calcular
          </button>

          <button onClick={() => irA("dashboard")}>
            📊 Dashboard
          </button>

          <button className="historial-activo">
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

      <main className="historial-contenido">

        <div className="historial-header">
          <div>
            <span className="historial-etiqueta">SERIESLAB</span>
            <h1>Mi historial</h1>
            <p>
              Consulta los cálculos que has realizado anteriormente.
            </p>
          </div>

          <button
            className="btn-nuevo-calculo"
            onClick={() => irA("calcular")}
          >
            + Nuevo cálculo
          </button>
        </div>

        <div className="historial-card">

          {cargando ? (
            <div className="historial-vacio">
              <div className="historial-spinner"></div>
              <p>Cargando historial...</p>
            </div>
          ) : calculos.length === 0 ? (
            <div className="historial-vacio">
              <span>📋</span>
              <h3>Aún no tienes cálculos</h3>
              <p>Realiza tu primer cálculo para verlo aquí.</p>

              <button onClick={() => irA("calcular")}>
                Realizar cálculo
              </button>
            </div>
          ) : (
            <div className="tabla-contenedor">
              <table className="tabla-historial">
                <thead>
                  <tr>
                    <th>Serie</th>
                    <th>x</th>
                    <th>n</th>
                    <th>Aproximado</th>
                    <th>Valor real</th>
                    <th>Error absoluto</th>
                    <th>Error %</th>
                    <th>Fecha</th>
                  </tr>
                </thead>

                <tbody>
                  {calculos.map((calculo) => (
                    <tr key={calculo.calculo_id}>
                      <td>
                        <span className="serie-badge">
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

                      <td>
                        {formatearFecha(calculo.fecha)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>

      </main>
    </div>
  );
}

export default Historial;
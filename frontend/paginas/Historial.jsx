import { useEffect, useState } from "react";
import "./Historial.css";
import MenuCuenta from "../componentes/MenuCuenta.jsx";

function Historial({ usuario, irA, analizarCalculo, cerrarSesion }) {
  const [calculos, setCalculos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerHistorial = async () => {
      if (!usuario?.usuario_id) return;

      try {
        const respuesta = await fetch(
          `/api/calculos/usuario/${usuario.usuario_id}`
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

  const formatearPorcentaje = (valor) => {
    const numero = Number(valor || 0);
    if (numero === 0) return "0%";
    return Math.abs(numero) < 0.000001
      ? `${numero.toExponential(4)}%`
      : `${numero.toFixed(6)}%`;
  };

  return (
    <div className="historial-layout">

      <aside className="sidebar">
        <div className="sidebar-brand">
          <span>∑</span>
          <strong>SeriesLab</strong>
        </div>

        <div className="sidebar-section">
          <span className="sidebar-title">PRINCIPAL</span>

          <button className="sidebar-item" onClick={() => irA("inicio")}>
            <span>⌂</span> Inicio
          </button>

          <button className="sidebar-item" onClick={() => irA("calcular")}>
            <span>∑</span> Calcular
          </button>

          <button className="sidebar-item" onClick={() => irA("dashboard")}>
            <span>◫</span> Dashboard
          </button>

          <button className="sidebar-item active">
            <span>◷</span> Historial
          </button>
        </div>

        <div className="sidebar-bottom">
          <MenuCuenta usuario={usuario} cerrarSesion={cerrarSesion} />
        </div>
      </aside>

      <main className="historial-contenido">

        <div className="historial-header">
          <div>
            <span className="historial-etiqueta">REGISTRO DE ACTIVIDAD</span>
            <h1>Historial de <em>cálculos.</em></h1>
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
                    <th>Valor calculado</th>
                    <th>Valor real</th>
                    <th>Error absoluto</th>
                    <th>Error porcentual</th>
                    <th>Fecha</th>
                    <th>Análisis</th>
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
                        {formatearPorcentaje(calculo.error_porcentual)}
                      </td>

                      <td>
                        {formatearFecha(calculo.fecha)}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn-ver-analisis"
                          onClick={() => analizarCalculo(calculo.calculo_id)}
                        >
                          Ver análisis →
                        </button>
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

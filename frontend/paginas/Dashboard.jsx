import { useEffect, useState } from "react";
import "./Dashboard.css";
import MenuCuenta from "../componentes/MenuCuenta.jsx";

function Dashboard({ usuario, irA, calculoInicialId, cerrarSesion }) {
  const [calculos, setCalculos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [calculoGraficaId, setCalculoGraficaId] = useState("");
  const [progresionError, setProgresionError] = useState([]);
  const [zoomGrafica, setZoomGrafica] = useState(1);
  const [zoomVertical, setZoomVertical] = useState(1);
  const [inicioGrafica, setInicioGrafica] = useState(0);
  const [puntoSeleccionado, setPuntoSeleccionado] = useState(null);
  const [paginaIteraciones, setPaginaIteraciones] = useState(1);

  useEffect(() => {
    const obtenerDatos = async () => {
      if (!usuario?.usuario_id) return;

      try {
        const respuesta = await fetch(
          `/api/calculos/usuario/${usuario.usuario_id}`
        );

        const datos = await respuesta.json();

        if (!respuesta.ok) {
          throw new Error("No se pudieron obtener los datos");
        }

        setCalculos(datos);
        const calculoInicialExiste = datos.some(
          (calculo) => calculo.calculo_id === calculoInicialId
        );
        setCalculoGraficaId(
          calculoInicialExiste
            ? calculoInicialId
            : datos.at(-1)?.calculo_id || ""
        );
      } catch (error) {
        console.error(error);
        alert("No se pudo cargar el Dashboard");
      } finally {
        setCargando(false);
      }
    };

    obtenerDatos();
  }, [usuario, calculoInicialId]);

  useEffect(() => {
    if (!calculoGraficaId) {
      return;
    }

    const obtenerProgresion = async () => {
      try {
        const respuesta = await fetch(
          `/api/calculos/${calculoGraficaId}/progresion`
        );
        const datos = await respuesta.json();
        if (!respuesta.ok) throw new Error(datos.mensaje);
        setProgresionError(datos.aproximaciones || []);
      } catch (error) {
        console.error(error);
        setProgresionError([]);
      }
    };

    obtenerProgresion();
  }, [calculoGraficaId]);

  const obtenerNombreSerie = (serieId) => {
    const nombres = {
      SER001: "Seno",
      SER002: "Coseno",
      SER003: "Exponencial",
    };

    return nombres[serieId] || serieId;
  };

  const formatearPorcentaje = (valor) => {
    const numero = Number(valor || 0);
    if (numero === 0) return "0%";
    return Math.abs(numero) < 0.000001
      ? `${numero.toExponential(4)}%`
      : `${numero.toFixed(6)}%`;
  };

  const serieNormalizada = (calculo) =>
    String(calculo.serie_id || "").trim().toUpperCase();

  const calculoGrafica = calculos.find(
    (calculo) => calculo.calculo_id === calculoGraficaId
  );
  const cantidadVisible = Math.max(
    2,
    Math.ceil(progresionError.length / zoomGrafica)
  );
  const maximoInicio = Math.max(0, progresionError.length - cantidadVisible);
  const inicioSeguro = Math.min(inicioGrafica, maximoInicio);
  const progresionVisible = progresionError.slice(
    inicioSeguro,
    inicioSeguro + cantidadVisible
  );
  const minimoN = progresionVisible[0]?.termino ?? 0;
  const maximoN = progresionVisible.at(-1)?.termino ?? 0;
  const rangoN = maximoN - minimoN || 1;
  const altoGrafica = 300 * zoomVertical;
  const transformarY = (y) => 40 + ((Number(y) - 40) / 220) * (altoGrafica - 80);
  const baseGrafica = transformarY(260);
  const centroGrafica = transformarY(150);
  const coordenadaX = (valorN) =>
    minimoN === maximoN
      ? 410
      : 60 + ((Number(valorN) - minimoN) / rangoN) * 700;
  const valoresGrafica = progresionVisible
    .map((punto) => Number(punto.valor))
    .filter(Number.isFinite);
  const minimoValor = valoresGrafica.length ? Math.min(...valoresGrafica) : 0;
  const maximoValor = valoresGrafica.length ? Math.max(...valoresGrafica) : 1;
  const margenValor = (maximoValor - minimoValor || Math.abs(maximoValor) || 1) * 0.12;
  const limiteInferior = minimoValor - margenValor;
  const limiteSuperior = maximoValor + margenValor;
  const rangoValor = limiteSuperior - limiteInferior || 1;
  const coordenadaY = (valor) =>
    transformarY(260 - ((Number(valor) - limiteInferior) / rangoValor) * 220);
  const valorRealGrafica = Number(calculoGrafica?.valor_real || 0);
  const resultadosIteraciones = progresionError.map((punto, indice) => {
    const valor = Number(punto.valor);
    const valorAnterior = indice > 0
      ? Number(progresionError[indice - 1].valor)
      : 0;
    return {
      iteracion: punto.termino,
      aporte: valor - valorAnterior,
      valor,
      error: Math.abs(valorRealGrafica - valor),
    };
  });
  const filasPorPagina = 25;
  const totalPaginasIteraciones = Math.max(
    1,
    Math.ceil(resultadosIteraciones.length / filasPorPagina)
  );
  const paginaIteracionesSegura = Math.min(
    paginaIteraciones,
    totalPaginasIteraciones
  );
  const iteracionesPagina = resultadosIteraciones.slice(
    (paginaIteracionesSegura - 1) * filasPorPagina,
    paginaIteracionesSegura * filasPorPagina
  );
  const mejorIteracion = resultadosIteraciones.reduce(
    (mejor, iteracion) =>
      !mejor || iteracion.error < mejor.error ? iteracion : mejor,
    null
  );
  const erroresAbsolutos = progresionVisible.map((punto) => ({
    termino: punto.termino,
    error: Math.abs(valorRealGrafica - Number(punto.valor)),
  }));
  const maximoErrorAbsoluto = Math.max(
    ...erroresAbsolutos.map((punto) => punto.error),
    Number.EPSILON
  );
  const erroresPositivos = erroresAbsolutos
    .map((punto) => punto.error)
    .filter((error) => error > 0);
  const minimoErrorPositivo = erroresPositivos.length
    ? Math.min(...erroresPositivos)
    : Number.EPSILON;
  const usarEscalaLogaritmica =
    maximoErrorAbsoluto / minimoErrorPositivo > 1000;
  const rangoLogaritmico =
    Math.log10(maximoErrorAbsoluto) - Math.log10(minimoErrorPositivo) || 1;
  const coordenadaYError = (error) => {
    if (!usarEscalaLogaritmica) {
      return transformarY(260 - (Number(error) / maximoErrorAbsoluto) * 220);
    }
    if (Number(error) <= 0) return baseGrafica;
    const proporcion =
      (Math.log10(Number(error)) - Math.log10(minimoErrorPositivo)) /
      rangoLogaritmico;
    return transformarY(250 - proporcion * 210);
  };
  const valoresCombinados = [
    ...progresionVisible.map((punto) => Number(punto.valor)),
    ...erroresAbsolutos.map((punto) => Number(punto.error)),
    0,
  ].filter(Number.isFinite);
  const minimoCombinado = Math.min(...valoresCombinados);
  const maximoCombinado = Math.max(...valoresCombinados);
  const margenCombinado =
    (maximoCombinado - minimoCombinado || Math.abs(maximoCombinado) || 1) * 0.1;
  const limiteInferiorCombinado = minimoCombinado - margenCombinado;
  const limiteSuperiorCombinado = maximoCombinado + margenCombinado;
  const rangoCombinado =
    limiteSuperiorCombinado - limiteInferiorCombinado || 1;
  const coordenadaYCombinada = (valor) =>
    transformarY(
      260 - ((Number(valor) - limiteInferiorCombinado) / rangoCombinado) * 220
    );
  const aportesTerminos = progresionVisible.map((punto) => {
    const indiceOriginal = progresionError.findIndex(
      (elemento) => elemento.termino === punto.termino
    );
    const anterior = indiceOriginal > 0
      ? Number(progresionError[indiceOriginal - 1].valor)
      : 0;
    return {
      termino: punto.termino,
      aporte: Number(punto.valor) - anterior,
    };
  });
  const maximoAporte = Math.max(
    ...aportesTerminos.map((punto) => Math.abs(punto.aporte)),
    Number.EPSILON
  );
  const coordenadaYAporte = (aporte) =>
    transformarY(150 - (Number(aporte) / maximoAporte) * 105);
  const anchoBarraAporte = Math.max(
    4,
    Math.min(24, 520 / Math.max(aportesTerminos.length, 1))
  );
  const acercarGrafica = () => {
    const nuevoZoom = Math.min(8, zoomGrafica * 2);
    setZoomGrafica(nuevoZoom);
    setInicioGrafica((actual) =>
      Math.min(actual, Math.max(0, progresionError.length - Math.ceil(progresionError.length / nuevoZoom)))
    );
  };
  const alejarGrafica = () => {
    const nuevoZoom = Math.max(1, zoomGrafica / 2);
    setZoomGrafica(nuevoZoom);
    setInicioGrafica((actual) =>
      Math.min(actual, Math.max(0, progresionError.length - Math.ceil(progresionError.length / nuevoZoom)))
    );
  };
  const restablecerGrafica = () => {
    setZoomGrafica(1);
    setZoomVertical(1);
    setInicioGrafica(0);
  };
  const datosSerieGrafica = {
    SER001: { nombre: "Seno", clase: "linea-seno" },
    SER002: { nombre: "Coseno", clase: "linea-coseno" },
    SER003: { nombre: "Exponencial", clase: "linea-exponencial" },
  }[serieNormalizada(calculoGrafica || {})] || { nombre: "Serie", clase: "linea-seno" };

  const renderizarControlesZoom = () => progresionError.length > 1 && (
    <div className="controles-zoom">
      <span>
        Mostrando términos {minimoN}–{maximoN} de {progresionError.length}
      </span>
      <div>
        <button type="button" onClick={() => setInicioGrafica(Math.max(0, inicioSeguro - cantidadVisible))} disabled={inicioSeguro === 0} title="Ver términos anteriores">←</button>
        <span className="zoom-eje">Horizontal</span>
        <button type="button" onClick={alejarGrafica} disabled={zoomGrafica === 1} title="Alejar">−</button>
        <strong>{zoomGrafica}×</strong>
        <button type="button" onClick={acercarGrafica} disabled={cantidadVisible <= 2} title="Acercar">+</button>
        <button type="button" onClick={() => setInicioGrafica(Math.min(maximoInicio, inicioSeguro + cantidadVisible))} disabled={inicioSeguro >= maximoInicio} title="Ver términos siguientes">→</button>
        <span className="zoom-eje">Eje Y</span>
        <button type="button" onClick={() => setZoomVertical((actual) => Math.max(1, actual - 0.5))} disabled={zoomVertical === 1} title="Alejar valores">−</button>
        <strong>{zoomVertical}×</strong>
        <button type="button" onClick={() => setZoomVertical((actual) => Math.min(4, actual + 0.5))} disabled={zoomVertical >= 4} title="Ampliar variaciones">+</button>
        <button type="button" className="zoom-restablecer" onClick={restablecerGrafica}>Restablecer</button>
      </div>
    </div>
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

          <button className="sidebar-item active">
            <span>◫</span> Dashboard
          </button>

          <button className="sidebar-item" onClick={() => irA("historial")}>
            <span>◷</span> Historial
          </button>

        </div>

        <div className="sidebar-bottom">
          <MenuCuenta usuario={usuario} cerrarSesion={cerrarSesion} />
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

          <MenuCuenta usuario={usuario} cerrarSesion={cerrarSesion} variante="dashboard" />
        </div>

        {/* TARJETAS */}
        <section className="dashboard-tarjetas">

          <div className="dashboard-tarjeta">
            <span className="tarjeta-icono">ƒ</span>
            <div>
              <p>Serie seleccionada</p>
              <h2>{calculoGrafica ? obtenerNombreSerie(calculoGrafica.serie_id) : "—"}</h2>
            </div>
          </div>

          <div className="dashboard-tarjeta">
            <span className="tarjeta-icono">x</span>
            <div>
              <p>Valor de x</p>
              <h2>{calculoGrafica?.x ?? "—"}</h2>
            </div>
          </div>

          <div className="dashboard-tarjeta">
            <span className="tarjeta-icono">n</span>
            <div>
              <p>Número de términos</p>
              <h2>{calculoGrafica?.n ?? "—"}</h2>
            </div>
          </div>

          <div className="dashboard-tarjeta">
            <span className="tarjeta-icono">≈</span>
            <div>
              <p>Valor calculado</p>
              <h2>{calculoGrafica ? Number(calculoGrafica.valor_aproximado).toPrecision(8) : "—"}</h2>
            </div>
          </div>

          <div className="dashboard-tarjeta">
            <span className="tarjeta-icono">=</span>
            <div>
              <p>Valor real</p>
              <h2>{calculoGrafica ? Number(calculoGrafica.valor_real).toPrecision(8) : "—"}</h2>
            </div>
          </div>

          <div className="dashboard-tarjeta">
            <span className="tarjeta-icono">Δ</span>
            <div>
              <p>Error absoluto</p>
              <h2>{calculoGrafica ? Number(calculoGrafica.error_absoluto).toExponential(4) : "—"}</h2>
            </div>
          </div>

          <div className="dashboard-tarjeta">
            <span className="tarjeta-icono">%</span>
            <div>
              <p>Error porcentual</p>
              <h2>{calculoGrafica ? formatearPorcentaje(calculoGrafica.error_porcentual) : "—"}</h2>
            </div>
          </div>

          <div className="dashboard-tarjeta tarjeta-mejor-termino">
            <span className="tarjeta-icono">✓</span>
            <div>
              <p>Término más preciso</p>
              <h2>{mejorIteracion ? `n = ${mejorIteracion.iteracion}` : "—"}</h2>
              {mejorIteracion && (
                <small>
                  Valor {mejorIteracion.valor.toPrecision(8)} · error {mejorIteracion.error.toExponential(3)}
                </small>
              )}
            </div>
          </div>

        </section>

        {/* GRAFICO ERROR VS N */}
        <section className="grafico-card grafico-n">
          <div className="grafico-header frecuencia-encabezado">
            <div>
              <h3>Valor calculado por iteración</h3>
              <p>Eje X: iteración · Eje Y: valor calculado</p>
            </div>
            <label className="selector-serie-grafica">
              <span>Cálculo</span>
              <select
                value={calculoGraficaId}
                onChange={(evento) => {
                  setCalculoGraficaId(evento.target.value);
                  setZoomGrafica(1);
                  setZoomVertical(1);
                  setInicioGrafica(0);
                  setPuntoSeleccionado(null);
                  setPaginaIteraciones(1);
                }}
              >
                {calculos.map((calculo) => (
                  <option key={calculo.calculo_id} value={calculo.calculo_id}>
                    {obtenerNombreSerie(calculo.serie_id)} · x={calculo.x} · n={calculo.n}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {renderizarControlesZoom()}

          {progresionError.length === 0 ? (
            <div className="sin-datos">
              No hay datos para mostrar.
            </div>
          ) : (
            <div className="grafico-linea-contenedor">
              <svg viewBox={`0 0 800 ${altoGrafica}`} className="grafico-linea" style={{ height: `${altoGrafica}px` }}>
                <defs>
                  <clipPath id="recorte-valor">
                    <rect x="63" y="43" width="694" height={altoGrafica - 86} />
                  </clipPath>
                </defs>
                {[40, 100, 160, 220].map((y) => (
                  <line key={y} x1="60" y1={transformarY(y)} x2="760" y2={transformarY(y)} className="linea-grid" />
                ))}
                <line x1="60" y1={baseGrafica} x2="760" y2={baseGrafica} className="linea-eje" />
                <line x1="60" y1="40" x2="60" y2={baseGrafica} className="linea-eje" />

                <g clipPath="url(#recorte-valor)">
                  {progresionVisible.length > 1 && (
                    <polyline
                      points={progresionVisible
                        .map((punto) => `${coordenadaX(punto.termino)},${coordenadaY(punto.valor)}`)
                        .join(" ")}
                      className={`linea-grafico ${datosSerieGrafica.clase}`}
                    />
                  )}
                  {progresionVisible.map((punto) => (
                  <circle
                    key={punto.termino}
                    cx={coordenadaX(punto.termino)}
                    cy={coordenadaY(punto.valor)}
                    r={puntoSeleccionado?.tipo === "valor" && puntoSeleccionado.x === punto.termino ? "8" : "5"}
                    className={`punto-grafico punto-interactivo ${datosSerieGrafica.clase}`}
                    role="button"
                    tabIndex="0"
                    onClick={() => setPuntoSeleccionado({ tipo: "valor", x: punto.termino, y: Number(punto.valor) })}
                    onKeyDown={(evento) => {
                      if (evento.key === "Enter" || evento.key === " ") {
                        setPuntoSeleccionado({ tipo: "valor", x: punto.termino, y: Number(punto.valor) });
                      }
                    }}
                  >
                    <title>{`${datosSerieGrafica.nombre}: iteración ${punto.termino}, valor=${Number(punto.valor).toPrecision(8)}`}</title>
                  </circle>
                  ))}
                </g>
                <line x1="60" y1={baseGrafica} x2="760" y2={baseGrafica} className="linea-eje linea-eje-frontal" />
                <line x1="60" y1="40" x2="60" y2={baseGrafica} className="linea-eje linea-eje-frontal" />
                <text x="16" y={altoGrafica / 2} textAnchor="middle" transform={`rotate(-90 16 ${altoGrafica / 2})`} className="titulo-eje">Valor calculado</text>

                <text x="52" y="45" textAnchor="end">{limiteSuperior.toPrecision(4)}</text>
                <text x="52" y={baseGrafica} textAnchor="end">{limiteInferior.toPrecision(4)}</text>

                {minimoN === maximoN ? (
                  <text x="410" y={altoGrafica - 18} textAnchor="middle">{minimoN}</text>
                ) : (
                  <>
                    <text x="60" y={altoGrafica - 18} textAnchor="middle">{minimoN}</text>
                    <text x="760" y={altoGrafica - 18} textAnchor="middle">{maximoN}</text>
                  </>
                )}
              </svg>
              <div className="etiqueta-eje-x">Iteración</div>
              {puntoSeleccionado?.tipo === "valor" && (
                <div className="coordenadas-punto">
                  <span>Punto seleccionado</span>
                  <strong>x = {puntoSeleccionado.x}</strong>
                  <strong>y = {puntoSeleccionado.y.toPrecision(10)}</strong>
                </div>
              )}
            </div>
          )}
        </section>

        <section className="grafico-card grafico-n">
          <div className="grafico-header frecuencia-encabezado">
            <div>
              <h3>Valor calculado y error</h3>
              <p>Comparación de la aproximación y su error en cada iteración</p>
            </div>
            <div className="leyenda-grafica-combinada">
              <span><i className="calculado" />Valor calculado</span>
              <span><i className="error" />Error absoluto</span>
            </div>
          </div>
          {renderizarControlesZoom()}
          {progresionVisible.length === 0 ? (
            <div className="sin-datos">Selecciona un cálculo para mostrar la comparación.</div>
          ) : (
            <div className="grafico-linea-contenedor">
              <svg viewBox={`0 0 800 ${altoGrafica}`} className="grafico-linea" style={{ height: `${altoGrafica}px` }}>
                <defs>
                  <clipPath id="recorte-combinado">
                    <rect x="63" y="43" width="694" height={altoGrafica - 86} />
                  </clipPath>
                </defs>
                {[40, 100, 160, 220].map((y) => (
                  <line key={y} x1="60" y1={transformarY(y)} x2="760" y2={transformarY(y)} className="linea-grid" />
                ))}
                <g clipPath="url(#recorte-combinado)">
                  {progresionVisible.length > 1 && (
                    <>
                      <polyline
                        points={progresionVisible.map((punto) => `${coordenadaX(punto.termino)},${coordenadaYCombinada(punto.valor)}`).join(" ")}
                        className="linea-grafico linea-calculado-combinada"
                      />
                      <polyline
                        points={erroresAbsolutos.map((punto) => `${coordenadaX(punto.termino)},${coordenadaYCombinada(punto.error)}`).join(" ")}
                        className="linea-grafico linea-error-combinada"
                      />
                    </>
                  )}
                  {progresionVisible.map((punto) => (
                    <circle
                      key={`valor-${punto.termino}`}
                      cx={coordenadaX(punto.termino)}
                      cy={coordenadaYCombinada(punto.valor)}
                      r="4"
                      className="punto-combinado punto-calculado-combinado"
                    >
                      <title>{`Iteración ${punto.termino}: valor calculado ${Number(punto.valor).toPrecision(8)}`}</title>
                    </circle>
                  ))}
                  {erroresAbsolutos.map((punto) => (
                    <circle
                      key={`error-${punto.termino}`}
                      cx={coordenadaX(punto.termino)}
                      cy={coordenadaYCombinada(punto.error)}
                      r="4"
                      className="punto-combinado punto-error-combinado"
                    >
                      <title>{`Iteración ${punto.termino}: error ${punto.error.toExponential(6)}`}</title>
                    </circle>
                  ))}
                </g>
                <line x1="60" y1={baseGrafica} x2="760" y2={baseGrafica} className="linea-eje linea-eje-frontal" />
                <line x1="60" y1="40" x2="60" y2={baseGrafica} className="linea-eje linea-eje-frontal" />
                <text x="16" y={altoGrafica / 2} textAnchor="middle" transform={`rotate(-90 16 ${altoGrafica / 2})`} className="titulo-eje">Valor</text>
                <text x="52" y="45" textAnchor="end">{limiteSuperiorCombinado.toPrecision(4)}</text>
                <text x="52" y={baseGrafica} textAnchor="end">{limiteInferiorCombinado.toPrecision(4)}</text>
                <text x="60" y={altoGrafica - 18} textAnchor="middle">{minimoN}</text>
                <text x="760" y={altoGrafica - 18} textAnchor="middle">{maximoN}</text>
              </svg>
              <div className="etiqueta-eje-x">Iteración</div>
            </div>
          )}
        </section>

        <section className="grafico-card grafico-n">
          <div className="grafico-header">
            <div>
              <h3>Aporte de cada término</h3>
              <p>Cuánto suma o resta cada término al valor calculado seleccionado</p>
            </div>
          </div>
          {renderizarControlesZoom()}
          {aportesTerminos.length === 0 ? (
            <div className="sin-datos">Selecciona un cálculo para ver sus términos.</div>
          ) : (
            <div className="grafico-linea-contenedor">
              <svg viewBox={`0 0 800 ${altoGrafica}`} className="grafico-linea" style={{ height: `${altoGrafica}px` }}>
                <defs>
                  <clipPath id="recorte-aportes">
                    <rect x="63" y="43" width="694" height={altoGrafica - 86} />
                  </clipPath>
                </defs>
                {[45, 97.5, 150, 202.5, 255].map((y) => (
                  <line key={y} x1="60" y1={transformarY(y)} x2="760" y2={transformarY(y)} className={y === 150 ? "linea-cero" : "linea-grid"} />
                ))}
                <line x1="60" y1="40" x2="60" y2={baseGrafica} className="linea-eje" />
                <g clipPath="url(#recorte-aportes)">
                  {aportesTerminos.map((punto) => {
                  const y = coordenadaYAporte(punto.aporte);
                  return (
                    <rect
                      key={punto.termino}
                      x={coordenadaX(punto.termino) - anchoBarraAporte / 2}
                      y={Math.min(centroGrafica, y)}
                      width={anchoBarraAporte}
                      height={Math.max(1, Math.abs(centroGrafica - y))}
                      rx="3"
                      className={punto.aporte >= 0 ? "barra-aporte-positivo" : "barra-aporte-negativo"}
                    >
                      <title>{`Término ${punto.termino}: aporte ${punto.aporte.toPrecision(7)}`}</title>
                    </rect>
                  );
                  })}
                </g>
                <line x1="60" y1="40" x2="60" y2={baseGrafica} className="linea-eje linea-eje-frontal" />
                <line x1="60" y1={centroGrafica} x2="760" y2={centroGrafica} className="linea-eje linea-eje-frontal" />
                <text x="16" y={altoGrafica / 2} textAnchor="middle" transform={`rotate(-90 16 ${altoGrafica / 2})`} className="titulo-eje">Aporte</text>
                <text x="52" y="48" textAnchor="end">+{maximoAporte.toPrecision(3)}</text>
                <text x="52" y={centroGrafica + 4} textAnchor="end">0</text>
                <text x="52" y={baseGrafica} textAnchor="end">−{maximoAporte.toPrecision(3)}</text>
                <text x="60" y={altoGrafica - 18} textAnchor="middle">{minimoN}</text>
                <text x="760" y={altoGrafica - 18} textAnchor="middle">{maximoN}</text>
              </svg>
              <div className="etiqueta-eje-x">Iteración</div>
              <div className="leyenda-aportes"><span><i className="positivo" />Suma</span><span><i className="negativo" />Resta</span></div>
            </div>
          )}
        </section>

        <section className="grafico-card grafico-n">
          <div className="grafico-header">
            <div>
              <h3>Error absoluto por iteración</h3>
              <p>
                Diferencia entre el valor calculado y el valor real en cada término
                {usarEscalaLogaritmica && " · escala logarítmica"}
              </p>
            </div>
          </div>
          {renderizarControlesZoom()}
          {erroresAbsolutos.length === 0 ? (
            <div className="sin-datos">Selecciona un cálculo para mostrar su error.</div>
          ) : (
            <div className="grafico-linea-contenedor">
              <svg viewBox={`0 0 800 ${altoGrafica}`} className="grafico-linea" style={{ height: `${altoGrafica}px` }}>
                <defs>
                  <clipPath id="recorte-error">
                    <rect x="63" y="43" width="694" height={altoGrafica - 86} />
                  </clipPath>
                </defs>
                {[40, 100, 160, 220].map((y) => (
                  <line key={y} x1="60" y1={transformarY(y)} x2="760" y2={transformarY(y)} className="linea-grid" />
                ))}
                <line x1="60" y1={baseGrafica} x2="760" y2={baseGrafica} className="linea-eje" />
                <line x1="60" y1="40" x2="60" y2={baseGrafica} className="linea-eje" />
                <g clipPath="url(#recorte-error)">
                  {erroresAbsolutos.length > 1 && (
                    <polyline
                      points={erroresAbsolutos.map((p) => `${coordenadaX(p.termino)},${coordenadaYError(p.error)}`).join(" ")}
                      className="linea-grafico linea-error-absoluto"
                    />
                  )}
                  {erroresAbsolutos.map((p) => (
                  <circle
                    key={p.termino}
                    cx={coordenadaX(p.termino)}
                    cy={coordenadaYError(p.error)}
                    r={puntoSeleccionado?.tipo === "error" && puntoSeleccionado.x === p.termino ? "8" : "5"}
                    className="punto-grafico punto-error-absoluto punto-interactivo"
                    role="button"
                    tabIndex="0"
                    onClick={() => setPuntoSeleccionado({ tipo: "error", x: p.termino, y: p.error })}
                    onKeyDown={(evento) => {
                      if (evento.key === "Enter" || evento.key === " ") {
                        setPuntoSeleccionado({ tipo: "error", x: p.termino, y: p.error });
                      }
                    }}
                  >
                    <title>{`Iteración ${p.termino}: error ${p.error.toPrecision(6)}`}</title>
                  </circle>
                  ))}
                </g>
                <line x1="60" y1={baseGrafica} x2="760" y2={baseGrafica} className="linea-eje linea-eje-frontal" />
                <line x1="60" y1="40" x2="60" y2={baseGrafica} className="linea-eje linea-eje-frontal" />
                <text x="16" y={altoGrafica / 2} textAnchor="middle" transform={`rotate(-90 16 ${altoGrafica / 2})`} className="titulo-eje">Error absoluto</text>
                <text x="52" y="45" textAnchor="end">{maximoErrorAbsoluto.toPrecision(4)}</text>
                <text x="52" y={baseGrafica} textAnchor="end">
                  {usarEscalaLogaritmica ? minimoErrorPositivo.toExponential(1) : "0"}
                </text>
                <text x="60" y={altoGrafica - 18} textAnchor="middle">{minimoN}</text>
                <text x="760" y={altoGrafica - 18} textAnchor="middle">{maximoN}</text>
              </svg>
              <div className="etiqueta-eje-x">Iteración</div>
              {puntoSeleccionado?.tipo === "error" && (
                <div className="coordenadas-punto">
                  <span>Punto seleccionado</span>
                  <strong>x = {puntoSeleccionado.x}</strong>
                  <strong>y = {puntoSeleccionado.y.toExponential(8)}</strong>
                </div>
              )}
            </div>
          )}
        </section>

        <section className="dashboard-tabla-card tabla-iteraciones-card">
          <div className="grafico-header tabla-iteraciones-header">
            <div>
              <h3>Resultados por iteración</h3>
              <p>
                {datosSerieGrafica.nombre} · x={calculoGrafica?.x ?? "—"} · {resultadosIteraciones.length} términos
              </p>
            </div>
            {resultadosIteraciones.length > 0 && (
              <span>
                Filas {(paginaIteracionesSegura - 1) * filasPorPagina + 1}–
                {Math.min(paginaIteracionesSegura * filasPorPagina, resultadosIteraciones.length)}
              </span>
            )}
          </div>

          {resultadosIteraciones.length === 0 ? (
            <div className="sin-datos">Selecciona un cálculo para ver sus iteraciones.</div>
          ) : (
            <>
              <div className="dashboard-tabla-contenedor tabla-iteraciones-scroll">
                <table className="dashboard-tabla tabla-iteraciones">
                  <thead>
                    <tr>
                      <th>Iteración</th>
                      <th>Aporte del término</th>
                      <th>Valor calculado</th>
                      <th>Error absoluto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {iteracionesPagina.map((fila) => (
                      <tr
                        key={fila.iteracion}
                        className={fila.iteracion === mejorIteracion?.iteracion ? "iteracion-mas-precisa" : ""}
                      >
                        <td>
                          <strong>{fila.iteracion}</strong>
                          {fila.iteracion === mejorIteracion?.iteracion && (
                            <span className="badge-mas-preciso">✓ Más preciso</span>
                          )}
                        </td>
                        <td className={fila.aporte >= 0 ? "valor-positivo" : "valor-negativo"}>
                          {fila.aporte.toExponential(8)}
                        </td>
                        <td>{fila.valor.toPrecision(12)}</td>
                        <td>{fila.error.toExponential(8)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="paginacion-iteraciones">
                <button
                  type="button"
                  disabled={paginaIteracionesSegura === 1}
                  onClick={() => setPaginaIteraciones((pagina) => Math.max(1, pagina - 1))}
                >
                  ← Anterior
                </button>
                <span>Página {paginaIteracionesSegura} de {totalPaginasIteraciones}</span>
                <button
                  type="button"
                  disabled={paginaIteracionesSegura === totalPaginasIteraciones}
                  onClick={() => setPaginaIteraciones((pagina) => Math.min(totalPaginasIteraciones, pagina + 1))}
                >
                  Siguiente →
                </button>
              </div>
            </>
          )}
        </section>

      </main>
    </div>
  );
}

export default Dashboard;

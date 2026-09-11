import "./Inicio.css";
import MenuCuenta from "../componentes/MenuCuenta.jsx";

function Inicio({ usuario, irA, cerrarSesion }) {
  return (
    <div className="inicio-container">

      {/* BARRA LATERAL */}
      <aside className="sidebar">

        <div className="sidebar-brand">
          <span>∑</span>
          <strong>SeriesLab</strong>
        </div>

        <div className="sidebar-section">
          <span className="sidebar-title">PRINCIPAL</span>

          <button
            className="sidebar-item active"
            onClick={() => irA("inicio")}
          >
            <span>⌂</span>
            Inicio
          </button>

          <button
            className="sidebar-item"
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


      {/* CONTENIDO PRINCIPAL */}
      <main className="inicio-main">

        {/* HEADER */}
        <header className="inicio-header">

          <div className="breadcrumb">
            SERIESLAB <span>/</span> INICIO
          </div>

          <MenuCuenta usuario={usuario} cerrarSesion={cerrarSesion} variante="inicio" />

        </header>


        {/* HERO */}
        <section className="inicio-hero">

          <div className="hero-content">

            <span className="hero-eyebrow">
              LABORATORIO MATEMÁTICO
            </span>

            <h1>
              Hola, {usuario?.nombre || "Ana"}.
              <br />
              <em>Hagamos matemáticas.</em>
            </h1>

            <p>
              Calcula, compara y analiza el comportamiento
              de diferentes series matemáticas desde un solo lugar.
            </p>

            <button
              className="hero-button"
              onClick={() => irA("calcular")}
            >
              Comenzar cálculo
              <span>→</span>
            </button>

          </div>


          {/* DECORACIÓN MATEMÁTICA */}
          <div className="hero-decoration">

            <div className="formula">
              Σ
            </div>

            <div className="formula-small">
              n → ∞
            </div>

            <div className="circle-decoration"></div>

          </div>

        </section>


        {/* HERRAMIENTAS */}
        <section className="tools-section">

          <div className="section-heading">
            <span>EXPLORA</span>
            <h2>Tus herramientas</h2>
          </div>


          <div className="tools-grid">

            <button
              className="tool-card"
              onClick={() => irA("calcular")}
            >
              <div className="tool-icon">
                ∑
              </div>

              <div>
                <h3>Calculadora</h3>
                <p>
                  Analiza tus series matemáticas.
                </p>
              </div>

              <span className="tool-arrow">→</span>
            </button>


            <button
              className="tool-card"
              onClick={() => irA("dashboard")}
            >
              <div className="tool-icon">
                ◫
              </div>

              <div>
                <h3>Dashboard</h3>
                <p>
                  Visualiza tus estadísticas.
                </p>
              </div>

              <span className="tool-arrow">→</span>
            </button>


            <button
              className="tool-card"
              onClick={() => irA("historial")}
            >
              <div className="tool-icon">
                ◷
              </div>

              <div>
                <h3>Historial</h3>
                <p>
                  Revisa tus cálculos anteriores.
                </p>
              </div>

              <span className="tool-arrow">→</span>
            </button>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Inicio;

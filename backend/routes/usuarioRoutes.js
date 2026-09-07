import { useState } from "react";
import "./App.css";

function App() {
  const [pagina, setPagina] = useState("login");

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");

  const [usuarioActual, setUsuarioActual] = useState(null);

  // ==========================
  // REGISTRO
  // ==========================
  const registrarUsuario = async (e) => {
    e.preventDefault();

    if (password !== confirmarPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      const respuesta = await fetch(
        "http://localhost:3030/api/usuarios",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            usuario_id: "USR" + Date.now(),
            nombre,
            email,
            password
          })
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        alert(datos.mensaje);
        return;
      }

      alert("Cuenta creada correctamente ✨");

      setNombre("");
      setEmail("");
      setPassword("");
      setConfirmarPassword("");

      setPagina("login");

    } catch (error) {
      console.error(error);
      alert("No se pudo conectar con el servidor");
    }
  };


  // ==========================
  // LOGIN
  // ==========================
  const iniciarSesion = async (e) => {
    e.preventDefault();

    try {
      const respuesta = await fetch(
        "http://localhost:3030/api/usuarios/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            password
          })
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        alert(datos.mensaje);
        return;
      }

      setUsuarioActual(datos.usuario);
      setPagina("inicio");

      setPassword("");

    } catch (error) {
      console.error(error);
      alert("No se pudo conectar con el servidor");
    }
  };


  // ==========================
  // LOGIN
  // ==========================
  if (pagina === "login") {
    return (
      <div className="auth-container">

        <div className="auth-decoration">
          <div className="math-symbol">∑</div>
          <div className="floating-symbol">π</div>
          <div className="floating-symbol second">∞</div>

          <div className="auth-brand">
            <span>∑</span>
            <strong>SeriesLab</strong>
          </div>

          <p>
            Explora el comportamiento de las
            series matemáticas.
          </p>
        </div>

        <div className="auth-form-container">

          <div className="auth-form">

            <span className="small-label">
              SERIESLAB
            </span>

            <h1>Bienvenida de nuevo</h1>

            <p className="auth-subtitle">
              Inicia sesión para continuar con tus análisis.
            </p>

            <form onSubmit={iniciarSesion}>

              <div className="input-group">
                <label>Correo electrónico</label>

                <input
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label>Contraseña</label>

                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button className="primary-button" type="submit">
                Iniciar sesión
                <span>→</span>
              </button>

            </form>

            <div className="auth-switch">
              ¿Aún no tienes una cuenta?
              <button onClick={() => setPagina("registro")}>
                Crear cuenta
              </button>
            </div>

          </div>

        </div>

      </div>
    );
  }


  // ==========================
  // REGISTRO
  // ==========================
  if (pagina === "registro") {
    return (
      <div className="auth-container">

        <div className="auth-decoration">

          <div className="math-symbol">∫</div>

          <div className="floating-symbol">
            √
          </div>

          <div className="floating-symbol second">
            π
          </div>

          <div className="auth-brand">
            <span>∑</span>
            <strong>SeriesLab</strong>
          </div>

          <p>
            Convierte números en información
            y precisión en conocimiento.
          </p>

        </div>


        <div className="auth-form-container">

          <div className="auth-form">

            <span className="small-label">
              SERIESLAB
            </span>

            <h1>Crear cuenta</h1>

            <p className="auth-subtitle">
              Comienza a explorar tus series matemáticas.
            </p>

            <form onSubmit={registrarUsuario}>

              <div className="input-group">
                <label>Nombre</label>

                <input
                  type="text"
                  placeholder="Tu nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label>Correo electrónico</label>

                <input
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label>Contraseña</label>

                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label>Confirmar contraseña</label>

                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmarPassword}
                  onChange={(e) =>
                    setConfirmarPassword(e.target.value)
                  }
                  required
                />
              </div>

              <button className="primary-button" type="submit">
                Crear mi cuenta
                <span>→</span>
              </button>

            </form>

            <div className="auth-switch">
              ¿Ya tienes una cuenta?

              <button onClick={() => setPagina("login")}>
                Iniciar sesión
              </button>
            </div>

          </div>

        </div>

      </div>
    );
  }


  // ==========================
  // APLICACIÓN
  // ==========================
  return (
    <div className="app-container">

      <aside className="sidebar">

        <div className="logo">
          <span>∑</span>
          <div>
            <strong>SeriesLab</strong>
            <small>MATHEMATICAL LAB</small>
          </div>
        </div>


        <nav>

          <p className="menu-title">
            PRINCIPAL
          </p>

          <button
            className={pagina === "inicio" ? "menu-item active" : "menu-item"}
            onClick={() => setPagina("inicio")}
          >
            <span>⌂</span>
            Inicio
          </button>

          <button
            className="menu-item"
            onClick={() => setPagina("calcular")}
          >
            <span>∑</span>
            Calcular
          </button>

          <button
            className="menu-item"
            onClick={() => setPagina("dashboard")}
          >
            <span>◫</span>
            Dashboard
          </button>

          <button
            className="menu-item"
            onClick={() => setPagina("historial")}
          >
            <span>◷</span>
            Historial
          </button>


          <p className="menu-title">
            GESTIÓN
          </p>

          <button
            className="menu-item"
            onClick={() => setPagina("usuarios")}
          >
            <span>♙</span>
            Usuarios
          </button>

          <button
            className="menu-item"
            onClick={() => setPagina("ajustes")}
          >
            <span>⚙</span>
            Ajustes
          </button>

        </nav>


        <div className="sidebar-bottom">

          <div className="profile-mini">
            <div className="avatar">
              {usuarioActual?.nombre?.charAt(0) || "U"}
            </div>

            <div>
              <strong>
                {usuarioActual?.nombre || "Usuario"}
              </strong>

              <small>
                Analista
              </small>
            </div>
          </div>

          <button
            className="logout"
            onClick={() => {
              setUsuarioActual(null);
              setEmail("");
              setPassword("");
              setPagina("login");
            }}
          >
            ↪ Cerrar sesión
          </button>

        </div>

      </aside>


      <main className="main-content">

        <header className="topbar">

          <div>
            <span className="breadcrumb">
              SERIESLAB / {pagina.toUpperCase()}
            </span>
          </div>

          <div className="top-user">

            <div className="notification">
              ♡
            </div>

            <div className="top-avatar">
              {usuarioActual?.nombre?.charAt(0) || "U"}
            </div>

            <span>
              {usuarioActual?.nombre || "Usuario"}
            </span>

          </div>

        </header>


        {pagina === "inicio" && (
          <section className="home-page">

            <div className="welcome-card">

              <div className="welcome-text">

                <span className="eyebrow">
                  LABORATORIO MATEMÁTICO
                </span>

                <h1>
                  Hola, {usuarioActual?.nombre?.split(" ")[0] || "bienvenida"}.
                  <br />
                  <em>Hagamos matemáticas.</em>
                </h1>

                <p>
                  Calcula, compara y analiza aproximaciones
                  mediante series matemáticas.
                </p>

                <button
                  className="primary-button"
                  onClick={() => setPagina("calcular")}
                >
                  Comenzar cálculo
                  <span>→</span>
                </button>

              </div>

              <div className="formula-decoration">
                <span>f(x)</span>
                <strong>∑</strong>
                <span>n → ∞</span>
              </div>

            </div>


            <div className="section-heading">

              <div>
                <span>EXPLORA</span>
                <h2>Tus herramientas</h2>
              </div>

              <p>
                Todo lo que necesitas para analizar
                tus series.
              </p>

            </div>


            <div className="feature-grid">

              <div
                className="feature-card"
                onClick={() => setPagina("calcular")}
              >
                <div className="feature-icon">
                  ∑
                </div>

                <h3>
                  Calculadora
                </h3>

                <p>
                  Obtén aproximaciones usando
                  diferentes series de Taylor.
                </p>

                <span className="card-link">
                  Realizar cálculo →
                </span>
              </div>


              <div
                className="feature-card"
                onClick={() => setPagina("dashboard")}
              >
                <div className="feature-icon">
                  ◫
                </div>

                <h3>
                  Dashboard
                </h3>

                <p>
                  Visualiza el comportamiento de tus
                  resultados y errores.
                </p>

                <span className="card-link">
                  Ver estadísticas →
                </span>
              </div>


              <div
                className="feature-card"
                onClick={() => setPagina("historial")}
              >
                <div className="feature-icon">
                  ◷
                </div>

                <h3>
                  Historial
                </h3>

                <p>
                  Consulta todos tus cálculos
                  realizados anteriormente.
                </p>

                <span className="card-link">
                  Ver historial →
                </span>
              </div>

            </div>

          </section>
        )}


        {pagina !== "inicio" && (
          <section className="placeholder-page">

            <span className="eyebrow">
              SERIESLAB
            </span>

            <h1>
              {pagina === "calcular" && "Calculadora"}
              {pagina === "dashboard" && "Dashboard"}
              {pagina === "historial" && "Historial"}
              {pagina === "usuarios" && "Usuarios"}
              {pagina === "ajustes" && "Ajustes"}
            </h1>

            <p>
              Esta sección la construiremos a continuación. ✨
            </p>

          </section>
        )}

      </main>

    </div>
  );
}

export default App;
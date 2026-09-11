import { useState } from "react";
import "./App.css";
import Inicio from "../paginas/Inicio.jsx";
import Calcular from "../paginas/Calcular.jsx";
import Historial from "../paginas/Historial.jsx";
import Dashboard from "../paginas/Dashboard.jsx";

function App() {
  const usuarioGuardado = (() => {
    try {
      return JSON.parse(localStorage.getItem("serieslab_usuario"));
    } catch {
      return null;
    }
  })();
  const [pagina, setPagina] = useState(usuarioGuardado ? "inicio" : "login");
  const [usuario, setUsuario] = useState(usuarioGuardado);
  const [calculoSeleccionadoId, setCalculoSeleccionadoId] = useState("");

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");

  const registrarUsuario = async (e) => {
    e.preventDefault();

    if (password !== confirmarPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      const respuesta = await fetch(
        "/api/usuarios",
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

      alert("Registro exitoso");

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

  const iniciarSesion = async (e) => {
    e.preventDefault();

    try {
      const respuesta = await fetch(
        "/api/usuarios/login",
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

      alert(`Bienvenida ${datos.usuario.nombre}`);
      setUsuario(datos.usuario);
      localStorage.setItem("serieslab_usuario", JSON.stringify(datos.usuario));
      setPagina("inicio");

      console.log("Usuario:", datos.usuario);

    } catch (error) {
      console.error(error);
      alert("No se pudo conectar con el servidor");
    }
  };

  const irA = (paginaDestino) => {
    if (paginaDestino === "dashboard") setCalculoSeleccionadoId("");
    setPagina(paginaDestino);
  };

  const analizarCalculo = (calculoId) => {
    setCalculoSeleccionadoId(calculoId);
    setPagina("dashboard");
  };

  const cerrarSesion = () => {
    localStorage.removeItem("serieslab_usuario");
    setUsuario(null);
    setCalculoSeleccionadoId("");
    setEmail("");
    setPassword("");
    setPagina("login");
  };

  return (
    <div>

      {pagina === "inicio" && (
  <Inicio
    usuario={usuario}
    irA={irA}
    cerrarSesion={cerrarSesion}
  />
)}
{pagina === "calcular" && (
  <Calcular
  usuario={usuario}
  irA={irA}
  cerrarSesion={cerrarSesion}
/>
)}
{pagina === "historial" && (
  <Historial usuario={usuario} irA={irA} analizarCalculo={analizarCalculo} cerrarSesion={cerrarSesion} />
)}
{pagina === "dashboard" && (
  <Dashboard usuario={usuario} irA={irA} calculoInicialId={calculoSeleccionadoId} cerrarSesion={cerrarSesion} />
)}

      {pagina === "login" && (
        <div className="auth-container">

          <div className="auth-decoration">

            <div className="auth-brand">
              <span>∑</span>
              <strong>SeriesLab</strong>
            </div>

            <p>
              Explora, analiza y comprende el fascinante
              mundo de las series matemáticas.
            </p>

            <div className="math-symbol">
              ∫
            </div>

            <div className="floating-symbol">
              π
            </div>

            <div className="floating-symbol second">
              ∞
            </div>

          </div>

          <div className="auth-form-container">

            <div className="auth-form">

              <span className="small-label">
                LABORATORIO MATEMÁTICO
              </span>

              <h1>
                Bienvenida de nuevo
              </h1>

              <p className="auth-subtitle">
                Inicia sesión para acceder a tu laboratorio
                de series matemáticas.
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

                <button
                  type="submit"
                  className="primary-button"
                >
                  Iniciar sesión
                  <span>→</span>
                </button>

              </form>

              <div className="auth-switch">
                ¿No tienes una cuenta?

                <button
                  type="button"
                  onClick={() => setPagina("registro")}
                >
                  Crear cuenta
                </button>
              </div>

            </div>

          </div>

        </div>
      )}

      {pagina === "registro" && (
        <div className="auth-container">

          <div className="auth-decoration">

            <div className="auth-brand">
              <span>∑</span>
              <strong>SeriesLab</strong>
            </div>

            <p>
              Crea tu cuenta para comenzar a analizar
              series matemáticas.
            </p>

            <div className="math-symbol">
              Σ
            </div>

            <div className="floating-symbol">
              π
            </div>

            <div className="floating-symbol second">
              ∞
            </div>

          </div>

          <div className="auth-form-container">

            <div className="auth-form">

              <span className="small-label">
                NUEVO PERFIL
              </span>

              <h1>
                Crear cuenta
              </h1>

              <p className="auth-subtitle">
                Crea tu cuenta para comenzar a analizar
                series matemáticas.
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

                <button
                  type="submit"
                  className="primary-button"
                >
                  Registrarme
                  <span>→</span>
                </button>

              </form>

              <div className="auth-switch">
                ¿Ya tienes una cuenta?

                <button
                  type="button"
                  onClick={() => setPagina("login")}
                >
                  Iniciar sesión
                </button>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default App;

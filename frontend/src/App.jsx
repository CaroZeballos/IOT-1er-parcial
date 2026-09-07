import { useState } from "react";
import "./App.css";
import Inicio from "../paginas/Inicio.jsx";
import Calcular from "../paginas/Calcular.jsx";
import Historial from "../paginas/Historial.jsx";
import Dashboard from "../paginas/Dashboard.jsx";

function App() {
  const [pagina, setPagina] = useState("login");
  const [usuario, setUsuario] = useState(null);

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

      alert(`Bienvenida ${datos.usuario.nombre}`);
      setUsuario(datos.usuario);
      setPagina("inicio");

      console.log("Usuario:", datos.usuario);

    } catch (error) {
      console.error(error);
      alert("No se pudo conectar con el servidor");
    }
  };

  const irA = (paginaDestino) => {
  setPagina(paginaDestino);
};

  return (
    <div>

      {pagina === "inicio" && (
  <Inicio
    usuario={usuario}
    irA={irA}
  />
)}
{pagina === "calcular" && (
  <Calcular
  usuario={usuario}
  irA={irA}
/>
)}
{pagina === "historial" && (
  <Historial usuario={usuario} irA={irA} />
)}
{pagina === "dashboard" && (
  <Dashboard usuario={usuario} irA={irA} />
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
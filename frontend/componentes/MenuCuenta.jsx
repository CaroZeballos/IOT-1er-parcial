import { useEffect, useRef, useState } from "react";
import "./MenuCuenta.css";

function MenuCuenta({ usuario, cerrarSesion, variante = "sidebar" }) {
  const [abierto, setAbierto] = useState(false);
  const contenedor = useRef(null);

  useEffect(() => {
    const cerrarAlPulsarFuera = (evento) => {
      if (!contenedor.current?.contains(evento.target)) setAbierto(false);
    };
    document.addEventListener("mousedown", cerrarAlPulsarFuera);
    return () => document.removeEventListener("mousedown", cerrarAlPulsarFuera);
  }, []);

  const nombre = usuario?.nombre || "Usuario";
  const inicial = nombre.charAt(0).toUpperCase();

  return (
    <div className={`menu-cuenta menu-cuenta-${variante}`} ref={contenedor}>
      <button
        type="button"
        className={`account-trigger ${variante === "sidebar" ? "user-mini" : variante === "inicio" ? "header-user" : "dashboard-usuario"}`}
        onClick={() => setAbierto((estado) => !estado)}
        aria-expanded={abierto}
      >
        {variante === "inicio" && <span>♡</span>}
        <div className={variante === "inicio" ? "header-avatar" : variante === "sidebar" ? "user-avatar" : "cuenta-avatar"}>
          {inicial}
        </div>
        {variante === "sidebar" ? (
          <div>
            <strong>{nombre}</strong>
            <small>Mi cuenta</small>
          </div>
        ) : variante === "dashboard" ? (
          <div>
            <span>Usuario</span>
            <strong>{nombre}</strong>
          </div>
        ) : (
          <strong>{nombre}</strong>
        )}
      </button>

      {abierto && (
        <div className="cuenta-desplegable">
          <span>SESIÓN ACTIVA</span>
          <strong>{nombre}</strong>
          <small>{usuario?.email || "Cuenta de SeriesLab"}</small>
          <button type="button" onClick={cerrarSesion}>
            Cerrar sesión <b>→</b>
          </button>
        </div>
      )}
    </div>
  );
}

export default MenuCuenta;

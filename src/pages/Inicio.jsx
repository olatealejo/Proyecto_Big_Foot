import { Link } from "react-router-dom";
import { UserRound, ShoppingCart, Search } from "lucide-react";
import logo from "../assets/Logo_Web.jpeg";
import Footer from "../components/Footer";
import "./Inicio.css";

function Inicio() {
  return (
    <div className="inicio">
      <nav className="navbar">
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="Logo The Big Foot" />
        </Link>

        <div className="navbar-menu">
          <Link to="/catalogo">Modelos</Link>
          <Link to="/personalizar">Personalizar</Link>
          <Link to="/comunidad">Comunidad</Link>
          <Link to="/contacto">Contacto</Link>
        </div>

        <div className="navbar-iconos">
          <Link to="/login" aria-label="Iniciar sesión">
            <UserRound />
          </Link>

          <Link to="/carrito" aria-label="Carrito">
            <ShoppingCart />
          </Link>

          <button type="button" aria-label="Buscar">
            <Search />
          </button>
        </div>
      </nav>

      <main className="contenido-inicio">
        {/* Aquí irá el contenido principal de la página */}
      </main>

      <Footer />
    </div>
  );
}

export default Inicio;
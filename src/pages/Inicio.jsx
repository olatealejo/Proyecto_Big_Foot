jsx
import { Link } from "react-router-dom";
import { UserRound, ShoppingCart, Search } from "lucide-react";
import logo from "../assets/Logo_Web.jpeg";
import Publicidad1 from "../assets/Publicidad1.jpeg";
import Publicidad2 from "../assets/Publicidad2.png";
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
          <Link to="/productos">Modelos</Link>
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

        <section className="publicidades">
          <Link to="/productos" className="publicidad">
            <img
              src={Publicidad1.jpeg}
              alt="Publicidad de zapatillas de básquet"
            />
          </Link>

          <Link to="/productos" className="publicidad">
            <img
              src={Publicidad2.png}
              alt="Segunda publicidad de The Big Foot"
            />
          </Link>
        </section>

      </main>

      <Footer />
    </div>
  );
}

export default Inicio;
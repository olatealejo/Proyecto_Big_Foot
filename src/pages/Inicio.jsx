import { Link } from "react-router-dom";
import { ArrowRight, Search, ShoppingCart, UserRound } from "lucide-react";

import logo from "../assets/Logo_Web.jpeg";
import publicidad1 from "../assets/Publicidad1.jpeg";
import publicidad2 from "../assets/Publicidad2.png";
import Footer from "../components/Footer";
import "./Inicio.css";

function Inicio() {
  return (
    <div className="inicio">
      <nav className="navbar" aria-label="Navegación principal">
        <Link to="/" className="navbar-logo" aria-label="Ir al inicio">
          <img src={logo} alt="The Big Foot" />
        </Link>

        <div className="navbar-menu">
          <Link to="/productos">Modelos</Link>
          <Link to="/personalizar">Personalizar</Link>
          <Link to="/comunidad">Comunidad</Link>
        </div>

        <div className="navbar-iconos">
          <Link to="/login" aria-label="Iniciar sesión">
            <UserRound />
          </Link>

          <Link to="/carrito" aria-label="Ver carrito">
            <ShoppingCart />
          </Link>

          <Link to="/productos" aria-label="Buscar productos">
            <Search />
          </Link>
        </div>
      </nav>

      <main className="contenido-inicio">
        <section className="inicio-hero">
          <p className="inicio-etiqueta">The Big Foot Store</p>

          <h1>
            Tu próxima pisada
            <span> empieza acá.</span>
          </h1>

          <p className="inicio-descripcion">
            Modelos con identidad propia, pensados para quienes no siguen el
            camino: lo marcan.
          </p>

          <div className="inicio-acciones">
            <Link
              to="/productos"
              className="inicio-boton inicio-boton-principal"
            >
              Ver modelos
              <ArrowRight size={19} />
            </Link>
          </div>
        </section>

        <section className="publicidades" aria-label="Colecciones destacadas">
          <Link
            to="/productos"
            className="publicidad publicidad-principal"
          >
            <img
              src={publicidad1}
              alt="Colección de zapatillas de básquet The Big Foot"
            />

            <div className="publicidad-capa">
              <p>Nueva colección</p>
              <h2>Diseñadas para destacar</h2>

              <span>
                Ver colección
                <ArrowRight size={18} />
              </span>
            </div>
          </Link>

          <Link
            to="/productos"
            className="publicidad publicidad-secundaria"
          >
            <img
              src={publicidad2}
              alt="Colección urbana de The Big Foot"
              loading="lazy"
            />

            <div className="publicidad-capa">
              <p>Estilo urbano</p>
              <h2>Marcá tu propio camino</h2>

              <span>
                Descubrir
                <ArrowRight size={18} />
              </span>
            </div>
          </Link>
        </section>

        <section className="inicio-valores" aria-label="Características">
          <article>
            <span>01</span>
            <div>
              <h3>Identidad propia</h3>
              <p>Diseños creados para salir de lo común.</p>
            </div>
          </article>

          <article>
            <span>02</span>
            <div>
              <h3>Calidad y detalle</h3>
              <p>Cada modelo combina presencia y comodidad.</p>
            </div>
          </article>

          <article>
            <span>03</span>
            <div>
              <h3>Comunidad Big Foot</h3>
              <p>Un espacio para compartir estilos e inspiración.</p>
            </div>
          </article>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Inicio;

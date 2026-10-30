import { Link } from "react-router-dom";
import { ArrowRight, Search, ShoppingCart, UserRound } from "lucide-react";

import logo from "../assets/Logo_Web.jpeg";
import publicidad1 from "../assets/Publicidad1.jpeg";
import publicidad2 from "../assets/Publicidad2.png";
import zapatillaHero from "../assets/The-Big-Foot-ChorizoParmezano1.jpeg";
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
          <div className="inicio-copy">
            <p className="inicio-etiqueta">Zapatillas de básquet</p>

            <h1>
              Dominá la cancha
              <span> con cada pisada.</span>
            </h1>

            <p className="inicio-descripcion">
              High-tops con identidad Big Foot: agarre para el primer paso,
              amortiguación para el salto y un look que se ve desde la última
              fila.
            </p>

            <div className="inicio-acciones">
              <Link
                to="/productos"
                className="inicio-boton inicio-boton-principal"
              >
                Ver modelos
                <ArrowRight size={19} />
              </Link>

              <Link
                to="/productos"
                className="inicio-boton inicio-boton-secundario"
              >
                Colección de cancha
              </Link>
            </div>

            <ul className="inicio-stats" aria-label="Características de juego">
              <li>
                <strong>Agarre</strong>
                <span>Pivote y corte</span>
              </li>
              <li>
                <strong>Soporte</strong>
                <span>Caña alta</span>
              </li>
              <li>
                <strong>Impacto</strong>
                <span>Aterrizaje suave</span>
              </li>
            </ul>
          </div>

          <figure className="inicio-hero-visual">
            <div className="inicio-hero-disco" aria-hidden="true" />
            <img
              src={zapatillaHero}
              alt="Zapatilla de básquet The Big Foot Chorizo Parmesano"
            />
            <figcaption>
              <p>Modelo destacado</p>
              <h2>Chorizo Parmesano</h2>
              <Link to="/productos">
                Ver producto
                <ArrowRight size={16} />
              </Link>
            </figcaption>
          </figure>
        </section>

        <section className="publicidades" aria-label="Colecciones destacadas">
          <Link to="/productos" className="publicidad publicidad-principal">
            <img
              src={publicidad1}
              alt="Colección de zapatillas de básquet The Big Foot"
            />

            <div className="publicidad-capa">
              <p>Nueva colección</p>
              <h2>Hechas para el juego</h2>

              <span>
                Ver colección
                <ArrowRight size={18} />
              </span>
            </div>
          </Link>

          <Link to="/productos" className="publicidad publicidad-secundaria">
            <img
              src={publicidad2}
              alt="Línea de cancha The Big Foot"
              loading="lazy"
            />

            <div className="publicidad-capa">
              <p>De la cancha a la calle</p>
              <h2>Marcá tu territorio</h2>

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
              <h3>Agarre de cancha</h3>
              <p>Suela pensada para cortes, paradas y el primer paso.</p>
            </div>
          </article>

          <article>
            <span>02</span>
            <div>
              <h3>Salto y aterrizaje</h3>
              <p>Amortiguación para el impacto y soporte en cada jugada.</p>
            </div>
          </article>

          <article>
            <span>03</span>
            <div>
              <h3>Identidad Big Foot</h3>
              <p>Diseños con carácter, para destacar dentro y fuera.</p>
            </div>
          </article>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Inicio;

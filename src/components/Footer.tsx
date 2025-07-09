import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-1">
            <h3 className="text-xl font-bold mb-4">ECommerce</h3>
            <p className="text-gray-300 mb-4">
              Tu tienda de confianza para productos de alta calidad a precios increíbles.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <span className="text-2xl">📘</span>
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <span className="text-2xl">🐦</span>
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <span className="text-2xl">📷</span>
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <span className="text-2xl">💼</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-300 hover:text-white">
                  Productos
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-white">
                  Servicios
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white">
                  Nosotros
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-white">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Atención al Cliente</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white">
                  Contacto
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Soporte
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Devoluciones
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Seguimiento
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-300 mb-4">
              Suscríbete para recibir ofertas exclusivas
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Tu email"
                className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button className="bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-r-lg transition-colors">
                Suscribir
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">
              © 2024 ECommerce. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-300 hover:text-white text-sm">
                Política de Privacidad
              </a>
              <a href="#" className="text-gray-300 hover:text-white text-sm">
                Términos de Uso
              </a>
              <a href="#" className="text-gray-300 hover:text-white text-sm">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React from 'react';

const Blog: React.FC = () => {
  const blogPosts = [
    {
      id: 1,
      title: "10 Tendencias de Tecnología para 2025",
      excerpt: "Descubre las últimas tendencias tecnológicas que están transformando el mundo del e-commerce y la experiencia del usuario.",
      date: "15 de Diciembre, 2024",
      author: "María García",
      category: "Tecnología",
      readTime: "5 min",
      image: "📱"
    },
    {
      id: 2,
      title: "Guía de Compras Navideñas",
      excerpt: "Los mejores consejos para hacer compras inteligentes durante la temporada navideña y encontrar ofertas increíbles.",
      date: "10 de Diciembre, 2024",
      author: "Carlos López",
      category: "Compras",
      readTime: "8 min",
      image: "🎄"
    },
    {
      id: 3,
      title: "Cómo Elegir el Mejor Smartphone",
      excerpt: "Una guía completa para seleccionar el smartphone perfecto según tus necesidades y presupuesto.",
      date: "5 de Diciembre, 2024",
      author: "Ana Martínez",
      category: "Tecnología",
      readTime: "6 min",
      image: "📱"
    },
    {
      id: 4,
      title: "Decoración de Hogar: Tendencias 2025",
      excerpt: "Las últimas tendencias en decoración que están marcando el estilo de los hogares modernos.",
      date: "1 de Diciembre, 2024",
      author: "Luis Rodríguez",
      category: "Hogar",
      readTime: "7 min",
      image: "🏠"
    },
    {
      id: 5,
      title: "Sostenibilidad en el E-commerce",
      excerpt: "Cómo las empresas están adoptando prácticas sostenibles y cómo puedes ser parte del cambio.",
      date: "25 de Noviembre, 2024",
      author: "Elena Sánchez",
      category: "Sostenibilidad",
      readTime: "4 min",
      image: "🌱"
    },
    {
      id: 6,
      title: "Seguridad en Compras Online",
      excerpt: "Consejos esenciales para proteger tus datos y realizar compras seguras en línea.",
      date: "20 de Noviembre, 2024",
      author: "David Morales",
      category: "Seguridad",
      readTime: "5 min",
      image: "🔒"
    }
  ];

  const categories = ["Todos", "Tecnología", "Compras", "Hogar", "Sostenibilidad", "Seguridad"];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Blog</h1>
          <p className="text-gray-600 mt-2">Pagina de relleno para que se vea mas completo</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Featured Post */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white rounded-lg p-8 mb-12">
          <div className="max-w-3xl">
            <div className="text-6xl mb-4">🚀</div>
            <span className="bg-white bg-opacity-20 text-white px-3 py-1 rounded-full text-sm">
              Destacado
            </span>
            <h2 className="text-3xl font-bold mt-4 mb-4">
              El Futuro es hoy
            </h2>
            <p className="text-xl opacity-90 mb-6">
              Explora las tecnologías emergentes que están revolucionando la forma en que compramos 
              y vendemos en línea, desde la inteligencia artificial hasta la realidad aumentada.
            </p>
            <div className="flex items-center space-x-4 mb-6">
              <span>Por María García</span>
              <span>•</span>
              <span>20 de Diciembre, 2024</span>
              <span>•</span>
              <span>10 min de lectura</span>
            </div>
            <button className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Leer Artículo
            </button>
          </div>
        </div>

        {/* Categories Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                className="px-4 py-2 rounded-full text-sm font-medium transition-colors bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                <div className="text-6xl">{post.image}</div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-primary-100 text-primary-600 px-2 py-1 rounded text-xs font-medium">
                    {post.category}
                  </span>
                  <span className="text-gray-500 text-sm">{post.readTime}</span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-primary-600 cursor-pointer">
                  {post.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm">👤</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{post.author}</p>
                      <p className="text-xs text-gray-500">{post.date}</p>
                    </div>
                  </div>
                  
                  <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    Leer más →
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;

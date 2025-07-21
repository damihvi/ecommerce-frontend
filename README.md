# 🛒 E-commerce Frontend

Frontend moderno para plataforma de e-commerce desarrollado con **React 18**, **TypeScript** y **Tailwind CSS**.

## 🚀 Características Principales

### 🎯 **Funcionalidades Core**
- **Vista Pública**: Catálogo de productos, navegación por categorías, información corporativa
- **Panel de Administración**: CRUD completo para productos, categorías y usuarios
- **Autenticación**: Login/Register con JWT y manejo de roles
- **Carrito de Compras**: Gestión de productos seleccionados
- **Carga de Imágenes**: Sistema de upload con preview y fallback
- **Diseño Responsivo**: Adaptable a desktop, tablet y móvil

### 🏗️ **Arquitectura Técnica**
- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Estado Global**: Context API + React Query para cache
- **Routing**: React Router v6 con rutas protegidas
- **Forms**: React Hook Form con validación
- **UI**: Componentes reutilizables con diseño consistente

## 🌐 Demo en Vivo

- **🔗 Frontend**: [https://ecommerce-frontend-damihvi.vercel.app](https://ecommerce-frontend-damihvi.vercel.app)
- **🔗 Backend API**: [https://damihvi.onrender.com/api](https://damihvi.onrender.com/api)

### 👤 Credenciales de Prueba
```bash
# Administrador
Email: admin@ecommerce.com
Password: admin123
```

## 🚦 Instalación y Uso

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Backend funcionando

### 1️⃣ Clonar e Instalar
```bash
git clone https://github.com/damihvi/ecommerce-frontend.git
cd ecommerce-frontend
npm install
```

### 2️⃣ Configuración de Environment
```bash
# Crear archivo .env
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_UPLOAD_URL=http://localhost:3000/api/upload
```

### 3️⃣ Ejecutar Scripts Disponibles
```bash
npm start          # Desarrollo local (http://localhost:3000)
npm run build      # Build producción
npm test           # Tests unitarios  
npm run eject      # Eject configuración (no recomendado)
```

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── ProductsList.jsx    # CRUD de productos
│   ├── CategoriesList.tsx  # CRUD de categorías  
│   ├── UsersList.tsx       # CRUD de usuarios
│   ├── ImageUpload.tsx     # Componente de carga
│   └── Navigation.tsx      # Navegación principal
├── pages/              # Páginas principales
│   ├── Home.tsx           # Página de inicio
│   ├── Products.tsx       # Catálogo público
│   ├── AdminDashboard.tsx # Panel administrador
│   ├── Login.tsx          # Autenticación
│   └── Register.tsx       # Registro usuarios
├── context/            # Estado global
│   ├── AuthContext.tsx    # Contexto autenticación
│   └── CartContext.tsx    # Contexto carrito
├── services/           # Servicios API
│   ├── api.ts            # Cliente HTTP base
│   └── auth.ts           # Servicios auth
└── types/              # Definiciones TypeScript
    └── auth.ts           # Tipos autenticación
```

## 🎯 Funcionalidades por Rol

### 👥 **Usuario Público**
- ✅ Ver catálogo de productos
- ✅ Filtrar por categorías
- ✅ Ver detalles de productos
- ✅ Agregar al carrito
- ✅ Registro y login

### 🔐 **Administrador**
- ✅ **Productos**: Crear, editar, eliminar, toggle activo/inactivo
- ✅ **Categorías**: CRUD completo con gestión de estado
- ✅ **Usuarios**: Visualizar y gestionar usuarios registrados
- ✅ **Imágenes**: Upload con preview y gestión de archivos
- ✅ **Dashboard**: Panel centralizado de administración

## 🔧 Tecnologías Utilizadas

| Categoría | Tecnología | Propósito |
|-----------|------------|-----------|
| **Core** | React 18 | Framework principal |
| **Lenguaje** | TypeScript | Tipado estático |
| **Estilos** | Tailwind CSS | Framework CSS utilitario |
| **Routing** | React Router v6 | Navegación SPA |
| **Forms** | React Hook Form | Manejo de formularios |
| **HTTP** | Axios | Cliente HTTP |
| **Estado** | React Query | Cache y sincronización |
| **Deploy** | Vercel | Hosting y CI/CD |

## 🔗 Integración con Backend

### API Endpoints Utilizados
```typescript
// Productos
GET    /api/products           # Listar productos
POST   /api/products           # Crear producto
PUT    /api/products/:id       # Actualizar producto
DELETE /api/products/:id       # Eliminar producto

// Categorías  
GET    /api/categories         # Listar categorías
POST   /api/categories         # Crear categoría
PUT    /api/categories/:id     # Actualizar categoría

// Usuarios
GET    /api/users              # Listar usuarios (admin)
POST   /api/auth/register      # Registro
POST   /api/auth/login         # Login
```

### Manejo de Estados
- ✅ **Loading**: Spinners y skeleton loaders
- ✅ **Success**: Notificaciones toast
- ✅ **Error**: Mensajes descriptivos y fallbacks
- ✅ **Cache**: React Query para optimización

## 📈 Cumplimiento de Requisitos

✅ **CRUD Completo**: Productos, Categorías, Usuarios  
✅ **Navegación**: Vista pública y panel admin  
✅ **Autenticación**: JWT con rutas protegidas  
✅ **Diseño**: Consistente y responsive  
✅ **Despliegue**: Funcional en Vercel  
✅ **Integración**: Backend PostgreSQL + MongoDB  

---

## 👨‍💻 Desarrollado por

**Damián Hernández**  
Proyecto Final - Desarrollo de Software

⭐ **¡Dale una estrella si te gustó el proyecto!** ⭐

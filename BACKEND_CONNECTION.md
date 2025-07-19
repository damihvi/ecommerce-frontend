# 🔗 Conectar Backend de Render al Frontend

Este documento explica cómo conectar tu backend desplegado en Render con el frontend.

## 📋 Pasos Rápidos

### 1. Configurar la URL del Backend

Reemplaza `https://tu-backend.onrender.com/api` con la URL real de tu backend en Render:

```bash
# Método 1: Usar el script automático
node configure-env.js production https://tu-backend-real.onrender.com/api

# Método 2: Editar manualmente el archivo .env
```

### 2. Verificar la Configuración

```bash
# Instalar dependencias si es necesario
npm install

# Probar la conexión con el backend
npm run test:backend

# Iniciar el frontend
npm start
```

## 🛠️ Configuración Manual

### Archivo `.env`

Edita el archivo `.env` en la raíz del proyecto:

```env
# Backend API Configuration
REACT_APP_API_BASE_URL=https://tu-backend-real.onrender.com/api

# Environment
REACT_APP_ENV=production
```

### Verificar la URL del Backend

La URL de tu backend en Render debería seguir este formato:
- `https://tu-servicio.onrender.com/api`
- Ejemplo: `https://my-ecommerce-backend.onrender.com/api`

## 🔍 Scripts Disponibles

```bash
# Configurar para producción (Render)
npm run configure:render https://tu-backend.onrender.com/api

# Configurar para desarrollo local
npm run configure:dev

# Probar conexión con el backend
npm run test:backend

# Iniciar la aplicación
npm start

# Construir para producción
npm build
```

## 🚀 Deployment en Vercel/Netlify

### Variables de Entorno

En tu plataforma de deployment (Vercel, Netlify, etc.), configura:

```
REACT_APP_API_BASE_URL=https://tu-backend.onrender.com/api
REACT_APP_ENV=production
```

### Vercel

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega `REACT_APP_API_BASE_URL` con el valor de tu backend

### Netlify

1. Ve a tu sitio en Netlify
2. Site settings → Environment variables
3. Agrega `REACT_APP_API_BASE_URL` con el valor de tu backend

## 🔧 Solución de Problemas

### CORS Errors

Si encuentras errores de CORS, verifica que tu backend en Render tenga configurado:

```javascript
// En tu backend NestJS
app.enableCors({
  origin: [
    'http://localhost:3000',
    'https://tu-frontend.vercel.app',
    'https://tu-frontend.netlify.app'
  ],
  credentials: true,
});
```

### Timeout Errors

Si las peticiones son lentas, ajusta el timeout en `src/config/index.ts`:

```typescript
export const config = {
  API_TIMEOUT: 15000, // Aumentar a 15 segundos
  // ...
};
```

### Network Errors

1. Verifica que tu backend esté ejecutándose en Render
2. Comprueba que la URL sea correcta (con `/api` al final)
3. Revisa los logs de Render para errores

## 📱 Testing

### Probar la Conexión

```bash
# Probar todos los endpoints
npm run test:backend

# Probar manualmente en el navegador
curl https://tu-backend.onrender.com/api/products
```

### Endpoints Principales

- `GET /api/products` - Lista de productos
- `GET /api/categories` - Lista de categorías
- `GET /api/users` - Lista de usuarios (requiere autenticación)
- `POST /api/auth/login` - Login de usuario

## 🔄 Cambiar Entre Entornos

```bash
# Producción (Render)
npm run configure:render https://tu-backend.onrender.com/api

# Desarrollo local
npm run configure:dev

# Otro servidor
node configure-env.js production https://otro-servidor.com/api
```

## 📞 Soporte

Si tienes problemas:

1. Verifica que el backend esté funcionando en Render
2. Comprueba la URL en el archivo `.env`
3. Ejecuta `npm run test:backend` para diagnosticar
4. Revisa la consola del navegador para errores específicos

---

**Nota**: Asegúrate de que tu backend en Render esté configurado para manejar las rutas de API correctamente y que tenga CORS habilitado para tu frontend.

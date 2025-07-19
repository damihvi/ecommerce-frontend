# 🚨 Solución para Errores 500 del Backend

## 📋 **Problema Actual**

El frontend está conectado correctamente a `https://damihvi.onrender.com/api`, pero algunos endpoints devuelven error 500:

- ✅ **Funcionando**: `/`, `/categories`, `/search/stats`
- ❌ **Error 500**: `/products`, `/users`, `/search/products`

## 🔍 **Causas Comunes**

### **1. Backend "Durmiendo" (Render Free Tier)**
- Los servicios gratuitos de Render se "duermen" después de 15 minutos de inactividad
- Al despertar pueden tardar 30-60 segundos en estar completamente funcionales

### **2. Base de Datos No Conectada**
- Error más común: la conexión a PostgreSQL/MongoDB no está establecida
- Variables de entorno de base de datos mal configuradas

### **3. Falta de Datos Iniciales**
- La base de datos puede estar vacía
- Faltan seeders o datos de prueba

## 🛠️ **Soluciones**

### **Solución 1: Verificar y Reiniciar Backend**

1. **Ve a Render Dashboard**:
   - Ir a [render.com](https://render.com)
   - Buscar tu servicio `damihvi`
   - Ver los logs en tiempo real

2. **Reiniciar el Servicio**:
   - En el dashboard de Render
   - Hacer clic en "Manual Deploy" → "Deploy latest commit"

### **Solución 2: Verificar Variables de Entorno**

En Render, asegúrate de tener configuradas:

```env
# Base de datos
DATABASE_URL=postgresql://user:password@host:port/database
# o para MongoDB
MONGODB_URI=mongodb://host:port/database

# Puerto
PORT=3001

# JWT (si usas autenticación)
JWT_SECRET=tu_secreto_jwt

# CORS
FRONTEND_URL=https://tu-frontend.vercel.app
```

### **Solución 3: Agregar Datos de Prueba**

Si la base de datos está vacía, puedes:

1. **Usar un script de seed** (si existe en tu backend)
2. **Agregar datos manualmente** a través de endpoints de creación
3. **Usar datos de ejemplo** desde el frontend

### **Solución 4: Timeout y Reintentos**

El frontend ya está configurado para manejar estos errores:

- ✅ Reintentos automáticos
- ✅ Fallback a datos vacíos
- ✅ Mensajes informativos para el usuario
- ✅ Indicador de estado del backend

## 🔄 **Monitoreo Continuo**

### **Comandos de Diagnóstico**:

```bash
# Probar todos los endpoints
npm run test:backend

# Configurar para desarrollo local (si tienes el backend local)
npm run configure:dev

# Ver estado en tiempo real
curl https://damihvi.onrender.com/api/categories
```

### **URLs para Monitorear**:

- 🟢 **Salud**: https://damihvi.onrender.com/api/
- 🟢 **Categorías**: https://damihvi.onrender.com/api/categories  
- 🔴 **Productos**: https://damihvi.onrender.com/api/products
- 🔴 **Usuarios**: https://damihvi.onrender.com/api/users

## ⚡ **Solución Rápida para Desarrollo**

Si necesitas que funcione inmediatamente:

### **Opción 1: Usar Mock Data**

```typescript
// En src/services/api.ts - agregar fallback
export const productsAPI = {
  getAll: async () => {
    try {
      return await apiClient.get('/products');
    } catch (error) {
      // Fallback a datos mock
      return {
        data: [
          { id: 1, name: 'Producto Demo', price: 99.99, description: 'Producto de ejemplo' },
          { id: 2, name: 'Otro Producto', price: 149.99, description: 'Otro producto demo' }
        ]
      };
    }
  }
};
```

### **Opción 2: Levantar Backend Local**

```bash
# En la carpeta del backend
cd ../ecommerce
npm run start:dev
```

Luego configurar el frontend para local:
```bash
npm run configure:dev
```

## 📱 **Estado Actual del Frontend**

El frontend está preparado para manejar estos errores:

- ✅ No se rompe cuando hay errores 500
- ✅ Muestra mensajes informativos
- ✅ Indica el estado del backend
- ✅ Reintentos automáticos
- ✅ Funciona con los endpoints que están disponibles

## 🎯 **Próximos Pasos Recomendados**

1. **Verificar logs de Render** para ver el error específico
2. **Confirmar configuración de base de datos** en Render
3. **Hacer un deploy manual** para reiniciar el servicio
4. **Agregar datos de prueba** si la BD está vacía
5. **Considerar upgrade a plan pago** para evitar que el servicio se duerma

---

**Nota**: El error 500 es temporal y típico cuando se usa Render gratuito. El frontend está preparado para manejar esta situación y funcionará correctamente una vez que el backend esté completamente operativo.

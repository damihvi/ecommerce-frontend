// CREDENCIALES DE ADMINISTRADOR
// ===============================

// URL base del backend
const API_BASE_URL = 'https://nestjs-ecommerce-backend-api.desarrollo-software.xyz/api'

// Credenciales del admin
const ADMIN_CREDENTIALS = {
  identifier: 'admin@ecommerce.com', // Campo correcto para login
  password: 'admin123'
}

// Ejemplo de login con fetch
/*
fetch(`${API_BASE_URL}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include', // Importante para CORS
  body: JSON.stringify({
    identifier: 'admin@ecommerce.com',
    password: 'admin123'
  })
})
*/

// NOTAS IMPORTANTES:
// - El campo para login es 'identifier', NO 'email'
// - Se requiere withCredentials: true para CORS
// - El admin tiene permisos para acceder a /admin/products
// - Los roles disponibles son: 'ADMIN' | 'USER'

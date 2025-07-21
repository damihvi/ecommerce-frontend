// CREDENCIALES DE ADMINISTRADOR
// ===============================

// URL base del backend
const API_BASE_URL = 'https://damihvi.onrender.com/api'

// Credenciales del admin
const ADMIN_CREDENTIALS = {
  email: 'admin@test.com', // Campo correcto para login
  password: 'admin123'
}

//login con fetch
/*
fetch(`${API_BASE_URL}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include', // Importante para CORS
  body: JSON.stringify({
    email: 'admin@test.com',
    password: 'admin123'
  })
})
*/

// NOTAS IMPORTANTES:
// - El campo para login es 'email', NO 'identifier'
// - Se requiere withCredentials: true para CORS
// - El admin tiene permisos para acceder a /admin/products
// - Los roles disponibles son: 'ADMIN' | 'USER'

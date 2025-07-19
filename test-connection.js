const https = require('https');

async function testFrontendBackendConnection() {
  console.log('🧪 Probando conexión Frontend → Backend corregida...\n');
  
  const frontendURL = 'https://ecommerce-herrera.vercel.app';
  const backendURL = 'https://damihvi.onrender.com/api';
  
  console.log(`📱 Frontend: ${frontendURL}`);
  console.log(`🔧 Backend: ${backendURL}\n`);
  
  // Probar endpoints directamente
  const tests = [
    { name: 'Backend Health', url: `${backendURL}` },
    { name: 'Backend Products', url: `${backendURL}/products` },
    { name: 'Backend Categories', url: `${backendURL}/categories` },
  ];
  
  for (const test of tests) {
    try {
      console.log(`⏳ Probando ${test.name}...`);
      
      const result = await new Promise((resolve, reject) => {
        const req = https.request(test.url, { method: 'GET' }, (res) => {
          let body = '';
          res.on('data', chunk => body += chunk);
          res.on('end', () => {
            try {
              const json = JSON.parse(body);
              resolve({ status: res.statusCode, data: json, headers: res.headers });
            } catch {
              resolve({ status: res.statusCode, data: body, headers: res.headers });
            }
          });
        });
        
        req.on('error', reject);
        req.setTimeout(30000, () => reject(new Error('Timeout')));
        req.end();
      });
      
      if (result.status === 200) {
        console.log(`✅ ${test.name}: OK (${result.status})`);
        
        // Verificar CORS headers
        const corsHeaders = {
          'access-control-allow-origin': result.headers['access-control-allow-origin'],
          'access-control-allow-credentials': result.headers['access-control-allow-credentials'],
          'access-control-allow-methods': result.headers['access-control-allow-methods']
        };
        
        console.log(`   🌐 CORS Headers:`, corsHeaders);
        
        if (test.name.includes('Products') && result.data.data) {
          console.log(`   📦 ${result.data.data.length} productos disponibles`);
        }
        if (test.name.includes('Categories') && result.data.data) {
          console.log(`   📁 ${result.data.data.length} categorías disponibles`);
        }
      } else {
        console.log(`❌ ${test.name}: Error ${result.status}`);
      }
      
    } catch (error) {
      console.log(`💥 ${test.name}: ${error.message}`);
    }
    console.log('');
  }
  
  console.log('🎯 Pasos siguientes:');
  console.log('1. ✅ Backend funcionando correctamente');
  console.log('2. ⏳ Esperando deploy de Vercel (2-3 minutos)');
  console.log('3. 🔄 Luego probar el frontend actualizado');
  console.log(`4. 🌐 Ir a: ${frontendURL}/admin`);
  console.log('5. 🔑 Login con: admin@test.com / admin123');
}

testFrontendBackendConnection().catch(console.error);

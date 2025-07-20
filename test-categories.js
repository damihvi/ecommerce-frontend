const testAPI = async () => {
  try {
    console.log('🔍 Testing API endpoints...\n');
    
    // Test products endpoint
    console.log('📦 Testing products endpoint:');
    const productsResponse = await fetch('https://damihvi.onrender.com/api/products');
    const productsData = await productsResponse.json();
    
    if (productsData.success && productsData.data.length > 0) {
      const firstProduct = productsData.data[0];
      console.log('✅ Products endpoint working');
      console.log('📋 First product:', {
        id: firstProduct.id,
        name: firstProduct.name,
        price: firstProduct.price,
        categoryId: firstProduct.categoryId,
        category: firstProduct.category
      });
      
      if (firstProduct.category) {
        console.log('✅ Category relation is being loaded');
        console.log('🏷️  Category:', firstProduct.category.name);
      } else {
        console.log('❌ Category relation is NOT being loaded');
      }
    }
    
    console.log('\n📁 Testing categories endpoint:');
    const categoriesResponse = await fetch('https://damihvi.onrender.com/api/categories');
    const categoriesData = await categoriesResponse.json();
    
    if (categoriesData.success && categoriesData.data.length > 0) {
      console.log('✅ Categories endpoint working');
      console.log('📂 Available categories:', categoriesData.data.map(c => ({ id: c.id, name: c.name })));
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
};

testAPI();

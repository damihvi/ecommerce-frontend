import { useEffect, useState } from 'react';

function useProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('https://nestjs-ecommerce-backend-api.desarrollo-software.xyz/api/products/public-list')
      .then(res => res.json())
      .then(data => {
        // data should be SuccessResponseDto
        if (data && data.success && Array.isArray(data.data)) {
          setProducts(data.data);
        } else if (data && data.success && data.data && Array.isArray(data.data.items)) {
          setProducts(data.data.items);
        } else {
          setProducts([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setProducts([]);
        setLoading(false);
      });
  }, []);

  return { products, loading };
}

export default useProducts;

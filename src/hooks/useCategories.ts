import { useEffect, useState } from 'react';

function useCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('https://nestjs-ecommerce-backend-api.desarrollo-software.xyz/api/categories/public-list')
      .then(res => res.json())
      .then(data => {
        // data should be SuccessResponseDto
        if (data && data.success && Array.isArray(data.data)) {
          setCategories(data.data);
        } else if (data && data.success && data.data && Array.isArray(data.data.items)) {
          setCategories(data.data.items);
        } else {
          setCategories([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setCategories([]);
        setLoading(false);
      });
  }, []);

  return { categories, loading };
}

export default useCategories;

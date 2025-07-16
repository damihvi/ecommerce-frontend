import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchProducts = async () => {
  const { data } = await axios.get('https://nestjs-ecommerce-backend-api.desarrollo-software.xyz/api/products/public-list');
  return data;
};

export default function useProducts() {
  return useQuery({
    queryKey: ['public-products'],
    queryFn: fetchProducts,
  });
}

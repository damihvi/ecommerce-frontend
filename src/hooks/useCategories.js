import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchCategories = async () => {
  const { data } = await axios.get('https://nestjs-ecommerce-backend-api.desarrollo-software.xyz/api/categories/public-list');
  return data;
};

export default function useCategories() {
  return useQuery({
    queryKey: ['public-categories'],
    queryFn: fetchCategories,
  });
}

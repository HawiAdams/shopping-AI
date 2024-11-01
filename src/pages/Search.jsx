import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import SearchFilters from '../components/SearchFilters';

export default function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    sort: 'relevance',
    priceRange: 'all'
  });

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products', searchTerm, filters],
    queryFn: () => searchProducts(searchTerm, filters),
    enabled: searchTerm.length > 0
  });

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search for products..."
          className="flex-1 p-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <SearchFilters filters={filters} onChange={setFilters} />
      </div>

      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
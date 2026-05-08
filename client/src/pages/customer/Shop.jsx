import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { fetchProducts } from '../../redux/slices/productSlice';
import ProductCard from '../../components/common/ProductCard';
import { Search, Filter } from 'lucide-react';

const Shop = () => {
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const dispatch = useDispatch();
  const { items: products, loading, error } = useSelector((state) => state.products);

  const [dynamicCategories, setDynamicCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('/api/products');
        if (Array.isArray(data)) {
          const uniqueCategories = [...new Set(data.map(p => p.category))];
          setDynamicCategories(uniqueCategories);
        }
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    dispatch(fetchProducts({ category, search }));
  }, [dispatch, category, search]);

  return (
    <div className="px-6 md:px-12 py-10 md:py-16">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 md:mb-20 gap-10">
        <div className="w-full">
          <p className="text-secondary font-bold uppercase tracking-[0.4em] text-[10px] mb-4">VSR Portfolio</p>
          <h2 className="text-5xl md:text-7xl serif mb-4 text-black">The Boutique</h2>
          <div className="w-24 h-[1px] bg-gold" />
        </div>


        <div className="flex flex-col sm:flex-row gap-6 items-center w-full lg:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
            <input 
              type="text" 
              placeholder="Search designs..." 
              className="luxury-input pl-12 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <select 
            className="luxury-input w-full sm:w-60 cursor-pointer appearance-none"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Collections</option>
            {dynamicCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-32">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-gold"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-32 serif italic text-xl">{error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
          {products.length === 0 && (
            <div className="col-span-full text-center py-32 text-muted serif italic text-2xl">
              No pieces found in this collection.
            </div>
          )}
        </div>
      )}
    </div>

  );
};

export default Shop;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Collections = () => {
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAndGroup = async () => {
      try {
        const { data } = await axios.get('/api/products');
        if (Array.isArray(data)) {
          const grouped = data.reduce((acc, product) => {
            if (!acc[product.category]) {
              acc[product.category] = [];
            }
            acc[product.category].push(product);
            return acc;
          }, {});
          setCategories(grouped);
        }
      } catch (error) {
        console.error('Failed to fetch collections', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAndGroup();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-12 py-12 md:py-20 max-w-7xl mx-auto">
      <div className="mb-12 md:mb-20 text-center">
        <p className="text-secondary font-bold uppercase tracking-[0.4em] text-[10px] md:text-xs mb-4">Discover VSR</p>
        <h1 className="text-4xl md:text-6xl serif mb-6">Our Collections</h1>
        <div className="w-24 h-[1px] bg-gold mx-auto"></div>
      </div>

      <div className="space-y-20 md:space-y-32">
        {Object.keys(categories).map((category) => (
          <div key={category}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 border-b border-border pb-6 gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl serif uppercase tracking-tighter">{category}</h2>
                <p className="text-muted text-[10px] font-bold uppercase tracking-widest mt-2">
                  {categories[category].length} Pieces in Collection
                </p>
              </div>
              <button 
                onClick={() => navigate(`/shop?category=${category}`)}
                className="text-[10px] font-bold uppercase tracking-widest hover:text-gold transition-colors"
              >
                Explore Full Category →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {categories[category].slice(0, 4).map((product) => (
                <motion.div 
                  whileHover={{ y: -10 }}
                  key={product._id}
                  onClick={() => navigate(`/product/${product._id}`)}
                  className="group cursor-pointer"
                >
                  <div className="aspect-[3/4] overflow-hidden bg-gray-50 mb-4 relative">
                    <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                  </div>
                  <h3 className="serif text-lg mb-1 group-hover:text-gold transition-colors">{product.title}</h3>
                  <p className="text-sm text-gray-500 italic">₹{(product.price || 0).toLocaleString()}</p>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>

  );
};

export default Collections;

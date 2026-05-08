import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import axios from 'axios';

const Home = () => {
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get('/api/products');
        if (Array.isArray(data)) {
          // Sort by date for new arrivals
          const sortedNew = [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4);
          setNewArrivals(sortedNew);
          
          // Sort by rating count for best sellers (proxy for sales)
          const sortedBest = [...data].sort((a, b) => (b.ratings?.count || 0) - (a.ratings?.count || 0)).slice(0, 4);
          setBestSellers(sortedBest);
        }
      } catch (error) {
        console.error('Failed to fetch home data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[80vh] md:h-[90vh] flex items-center px-6 md:px-12 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 z-0"
        >
          <img 
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2070" 
            alt="Hero Fashion"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/40 to-transparent" />
        </motion.div>

        <div className="relative z-10 max-w-4xl w-full">
          <motion.p 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="uppercase tracking-[0.3em] md:tracking-[0.5em] text-muted text-[10px] md:text-xs font-bold mb-4 md:mb-6"
          >
            VSR Heritage • 2026
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl serif leading-[1] md:leading-[0.9] mb-6 md:mb-8 text-black"
          >
            Artistry in <br className="hidden md:block" /> Every Thread
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-base md:text-lg text-muted mb-8 md:mb-10 max-w-lg font-light leading-relaxed"
          >
            Discover handcrafted luxury that blends timeless heritage with modern sophistication. 
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-4 md:gap-6"
          >
            <Link to="/collections" className="luxury-btn flex items-center justify-center gap-2 shadow-xl py-4 sm:py-3">
              Explore Collections <ArrowRight size={14} />
            </Link>
            <Link to="/shop" className="px-8 py-4 sm:py-3 border border-black/20 hover:bg-black hover:text-white transition-all duration-500 uppercase tracking-widest text-[10px] font-bold text-center">
              Shop All
            </Link>
          </motion.div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-20 md:py-32 px-6 md:px-12 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-6">
          <div>
            <p className="text-secondary font-bold uppercase tracking-[0.3em] text-[10px] mb-2">Just Landed</p>
            <h2 className="text-4xl md:text-5xl serif">New Arrivals</h2>
          </div>
          <Link to="/shop" className="text-[10px] font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-gold hover:border-gold transition-all">View Entire Collection</Link>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {newArrivals.map((product) => (
              <motion.div 
                key={product._id}
                whileHover={{ y: -10 }}
                onClick={() => navigate(`/product/${product._id}`)}
                className="group cursor-pointer"
              >
                <div className="aspect-[3/4] overflow-hidden bg-gray-100 mb-6 relative">
                  <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 left-4 bg-black text-white text-[8px] font-bold uppercase px-3 py-1">New</div>
                </div>
                <h3 className="serif text-xl mb-1 group-hover:text-gold transition-colors">{product.title}</h3>
                <p className="text-sm text-gray-400 italic mb-2">{product.category}</p>
                <p className="text-lg font-medium">₹{(product.price || 0).toLocaleString()}</p>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Best Sellers Section */}
      <section className="py-20 md:py-32 bg-[#FAF9F6] px-6 md:px-12">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-12 md:mb-20">
            <p className="text-secondary font-bold uppercase tracking-[0.4em] text-[10px] mb-4">Customer Favorites</p>
            <h2 className="text-4xl md:text-6xl serif">The Best Sellers</h2>
            <div className="w-24 h-[1px] bg-gold mx-auto mt-6 md:mt-8"></div>
          </div>

          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
              {bestSellers.map((product) => (
                <motion.div 
                  key={product._id}
                  whileHover={{ y: -10 }}
                  onClick={() => navigate(`/product/${product._id}`)}
                  className="group cursor-pointer"
                >
                  <div className="aspect-[3/4] overflow-hidden bg-white mb-6 shadow-sm border border-border">
                    <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={10} fill={i < Math.floor(product.ratings?.average || 0) ? "#D4AF37" : "none"} className={i < Math.floor(product.ratings?.average || 0) ? "text-gold" : "text-gray-300"} />
                    ))}
                    <span className="text-[10px] text-muted ml-2">({product.ratings?.count || 0} reviews)</span>
                  </div>
                  <h3 className="serif text-xl mb-1 group-hover:text-gold transition-colors">{product.title}</h3>
                  <p className="text-lg font-medium">₹{(product.price || 0).toLocaleString()}</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>

  );
};

export default Home;


import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { removeFromWishlist } from '../../redux/slices/wishlistSlice';
import { addToCart } from '../../redux/slices/cartSlice';

const Wishlist = () => {
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();

  const handleMoveToCart = (item) => {
    dispatch(addToCart({ ...item, qty: 1 }));
    dispatch(removeFromWishlist(item._id));
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center px-12">
        <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center mb-8">
          <Heart size={40} className="text-muted opacity-20" />
        </div>
        <h2 className="text-4xl serif mb-6 text-black">Your Wishlist is Empty</h2>
        <p className="text-muted mb-10 max-w-sm uppercase text-[10px] font-bold tracking-widest">
          Save items you love to find them easily later.
        </p>
        <Link to="/shop" className="luxury-btn">Explore Collection</Link>
      </div>
    );
  }

  return (
    <div className="px-12 py-20 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-16">
        <div>
          <h2 className="text-6xl serif text-black">Saved Pieces</h2>
          <p className="text-muted text-[10px] uppercase font-bold tracking-widest mt-4">
            {wishlistItems.length} Exceptional Items
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        <AnimatePresence>
          {wishlistItems.map((item) => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={item._id} 
              className="group bg-white border border-border overflow-hidden"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                />
                <button 
                  onClick={() => dispatch(removeFromWishlist(item._id))}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-md flex items-center justify-center rounded-full hover:bg-black hover:text-white transition-all shadow-lg"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-muted mb-2">Ref. {item._id.slice(-6).toUpperCase()}</p>
                    <h3 className="text-lg font-medium">{item.title}</h3>
                  </div>
                  <p className="text-xl font-serif text-black">₹{item.price}</p>
                </div>

                <div className="flex gap-4 pt-6 border-t border-border">
                  <button 
                    onClick={() => handleMoveToCart(item)}
                    className="flex-1 luxury-btn py-3 text-[10px] flex items-center justify-center gap-2"
                  >
                    <ShoppingBag size={14} /> Move to Bag
                  </button>
                  <Link 
                    to={`/product/${item._id}`}
                    className="w-12 border border-border flex items-center justify-center hover:border-black transition-all"
                  >
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Wishlist;

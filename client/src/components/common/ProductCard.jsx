import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../../redux/slices/wishlistSlice';
import { useSelector } from 'react-redux';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const isWishlisted = wishlistItems.find((x) => x._id === product._id);

  const handleWishlist = (e) => {
    e.preventDefault();
    if (isWishlisted) {
      dispatch(removeFromWishlist(product._id));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  const handleAddToCart = (e) => {

    e.preventDefault();
    dispatch(addToCart({
      product: product._id,
      title: product.title,
      price: product.price,
      image: product.images[0],
      qty: 1
    }));
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="group relative flex flex-col premium-card overflow-hidden rounded-sm"
    >

      <Link to={`/product/${product._id}`} className="relative aspect-[3/4] overflow-hidden">
        <img 
          src={product.images[0] || 'https://via.placeholder.com/400x500?text=No+Image'} 
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
        
        <div className="absolute top-4 right-4 flex flex-col gap-2 transform translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
          <button 
            onClick={handleWishlist}
            className={`w-10 h-10 flex items-center justify-center rounded-full transition-all shadow-xl ${isWishlisted ? 'bg-black text-white' : 'bg-white text-black hover:bg-black hover:text-white'}`}
          >
            <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>
          <button 
            onClick={handleAddToCart}

            className="w-10 h-10 bg-white flex items-center justify-center rounded-full hover:bg-black hover:text-white transition-all shadow-xl"
          >
            <ShoppingBag size={18} className="text-black" />
          </button>

        </div>

        {product.stock === 0 && (
          <div className="absolute top-4 left-4 bg-red-600 text-[8px] font-bold px-2 py-1 uppercase tracking-widest text-white">
            Out of Stock
          </div>
        )}
      </Link>

      <div className="p-4 md:p-6 text-center">
        <p className="text-[8px] md:text-[10px] text-muted uppercase tracking-[0.2em] md:tracking-[0.3em] mb-2">{product.category}</p>
        <h3 className="text-sm font-medium mb-2 group-hover:text-gold transition-colors truncate">{product.title}</h3>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-1 sm:gap-4">
          <p className="text-base md:text-lg serif text-black">₹{(product.price || 0).toLocaleString()}</p>
          <div className="flex text-muted gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={10} fill={i < Math.round(product.ratings?.average || 0) ? '#FF4D4D' : 'none'} className={i < Math.round(product.ratings?.average || 0) ? 'text-gold' : 'text-gray-300'} />
            ))}
          </div>
        </div>
      </div>

    </motion.div>
  );
};

export default ProductCard;

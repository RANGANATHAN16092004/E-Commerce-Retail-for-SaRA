import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingBag, Heart, Star, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { addToCart } from '../../redux/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../../redux/slices/wishlistSlice';
import { toast } from 'react-toastify';

const ProductDetails = () => {

  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [mainImage, setMainImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewImage, setReviewImage] = useState('');
  const [reviewUploading, setReviewUploading] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector(state => state.auth);
  const { wishlistItems } = useSelector(state => state.wishlist);
  const isWishlisted = wishlistItems.some(item => item._id === id);

  useEffect(() => {
    const fetchProductAndRelated = async () => {
      const { data } = await axios.get(`/api/products/${id}`);
      setProduct(data);
      setMainImage(data.images[0]);
      
      // Fetch related products
      const { data: related } = await axios.get(`/api/products?category=${data.category}`);
      setRelatedProducts(related.filter(p => p._id !== data._id).slice(0, 4));
      
      setLoading(false);
    };
    fetchProductAndRelated();
  }, [id]);


  const uploadReviewImageHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setReviewUploading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`
        }
      };
      const { data } = await axios.post('/api/upload', formData, config);
      setReviewImage(data.url);
      setReviewUploading(false);
    } catch (error) {
      console.error(error);
      setReviewUploading(false);
      toast.error('Image upload failed');
    }
  };

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.info('Please select a rating');
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`
        }
      };
      await axios.post(`/api/products/${id}/reviews`, { 
        rating, 
        comment, 
        image: reviewImage 
      }, config);
      
      toast.success('Review Submitted');
      setRating(0);
      setComment('');
      setReviewImage('');
      // Refresh product
      const { data } = await axios.get(`/api/products/${id}`);
      setProduct(data);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };



  const handleAddToCart = () => {
    const sizeRequired = product.sizes && product.sizes.length > 0 && product.sizes[0] !== '';
    const colorRequired = product.colors && product.colors.length > 0 && product.colors[0] !== '';

    if (sizeRequired && !selectedSize) {
      toast.info('Please select a size');
      return;
    }
    if (colorRequired && !selectedColor) {
      toast.info('Please select a color');
      return;
    }

    dispatch(addToCart({
      product: product._id,
      title: product.title,
      price: product.price,
      image: product.images[0],
      size: selectedSize || 'N/A',
      color: selectedColor || 'N/A',
      qty: 1
    }));
    navigate('/cart');
  };

  const handleToggleWishlist = () => {
    if (isWishlisted) {
      dispatch(removeFromWishlist(id));
      toast.info('Removed from Wishlist');
    } else {
      dispatch(addToWishlist({
        _id: product._id,
        title: product.title,
        price: product.price,
        image: product.images[0]
      }));
      toast.success('Saved to Wishlist');
    }
  };


  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="px-6 md:px-12 py-12 md:py-20 max-w-[1400px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20">
        
        {/* Images Column */}
        <div className="flex flex-col lg:flex-row gap-6 h-fit lg:sticky lg:top-24">
          
          {/* Main Slider (Mobile + Desktop) */}
          <div className="relative flex-1 order-1 lg:order-2">
            <div className="lg:hidden flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-0 w-full aspect-[3/4] glass shadow-2xl">
              {product.images.map((img, i) => (
                <div key={i} className="min-w-full snap-center h-full">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            
            {/* Desktop Static View (Hidden on Mobile) */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="hidden lg:block aspect-[3/4] glass overflow-hidden shadow-2xl"
            >
              <AnimatePresence mode="wait">
                <motion.img 
                  key={mainImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  src={mainImage} 
                  alt={product.title} 
                  className="w-full h-full object-cover" 
                />
              </AnimatePresence>
            </motion.div>

            {/* Mobile Indicator Dots */}
            <div className="lg:hidden flex justify-center gap-2 mt-4">
              {product.images.map((_, i) => (
                <div key={i} className={`w-1.5 h-1.5 rounded-full ${mainImage === product.images[i] ? 'bg-gold' : 'bg-gray-300'}`} />
              ))}
            </div>
          </div>

          {/* Thumbnails (Desktop side only, Hidden on Mobile) */}
          <div className="hidden lg:flex flex-col gap-3 w-20 no-scrollbar">
            {product.images.map((img, i) => (
              <div 
                key={i} 
                onClick={() => setMainImage(img)}
                className={`aspect-[3/4] border-2 cursor-pointer transition-all duration-300 ${mainImage === img ? 'border-gold scale-95 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>


        {/* Info Column */}
        <div className="flex flex-col order-2 md:order-none">
          <p className="text-gold font-bold uppercase tracking-[0.3em] text-[10px] mb-4">{product.category}</p>
          <h1 className="text-4xl md:text-5xl serif mb-6 text-black leading-tight">{product.title}</h1>
          
          <div className="flex items-center gap-6 mb-8 flex-wrap">
            <p className="text-2xl md:text-3xl font-serif text-black">₹{(product.price || 0).toLocaleString()}</p>

            <div className="flex items-center gap-2">
              <div className="flex text-gold">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < Math.round(product.ratings?.average || 0) ? 'currentColor' : 'none'} />)}
              </div>
              <span className="text-muted text-[10px] uppercase font-bold tracking-widest">({product.ratings?.count || 0} Reviews)</span>
            </div>
          </div>

          <p className="text-gray-500 mb-10 leading-relaxed font-light text-sm md:text-base">
            {product.description}
          </p>

          <div className="space-y-10 mb-12">
            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && product.sizes[0] !== '' && (
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-muted mb-4">Select Size</p>
                <div className="flex flex-wrap gap-4">
                  {product.sizes.map(size => (
                    <button 
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 flex items-center justify-center border transition-all text-[10px] font-bold ${selectedSize === size ? 'border-gold text-gold bg-gold/5 shadow-inner' : 'border-border hover:border-black'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selector */}
            {product.colors && product.colors.length > 0 && product.colors[0] !== '' && (
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-muted mb-4">Select Color</p>
                <div className="flex flex-wrap gap-4">
                  {product.colors.map(color => (
                    <button 
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-6 py-2 border text-[10px] uppercase tracking-widest font-bold transition-all ${selectedColor === color ? 'border-gold text-gold bg-gold/5 shadow-inner' : 'border-border hover:border-black'}`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>


          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <button 
              onClick={handleAddToCart}
              className="luxury-btn flex-1 py-5 flex items-center justify-center gap-3 text-xs"
            >
              <ShoppingBag size={18} /> Add to Bag
            </button>
            <button 
              onClick={handleToggleWishlist}
              className={`p-5 border border-border transition-all flex justify-center ${isWishlisted ? 'bg-gold/10 border-gold text-gold' : 'hover:bg-black hover:text-white'}`}
            >
              <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Artisan Section */}
          <div className="mt-12 p-6 md:p-8 bg-[#FDFBF7] border border-[#F3EFE8] rounded-sm space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-[1px] bg-gold"></div>
              <p className="text-[10px] uppercase font-bold tracking-[0.4em] text-gold">The Artisan Story</p>
            </div>
            <h3 className="text-2xl serif leading-snug">Handcrafted with Heritage Techniques</h3>
            <p className="text-sm text-gray-500 leading-relaxed font-light italic">
              "Each VSR creation is a masterpiece of patient artistry. Our sarees are woven by traditional artisans using centuries-old techniques, ensuring that every thread tells a story of heritage and luxury."
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest">Pure Fabric</p>
                <p className="text-[11px] text-muted leading-tight">100% Ethically sourced premium silk and cotton blends.</p>
              </div>
              <div className="space-y-2 border-t sm:border-t-0 sm:border-l border-border pt-4 sm:pt-0 sm:pl-8">
                <p className="text-[10px] font-bold uppercase tracking-widest">Slow Fashion</p>
                <p className="text-[11px] text-muted leading-tight">Meticulously crafted over 15-20 days for unmatched quality.</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-20 md:mt-32 pt-12 md:pt-20 border-t border-border">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-20">
          {/* Review Stats & Form */}
          <div className="lg:col-span-4 space-y-10">
            <div>
              <h2 className="text-3xl serif mb-6">Customer Reviews</h2>
              <div className="flex items-center gap-4">
                <div className="flex text-gold">
                  {[...Array(5)].map((_, i) => <Star key={i} size={20} fill={i < Math.round(product.ratings?.average || 0) ? 'currentColor' : 'none'} />)}
                </div>
                <p className="text-xl font-medium">{product.ratings?.average.toFixed(1)} <span className="text-sm text-muted">/ 5</span></p>
              </div>
            </div>

            {userInfo ? (
              <form onSubmit={submitReviewHandler} className="space-y-6 bg-accent p-6 md:p-8 rounded-sm">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted">Share Your Experience</h3>
                
                <div>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setRating(num)}
                        onMouseEnter={() => setHoverRating(num)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="transition-all transform hover:scale-110"
                      >
                        <Star 
                          size={28} 
                          fill={(hoverRating || rating) >= num ? '#FF4D4D' : 'none'} 
                          stroke={(hoverRating || rating) >= num ? '#FF4D4D' : '#cbd5e1'}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <textarea 
                  rows="4"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="luxury-input text-sm"
                  placeholder="The craftsmanship was..."
                ></textarea>

                <div className="flex flex-col gap-4">
                  <input 
                    type="file" 
                    onChange={uploadReviewImageHandler}
                    className="text-[10px] file:mr-4 file:py-2 file:px-4 file:border file:border-border file:text-[10px] file:font-bold file:uppercase file:bg-white file:text-black hover:file:bg-black hover:file:text-white transition-all cursor-pointer" 
                  />
                  {reviewImage && (
                    <div className="w-20 h-20 border rounded-sm overflow-hidden">
                      <img src={reviewImage} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <button type="submit" disabled={reviewUploading} className="luxury-btn w-full py-4 text-xs">
                  {reviewUploading ? 'Uploading Image...' : 'Publish Review'}
                </button>
              </form>
            ) : (
              <div className="bg-accent p-8 rounded-sm text-center">
                <p className="text-xs text-muted mb-4 uppercase tracking-widest">Login to share your thoughts</p>
                <button onClick={() => navigate('/login')} className="text-[10px] font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-gold hover:border-gold">Login Now</button>
              </div>
            )}
          </div>

          {/* Review List */}
          <div className="lg:col-span-8 space-y-12">
            {product.reviews.length === 0 ? (
              <div className="h-40 flex flex-col items-center justify-center border border-dashed border-border text-muted italic p-8 text-center">
                <p>No reviews yet for this masterpiece.</p>
                <p className="text-[10px] uppercase font-bold not-italic tracking-widest mt-2">Be the first to share</p>
              </div>
            ) : (
              <div className="space-y-10">
                {product.reviews.map((review) => (
                  <div key={review._id} className="pb-10 border-b border-border last:border-0 group">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-bold text-[10px] uppercase tracking-widest mb-1">{review.name}</p>
                        <div className="flex text-gold mb-2">
                          {[...Array(5)].map((_, i) => <Star key={i} size={10} fill={i < review.rating ? 'currentColor' : 'none'} />)}
                        </div>
                      </div>
                      <span className="text-[9px] text-muted uppercase tracking-widest">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-600 leading-relaxed font-light italic mb-6 text-sm">"{review.comment}"</p>
                    {review.image && (
                      <div className="w-32 h-40 rounded-sm overflow-hidden border border-border shadow-sm group-hover:shadow-xl transition-all">
                        <img src={review.image} alt="User Review" className="w-full h-full object-cover cursor-pointer hover:scale-110 transition-transform duration-700" onClick={() => window.open(review.image, '_blank')} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="mt-20 md:mt-32 pt-12 md:pt-20 border-t border-border">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-6">
            <div>
              <p className="text-gold font-bold uppercase tracking-[0.3em] text-[10px] mb-2">Heritage Parallel</p>
              <h2 className="text-3xl md:text-4xl serif">You May Also Like</h2>
            </div>
            <button onClick={() => navigate('/shop')} className="text-[10px] uppercase font-bold tracking-widest border-b border-black pb-1 hover:text-gold hover:border-gold transition-all">Explore Boutique</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((p) => (
              <motion.div 
                key={p._id}
                whileHover={{ y: -10 }}
                onClick={() => {
                  navigate(`/product/${p._id}`);
                  window.scrollTo(0, 0);
                }}
                className="group cursor-pointer"
              >
                <div className="aspect-[3/4] overflow-hidden bg-gray-100 mb-4 border border-border shadow-sm group-hover:shadow-xl transition-all">
                  <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <h3 className="serif text-lg mb-1 group-hover:text-gold transition-colors">{p.title}</h3>
                <p className="text-sm text-gray-500 italic">₹{(p.price || 0).toLocaleString()}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>

  );
};


export default ProductDetails;




import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft, ArrowRight } from 'lucide-react';
import { addToCart, removeFromCart } from '../../redux/slices/cartSlice';

const Cart = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const total = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  const updateQty = (item, newQty) => {
    if (newQty < 1) return;
    dispatch(addToCart({ ...item, qty: newQty }));
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center px-12">
        <h2 className="text-4xl serif mb-6">Your bag is empty</h2>
        <p className="text-muted mb-10 max-w-sm">Discover our latest collections and find something extraordinary.</p>
        <Link to="/shop" className="luxury-btn">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-12 py-12 md:py-20 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 md:gap-16">
      <div className="lg:col-span-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 md:mb-12 gap-4">
          <h2 className="text-4xl md:text-5xl serif text-black">Shopping Bag</h2>
          <p className="text-muted text-[10px] uppercase font-bold tracking-widest">{cartItems.length} Handcrafted Pieces</p>
        </div>


        <div className="space-y-8 md:space-y-10">
          {cartItems.map((item) => (
            <div key={item.product} className="flex flex-col sm:flex-row gap-6 md:gap-8 pb-8 border-b border-border group">
              <div className="w-full sm:w-32 h-64 sm:h-44 glass overflow-hidden shadow-md">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="flex-1 flex flex-col justify-between py-2">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-medium mb-1">{item.title}</h3>
                      <p className="text-[10px] uppercase font-bold text-muted tracking-widest">Size: {item.size || 'N/A'} • Color: {item.color || 'N/A'}</p>
                    </div>
                    <button onClick={() => dispatch(removeFromCart(item.product))} className="text-muted hover:text-red-500 transition-colors p-2">
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <p className="text-black font-serif text-2xl">₹{(item.price || 0).toLocaleString()}</p>
                </div>

                <div className="flex items-center gap-6 mt-6 sm:mt-0">
                  <div className="flex items-center border border-border bg-accent">
                    <button onClick={() => updateQty(item, item.qty - 1)} className="p-3 hover:text-gold transition-colors"><Minus size={14} /></button>
                    <span className="w-12 text-center text-xs font-bold">{item.qty}</span>
                    <button onClick={() => updateQty(item, item.qty + 1)} className="p-3 hover:text-gold transition-colors"><Plus size={14} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <Link to="/shop" className="mt-12 inline-flex items-center gap-2 text-muted hover:text-black transition-colors text-[10px] font-bold uppercase tracking-widest border-b border-transparent hover:border-black pb-1">
          <ArrowLeft size={14} /> Continue Shopping
        </Link>
      </div>

      <div className="lg:col-span-1">
        <div className="bg-accent p-8 md:p-10 lg:sticky lg:top-32 shadow-sm border border-border">
          <h3 className="text-2xl serif mb-8">Summary</h3>
          <div className="space-y-6 mb-10">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
              <span className="text-muted">Subtotal</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
              <span className="text-muted">Estimated Shipping</span>
              <span className="text-green-600">Complimentary</span>
            </div>
            <div className="h-[1px] bg-border" />
            <div className="flex justify-between items-end">
              <span className="serif text-xl">Total</span>
              <span className="text-2xl font-bold text-gold">₹{total.toLocaleString()}</span>
            </div>

          </div>
          
          <button 
            onClick={() => navigate('/checkout')}
            className="luxury-btn w-full py-5 flex items-center justify-center gap-3 text-xs"
          >
            Checkout Securely <ArrowRight size={16} />
          </button>
          
          <div className="mt-12 flex flex-col items-center gap-4">
            <div className="flex gap-4 opacity-40 grayscale">
               {/* Placeholders for payment icons */}
               <div className="w-8 h-5 bg-black/20 rounded-sm"></div>
               <div className="w-8 h-5 bg-black/20 rounded-sm"></div>
               <div className="w-8 h-5 bg-black/20 rounded-sm"></div>
            </div>
            <p className="text-[8px] text-muted uppercase tracking-[0.2em] font-bold">Secure Global Payment Processing</p>
          </div>
        </div>
      </div>
    </div>

  );
};

export default Cart;

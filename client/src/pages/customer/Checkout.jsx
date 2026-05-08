import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../../redux/slices/cartSlice';
import { toast } from 'react-toastify';

const Checkout = () => {


  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const [address, setAddress] = useState({ address: '', city: '', postalCode: '', country: '', phone: '' });
  const [paymentMethod, setPaymentMethod] = useState('Online');
  const [couponCode, setCouponCode] = useState('');
  const [coupon, setCoupon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);


  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const total = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  
  let discountAmount = 0;
  if (coupon) {
    if (coupon.discountType === 'Percentage') {
      discountAmount = (total * (coupon.discountValue / 100));
    } else {
      discountAmount = coupon.discountValue;
    }
  }
  
  const finalTotal = Math.max(0, total - discountAmount);

  const applyCoupon = async () => {
    setCouponLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.post('/api/coupons/validate', { code: couponCode }, config);
      
      if (total < data.minAmount) {
        toast.warning(`This coupon requires a minimum spend of ₹${data.minAmount}`);
        return;
      }

      setCoupon(data);
      const saved = data.discountType === 'Percentage' ? (total * (data.discountValue / 100)) : data.discountValue;
      toast.success(`Coupon applied! You saved ₹${saved.toFixed(2)}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid coupon');
    } finally {
      setCouponLoading(false);
    }
  };



  const initPayment = async (orderData, razorpayOrder) => {
    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
    
    if (!razorpayKey) {
      toast.error("Razorpay Key is missing in environment variables");
      return;
    }

    const options = {
      key: razorpayKey,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      name: "VSR Luxury",
      description: "Purchase for Elegance",
      image: "https://example.com/logo.png",
      order_id: razorpayOrder.id,
      handler: async (response) => {
        try {
          const verifyData = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          };
          await axios.post('/api/orders/verify', verifyData, {
            headers: { Authorization: `Bearer ${userInfo.token}` }
          });
          dispatch(clearCart());
          navigate('/orders');
        } catch (error) {
          console.error(error);
          toast.error("Payment verification failed");
        }
      },
      prefill: {
        name: userInfo.name,
        email: userInfo.email,
        contact: address.phone
      },
      theme: { color: "#FF4D4D" },
      modal: {
        ondismiss: async () => {
          try {
            await axios.put(`/api/orders/${orderData._id}/cancel`, {}, {
              headers: { Authorization: `Bearer ${userInfo.token}` }
            });
            toast.info("Payment cancelled. Order has been invalidated.");
          } catch (error) {
            console.error("Failed to cancel order:", error);
          }
        }
      }
    };
    const rzp = new window.Razorpay(options);
    
    rzp.on('payment.failed', async (response) => {
      try {
        await axios.put(`/api/orders/${orderData._id}/cancel`, {}, {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        });
        toast.error(`Payment Failed: ${response.error.description}. Order cancelled.`);
      } catch (error) {
        console.error("Failed to cancel order:", error);
      }
    });

    rzp.open();
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        orderItems: cartItems,
        shippingAddress: address,
        totalPrice: finalTotal,
        paymentMethod: paymentMethod
      };


      const { data } = await axios.post('/api/orders', orderData, {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });

      if (paymentMethod === 'Online') {
        await initPayment(data.order, data.razorpayOrder);
      } else {
        dispatch(clearCart());
        navigate('/orders');
      }
    } catch (error) {
      console.error(error);
      toast.error("Checkout failed");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="px-6 md:px-12 py-12 md:py-20 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20">
      <div className="order-2 lg:order-1">
        <h2 className="text-3xl md:text-4xl serif mb-10">Shipping Atelier</h2>
        <form onSubmit={handleCheckout} className="space-y-6 md:space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-full">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-muted mb-3">Street Address</label>
              <input 
                type="text" 
                className="luxury-input" 
                placeholder="Suite, Building, Street"
                required 
                onChange={(e) => setAddress({...address, address: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-muted mb-3">City</label>
              <input 
                type="text" 
                className="luxury-input" 
                required 
                onChange={(e) => setAddress({...address, city: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-muted mb-3">Postal Code</label>
              <input 
                type="text" 
                className="luxury-input" 
                required 
                onChange={(e) => setAddress({...address, postalCode: e.target.value})}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-muted mb-3">Country</label>
              <input 
                type="text" 
                className="luxury-input" 
                required 
                onChange={(e) => setAddress({...address, country: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-muted mb-3">Phone</label>
              <input 
                type="text" 
                className="luxury-input" 
                required 
                placeholder="+91..."
                onChange={(e) => setAddress({...address, phone: e.target.value})}
              />
            </div>
          </div>

          <div className="pt-6">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-muted mb-4">Payment Method</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div 
                onClick={() => setPaymentMethod('Online')}
                className={`p-6 border cursor-pointer transition-all text-center group ${paymentMethod === 'Online' ? 'border-gold bg-gold text-white shadow-xl' : 'border-border hover:border-gold bg-accent'}`}
              >
                <p className="text-xs font-bold uppercase tracking-widest">Pay Online</p>
                <p className="text-[10px] opacity-60 mt-2 font-medium">Safe & Secure Payment</p>
              </div>
              <div 
                onClick={() => setPaymentMethod('COD')}
                className={`p-6 border cursor-pointer transition-all text-center group ${paymentMethod === 'COD' ? 'border-gold bg-gold text-white shadow-xl' : 'border-border hover:border-gold bg-accent'}`}
              >
                <p className="text-xs font-bold uppercase tracking-widest">Cash on Delivery</p>
                <p className="text-[10px] opacity-60 mt-2 font-medium">Pay upon arrival</p>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className="luxury-btn w-full py-5 mt-10 disabled:opacity-50 text-xs shadow-2xl"
            disabled={loading}
          >
            {loading ? 'Processing Transaction...' : (paymentMethod === 'Online' ? 'Proceed to Secure Payment' : 'Confirm Order via COD')}
          </button>

        </form>
      </div>

      <div className="order-1 lg:order-2">
        <div className="bg-accent p-8 md:p-12 h-fit lg:sticky lg:top-32 border border-border shadow-sm">
          <h3 className="text-2xl serif mb-10">Order Summary</h3>
          <div className="space-y-6 mb-10">
            {cartItems.map(item => (
              <div key={item.product} className="flex justify-between items-center text-xs">
                <span className="text-muted font-medium">{item.title} <span className="text-gold">x {item.qty}</span></span>
                <span className="font-bold">₹{(item.price * item.qty).toLocaleString()}</span>
              </div>
            ))}
            
            <div className="pt-8 border-t border-border">
              <p className="text-[10px] uppercase font-bold tracking-widest text-muted mb-4">Insignia / Promotional Code</p>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  className="luxury-input flex-1 py-3 uppercase text-xs" 
                  placeholder="CODE"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                />
                <button 
                  type="button"
                  onClick={applyCoupon}
                  disabled={couponLoading || !couponCode}
                  className="bg-black text-white px-6 text-[10px] font-bold uppercase tracking-widest hover:bg-gold transition-all disabled:opacity-50"
                >
                  Apply
                </button>
              </div>
            </div>

            <div className="h-[1px] bg-border my-8" />
            
            <div className="space-y-4">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted">
                <span>Subtotal</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
              {coupon && (
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-green-600">
                  <span>Insignia Discount</span>
                  <span>-₹{discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between items-end pt-6 border-t border-border">
                <span className="serif text-xl">Final Total</span>
                <span className="text-2xl font-bold text-gold">₹{finalTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white/50 border border-border rounded-sm">
            <p className="text-[9px] text-muted leading-relaxed italic text-center">
              * VSR Luxury ensures white-glove delivery for every piece. By proceeding, you acknowledge our terms of craftsmanship and heritage handling.
            </p>
          </div>
        </div>
      </div>
    </div>

  );
};

export default Checkout;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, Plus, X, Trash2, Calendar } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminCoupons = () => {

  const [coupons, setCoupons] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'Percentage',
    discountValue: '',
    minAmount: '',
    expiryDate: ''
  });

  const { userInfo } = useSelector((state) => state.auth);

  const fetchCoupons = async () => {
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
    const { data } = await axios.get('/api/coupons', config);
    setCoupons(data);
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.post('/api/coupons', formData, config);
      setShowModal(false);
      fetchCoupons();
      setFormData({ code: '', discountType: 'Percentage', discountValue: '', minAmount: '', expiryDate: '' });
      toast.success('Promotion activated');
    } catch (error) {
      toast.error('Failed to create coupon');
    } finally {
      setLoading(false);
    }
  };



  const deleteCoupon = async (id) => {
    if (window.confirm('Delete this coupon?')) {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.delete(`/api/coupons/${id}`, config);
      fetchCoupons();
    }
  };

  return (
    <div className="px-12 py-10">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-5xl serif mb-4 text-black">Promotions</h2>
          <p className="text-muted text-xs uppercase tracking-widest font-bold">Coupons & Discounts</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="luxury-btn flex items-center gap-2"
        >
          <Plus size={14} /> New Coupon
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {coupons.map((coupon) => (
          <motion.div 
            layout
            key={coupon._id} 
            className="bg-white border border-border p-8 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => deleteCoupon(coupon._id)} className="text-muted hover:text-gold transition-colors">
                <Trash2 size={18} />
              </button>
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-black flex items-center justify-center text-white group-hover:bg-gold transition-colors duration-500">
                <Ticket size={24} />
              </div>
              <div>
                <h4 className="text-2xl font-bold tracking-tighter serif">{coupon.code}</h4>
                <p className="text-[10px] uppercase font-bold text-gold">
                  {coupon.discountType === 'Percentage' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
                </p>
                {coupon.minAmount > 0 && (
                  <p className="text-[9px] text-muted uppercase mt-1">Min. Spend: ₹{coupon.minAmount}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 text-muted text-xs border-t border-border pt-4">
              <Calendar size={14} className="text-gold/50" />
              <span>Expires: {new Date(coupon.expiryDate).toLocaleDateString()}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] flex items-center justify-center px-4"
          >
            <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setShowModal(false)} />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative bg-white border border-border p-12 max-w-md w-full shadow-2xl"
            >
              <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-muted hover:text-gold transition-colors">
                <X size={24} />
              </button>

              <h3 className="text-3xl serif mb-8 text-black">New Promotion</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-muted mb-2">Coupon Code</label>
                  <input 
                    className="luxury-input w-full uppercase" 
                    value={formData.code} 
                    onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})} 
                    placeholder="E.G. VSR500"
                    required 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-muted mb-2">Type</label>
                    <select 
                      className="luxury-input w-full"
                      value={formData.discountType}
                      onChange={(e) => setFormData({...formData, discountType: e.target.value})}
                    >
                      <option value="Percentage">Percentage (%)</option>
                      <option value="Fixed">Fixed Amount (₹)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-muted mb-2">Value</label>
                    <input 
                      type="number" 
                      className="luxury-input w-full" 
                      value={formData.discountValue} 
                      onChange={(e) => setFormData({...formData, discountValue: e.target.value})} 
                      required 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-muted mb-2">Min. Spend (Optional)</label>
                  <input 
                    type="number" 
                    className="luxury-input w-full" 
                    placeholder="E.G. 1000"
                    value={formData.minAmount} 
                    onChange={(e) => setFormData({...formData, minAmount: e.target.value})} 
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-muted mb-2">Expiry Date</label>
                  <input 
                    type="date" 
                    className="luxury-input w-full" 
                    value={formData.expiryDate} 
                    onChange={(e) => setFormData({...formData, expiryDate: e.target.value})} 
                    required 
                  />
                </div>
                <button type="submit" disabled={loading} className="w-full luxury-btn py-4 mt-4">
                  {loading ? 'Creating...' : 'Activate Coupon'}
                </button>

              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCoupons;

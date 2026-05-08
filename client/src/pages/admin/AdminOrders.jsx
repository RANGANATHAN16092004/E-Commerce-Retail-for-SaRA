import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import { Package, Truck, CheckCircle, Clock, Search, Filter, XCircle, FileText } from 'lucide-react';
import { toast } from 'react-toastify';
import CustomModal from '../../components/common/CustomModal';
import { generateInvoice } from '../../utils/invoiceGenerator';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterStatus, setFilterStatus] = useState('All');
  const { userInfo } = useSelector((state) => state.auth);

  const [modalConfig, setModalConfig] = useState({ 
    isOpen: false, 
    onConfirm: () => {}, 
    title: '', 
    message: '', 
    type: 'warning' 
  });

  const fetchOrders = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.get('/api/orders', config);
      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put(`/api/orders/${id}/status`, { status }, config);
      toast.success(`Order status updated to ${status}`);
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const updatePayment = async (id, isPaid) => {
    setModalConfig({
      isOpen: true,
      title: 'Verify Payment Transaction',
      message: `Are you sure you want to mark this acquisition as ${isPaid ? 'PAID (Verified)' : 'UNPAID (Pending)'}? This will update the financial records for this order.`,
      type: isPaid ? 'success' : 'warning',
      onConfirm: async () => {
        try {
          const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
          await axios.put(`/api/orders/${id}/pay`, { isPaid }, config);
          toast.success(`Payment marked as ${isPaid ? 'Paid' : 'Unpaid'}`);
          fetchOrders();
        } catch (error) {
          toast.error('Failed to update payment status');
        }
      }
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Processing': return <Clock size={16} className="text-blue-500" />;
      case 'Shipped': return <Truck size={16} className="text-purple-500" />;
      case 'Delivered': return <CheckCircle size={16} className="text-green-500" />;
      case 'Cancelled': return <XCircle size={16} className="text-red-500" />;
      default: return <Package size={16} className="text-gray-500" />;
    }
  };

  if (loading) return <div className="p-20 text-center">Loading Orders...</div>;

  return (
    <div className="px-12 py-10">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-5xl serif mb-4 text-black">Order Desk</h2>
          <p className="text-muted text-xs uppercase tracking-widest font-bold">Fulfillment & Tracking</p>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex flex-col gap-1">
            <p className="text-[8px] uppercase font-bold tracking-widest text-muted">Sort By</p>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="luxury-input py-2 text-[10px] w-40"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="priceHigh">Price: High to Low</option>
              <option value="priceLow">Price: Low to High</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-[8px] uppercase font-bold tracking-widest text-muted">Search</p>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={14} />
              <input 
                type="text" 
                placeholder="ID, Customer..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="luxury-input pl-10 py-2 text-[10px] w-48" 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tags */}
      <div className="flex gap-3 mb-8 border-b border-border pb-6 overflow-x-auto no-scrollbar">
        {['All', 'Today', 'Paid', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((tag) => (
          <button
            key={tag}
            onClick={() => setFilterStatus(tag)}
            className={`px-6 py-2 text-[10px] font-bold uppercase tracking-[0.15em] border transition-all whitespace-nowrap ${
              filterStatus === tag 
                ? 'bg-black text-white border-black shadow-lg' 
                : 'bg-white text-muted border-border hover:border-black hover:text-black'
            }`}
          >
            {tag === 'Cancelled' ? 'Payment Failed' : tag}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {orders
          .filter(order => {
            const matchesSearch = 
              order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
              order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
            
            if (filterStatus === 'All') return matchesSearch;
            if (filterStatus === 'Today') {
              const today = new Date().toLocaleDateString();
              return matchesSearch && new Date(order.createdAt).toLocaleDateString() === today;
            }
            if (filterStatus === 'Paid') return matchesSearch && order.isPaid;
            if (filterStatus === 'Pending') return matchesSearch && !order.isPaid && order.status !== 'Cancelled';
            return matchesSearch && order.status === filterStatus;
          })
          .sort((a, b) => {
            if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
            if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
            if (sortBy === 'priceHigh') return b.totalPrice - a.totalPrice;
            if (sortBy === 'priceLow') return a.totalPrice - b.totalPrice;
            return 0;
          })
          .map((order) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            key={order._id} 
            className="bg-white border border-border p-8 group transition-all hover:shadow-lg"
          >
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-6">
                <div className="p-4 bg-accent/50 rounded-sm">
                  <Package size={24} className="text-black" />
                </div>
                <div>
                  <Link to={`/order/${order._id}`} className="text-lg font-bold hover:text-secondary transition-colors">
                    Order #{order._id.slice(-6).toUpperCase()}
                  </Link>
                  <p className="text-muted text-[10px] uppercase tracking-widest">

                    {new Date(order.createdAt).toLocaleDateString()} • {order.user?.name}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-serif mb-1 text-black">₹{order.totalPrice}</p>
                <div className="flex gap-2 items-center">
                  <button 
                    onClick={() => generateInvoice(order)}
                    className="p-2 border border-black/10 hover:bg-black hover:text-white transition-all rounded-sm group"
                    title="Download Invoice"
                  >
                    <FileText size={16} />
                  </button>
                  <span className={`text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full ${order.isPaid ? 'bg-green-100 text-green-600' : (order.status === 'Cancelled' ? 'bg-red-200 text-red-700' : 'bg-red-100 text-red-600')}`}>
                    {order.paymentMethod === 'COD' ? 'COD - ' : ''}
                    {order.isPaid ? 'Paid' : (order.status === 'Cancelled' ? 'Payment Failed' : 'Pending')}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center pt-8 border-t border-border">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-muted mb-2">Shipping To</p>
                <p className="text-xs">{order.shippingAddress.address}, {order.shippingAddress.city}</p>
                <p className="text-xs text-muted mt-1">{order.shippingAddress.phone}</p>
              </div>

              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-muted mb-2">Order Status</p>
                <div className="flex items-center gap-2">
                  {getStatusIcon(order.status)}
                  <span className="text-xs font-bold uppercase tracking-wider text-black">{order.status}</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <p className="text-[8px] uppercase font-bold tracking-[0.1em] text-muted">Fulfillment</p>
                  <select 
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    value={order.status}
                    disabled={order.status === 'Delivered' || order.status === 'Cancelled'}
                    className={`luxury-input flex-1 py-2 text-xs ${(order.status === 'Delivered' || order.status === 'Cancelled') ? 'opacity-50 cursor-not-allowed bg-accent/50' : ''}`}
                  >
                    <option value="Processing">Set Processing</option>
                    <option value="Shipped">Set Shipped</option>
                    <option value="Delivered">Set Delivered</option>
                    {order.status === 'Cancelled' && <option value="Cancelled">Cancelled</option>}
                  </select>
                </div>

                {order.paymentMethod === 'COD' && (
                  <div className="flex flex-col gap-1">
                    <p className="text-[8px] uppercase font-bold tracking-[0.1em] text-muted">Payment Manual Control (COD)</p>
                    <select 
                      onChange={(e) => updatePayment(order._id, e.target.value === 'true')}
                      value={order.isPaid.toString()}
                      className="luxury-input flex-1 py-2 text-[10px] bg-accent/20 border-gold/20"
                    >
                      <option value="false">Mark as Failed/Pending</option>
                      <option value="true">Mark as Paid (Success)</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <CustomModal 
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        confirmText="Confirm Action"
        cancelText="Discard"
      />
    </div>
  );
};

export default AdminOrders;

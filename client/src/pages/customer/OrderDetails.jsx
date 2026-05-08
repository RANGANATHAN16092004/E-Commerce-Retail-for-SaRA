import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle, Clock, MapPin, CreditCard, ArrowLeft, ExternalLink, XCircle, FileText } from 'lucide-react';
import { toast } from 'react-toastify';
import CustomModal from '../../components/common/CustomModal';
import { generateInvoice } from '../../utils/invoiceGenerator';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);

  const fetchOrderDetails = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.get(`/api/orders/${id}`, config);
      setOrder(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [id, userInfo]);

  const handleCancel = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put(`/api/orders/${id}/cancel`, {}, config);
      toast.success('Order cancelled successfully');
      fetchOrderDetails();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    }
  };

  const getStatusStep = (status) => {
    const steps = ['Processing', 'Shipped', 'Delivered'];
    const currentIndex = steps.indexOf(status);
    return currentIndex;
  };

  if (loading) return <div className="p-20 text-center text-muted italic">Decrypting order manifest...</div>;
  if (!order) return <div className="p-20 text-center">Order not found.</div>;

  return (
    <div className="px-12 py-20 max-w-5xl mx-auto">
      <Link to={userInfo.role === 'admin' ? '/admin/orders' : '/profile'} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted hover:text-gold mb-12 transition-colors">
        <ArrowLeft size={14} /> Back to Desk
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
        <div>
          <h2 className="text-5xl md:text-6xl serif text-black mb-4">Order Manifest</h2>
          <p className="text-muted text-[10px] uppercase font-bold tracking-widest">
            Ref. #{order._id.toUpperCase()} • {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="flex gap-4 items-center">
          <button 
            onClick={() => generateInvoice(order)}
            className="flex items-center gap-2 px-6 py-3 border border-black text-black font-bold uppercase text-[10px] tracking-[0.2em] hover:bg-black hover:text-white transition-all group"
          >
            <FileText size={14} className="group-hover:scale-110 transition-transform" /> Download Invoice
          </button>
          <div className={`px-6 py-3 border font-bold uppercase text-[10px] tracking-[0.2em] ${order.isPaid ? 'border-green-500 text-green-600' : (order.status === 'Cancelled' ? 'border-red-500 text-red-600 bg-red-50' : 'border-gold text-gold bg-gold/5')}`}>
            {order.paymentMethod === 'COD' ? 'COD - ' : ''}
            {order.isPaid ? 'Payment Verified' : (order.status === 'Cancelled' ? 'Payment Failed' : 'Payment Pending')}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative flex justify-between mb-24 px-4">
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-border -translate-y-1/2 z-0" />
        {['Processing', 'Shipped', 'Delivered'].map((step, i) => (
          <div key={step} className="relative z-10 flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-700 ${getStatusStep(order.status) >= i ? 'bg-gold border-gold text-white shadow-lg shadow-gold/20' : 'bg-white border-border text-muted'}`}>
              {i === 0 && <Clock size={16} />}
              {i === 1 && <Truck size={16} />}
              {i === 2 && <CheckCircle size={16} />}
            </div>
            <p className={`absolute -bottom-10 whitespace-nowrap text-[9px] font-bold uppercase tracking-widest ${getStatusStep(order.status) >= i ? 'text-gold' : 'text-muted'}`}>
              {step}
            </p>
          </div>
        ))}
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-12">
          {/* Order Items */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium border-b border-border pb-4 uppercase tracking-widest text-xs">Aquisition List</h3>
            {order.orderItems.map((item) => (
              <div key={item.product} className="flex gap-8 group">
                <div className="w-24 h-32 bg-accent overflow-hidden">
                  <img src={item.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="flex-1 flex flex-col justify-between py-2">
                  <div>
                    <h4 className="text-lg font-medium">{item.title}</h4>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-muted mt-1">QTY: {item.qty} • Price: ₹{item.price}</p>
                  </div>
                  <Link to={`/product/${item.product}`} className="text-[10px] uppercase font-bold tracking-widest border-b border-black w-fit pb-1 flex items-center gap-2">
                    View Product <ExternalLink size={10} />
                  </Link>
                </div>
                <div className="text-right py-2">
                  <p className="text-xl font-serif">₹{(item.qty * item.price).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1 space-y-12">
          {/* Shipping Detail */}
          <div className="bg-accent/30 p-8 space-y-6">
            <div>
              <h4 className="text-[10px] uppercase font-bold tracking-widest text-muted mb-4 flex items-center gap-2">
                <MapPin size={12} /> Shipping Destination
              </h4>
              <p className="text-sm font-medium">{order.user?.name}</p>
              <p className="text-xs text-muted leading-relaxed mt-2">
                {order.shippingAddress.address}<br />
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
                {order.shippingAddress.country}
              </p>
              <p className="text-xs font-bold mt-4">T: {order.shippingAddress.phone}</p>
            </div>

            <div className="pt-6 border-t border-black/5">
              <h4 className="text-[10px] uppercase font-bold tracking-widest text-muted mb-4 flex items-center gap-2">
                <CreditCard size={12} /> Transaction Summary
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted">Subtotal</span>
                  <span>₹{order.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted">Shipping</span>
                  <span className="text-green-600 font-bold uppercase text-[8px]">Complimentary</span>
                </div>
                <div className="flex justify-between text-lg font-serif pt-4 border-t border-black/5">
                  <span>Grand Total</span>
                  <span>₹{order.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            {order.status === 'Processing' && !order.isPaid && (
              <button 
                onClick={() => setShowCancelModal(true)}
                className="w-full mt-8 py-4 border border-red-200 text-red-600 text-[10px] font-bold uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2 group"
              >
                <XCircle size={14} className="group-hover:rotate-90 transition-transform duration-500" /> Cancel Order
              </button>
            )}
          </div>
        </div>
      </div>

      <CustomModal 
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancel}
        title="Revoke Aquisition?"
        message="Are you sure you want to cancel this order? This action will remove the pieces from your order history and cannot be undone."
        confirmText="Yes, Cancel Order"
        cancelText="No, Keep It"
      />
    </div>
  );
};

export default OrderDetails;

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import axios from 'axios';
import { motion } from 'framer-motion';
import { User, Package, MapPin, ChevronRight, Clock, CheckCircle, Truck, Heart, XCircle, Search, Filter } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { removeFromWishlist } from '../../redux/slices/wishlistSlice';
import { addToCart } from '../../redux/slices/cartSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { wishlistItems } = useSelector((state) => state.wishlist);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterStatus, setFilterStatus] = useState('All');


  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get('/api/orders/myorders', config);
        setOrders(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMyOrders();
  }, [userInfo]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Processing': return <Clock size={14} className="text-blue-500" />;
      case 'Shipped': return <Truck size={14} className="text-purple-500" />;
      case 'Delivered': return <CheckCircle size={14} className="text-green-500" />;
      case 'Cancelled': return <XCircle size={14} className="text-red-500" />;
      default: return <Package size={14} className="text-gray-500" />;
    }
  };

  return (
    <div className="px-12 py-20 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white border border-border p-8 text-center">
            <div className="w-20 h-20 bg-accent mx-auto mb-6 flex items-center justify-center text-black font-serif text-3xl">
              {userInfo?.name?.charAt(0) || 'U'}
            </div>
            <h3 className="text-xl serif text-black">{userInfo?.name || 'User'}</h3>
            <p className="text-muted text-[10px] uppercase font-bold tracking-widest mt-2">{userInfo.email}</p>
          </div>

          <nav className="space-y-3">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`w-full text-left p-5 transition-all text-[10px] font-bold uppercase tracking-widest flex justify-between items-center group ${activeTab === 'overview' ? 'bg-gold text-white shadow-lg shadow-gold/20' : 'bg-white border border-border hover:border-gold text-muted hover:text-gold'}`}
            >
              Account Overview <ChevronRight size={14} className={activeTab === 'overview' ? 'text-white' : 'text-muted group-hover:text-gold'} />
            </button>
            <button 
              onClick={() => setActiveTab('address')}
              className={`w-full text-left p-5 transition-all text-[10px] font-bold uppercase tracking-widest flex justify-between items-center group ${activeTab === 'address' ? 'bg-gold text-white shadow-lg shadow-gold/20' : 'bg-white border border-border hover:border-gold text-muted hover:text-gold'}`}
            >
              Address Book <ChevronRight size={14} className={activeTab === 'address' ? 'text-white' : 'text-muted group-hover:text-gold'} />
            </button>
            <button 
              onClick={() => setActiveTab('wishlist')}
              className={`w-full text-left p-5 transition-all text-[10px] font-bold uppercase tracking-widest flex justify-between items-center group ${activeTab === 'wishlist' ? 'bg-gold text-white shadow-lg shadow-gold/20' : 'bg-white border border-border hover:border-gold text-muted hover:text-gold'}`}
            >
              Saved Pieces <ChevronRight size={14} className={activeTab === 'wishlist' ? 'text-white' : 'text-muted group-hover:text-gold'} />
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex justify-between items-end mb-10 border-b border-border pb-6">
                <div>
                  <h2 className="text-4xl serif text-black">Order History</h2>
                  <p className="text-muted text-[10px] uppercase font-bold tracking-widest mt-2">Track your luxury purchases</p>
                </div>
                <div className="flex gap-4 items-center mb-1">
                   <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={12} />
                    <input 
                      type="text" 
                      placeholder="Search ID..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="luxury-input pl-9 py-2 text-[9px] w-32 border-none bg-accent/30" 
                    />
                  </div>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-[9px] font-bold uppercase tracking-widest bg-transparent border-none focus:ring-0 cursor-pointer text-muted hover:text-black transition-colors"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="priceHigh">Highest Price</option>
                  </select>
                </div>
              </div>

              {/* Filter Tags */}
              <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar pb-2">
                {['All', 'Today', 'Paid', 'Pending', 'Shipped', 'Delivered'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setFilterStatus(tag)}
                    className={`px-4 py-2 text-[8px] font-bold uppercase tracking-widest border transition-all whitespace-nowrap ${
                      filterStatus === tag 
                        ? 'bg-black text-white border-black' 
                        : 'bg-white text-muted border-border hover:border-black hover:text-black'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {loading ? (
                <div className="p-20 text-center text-muted italic animate-pulse uppercase tracking-[0.2em] text-[10px]">Retrieving your orders...</div>
              ) : orders.length === 0 ? (
                <div className="p-20 text-center border border-dashed border-border bg-accent/30">
                  <Package size={48} className="mx-auto mb-6 text-muted opacity-20" />
                  <p className="text-muted italic">You haven't placed any orders yet.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders
                    .filter(order => {
                      const matchesSearch = order._id.toLowerCase().includes(searchTerm.toLowerCase());
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
                      return 0;
                    })
                    .map((order) => (
                    <motion.div 
                      key={order._id} 
                      className="bg-white border border-border p-8 flex flex-col md:flex-row justify-between gap-8 group hover:border-gold hover:shadow-2xl transition-all duration-500"
                    >
                      <div className="flex gap-6">
                        <div className="w-24 h-32 bg-accent overflow-hidden border border-border group-hover:border-gold/30 transition-colors">
                          <img src={order.orderItems[0].image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                        </div>
                        <div className="flex flex-col justify-center">
                          <p className="text-[9px] uppercase font-bold tracking-widest text-muted mb-2">Order #{order._id.slice(-8).toUpperCase()}</p>
                          <h4 className="text-lg font-medium mb-4">
                            {order.orderItems.length} {order.orderItems.length === 1 ? 'Handcrafted Piece' : 'Handcrafted Pieces'}
                          </h4>
                          <div className={`flex items-center gap-2 px-3 py-1 rounded-full w-fit ${order.status === 'Cancelled' ? 'bg-red-50' : 'bg-accent'}`}>
                            {getStatusIcon(order.status)}
                            <span className={`text-[8px] uppercase font-bold tracking-widest ${order.status === 'Cancelled' ? 'text-red-600' : 'text-black'}`}>
                              {order.status === 'Cancelled' ? 'Payment Failed' : order.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col justify-between items-end text-right">
                        <div>
                          <p className="text-2xl font-serif text-black mb-1">₹{order.totalPrice.toLocaleString()}</p>
                          <p className="text-[10px] uppercase font-bold tracking-widest text-muted">
                            Placed on {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Link 
                          to={`/order/${order._id}`}
                          className="luxury-btn py-3 px-6 text-[9px] flex items-center gap-2"
                        >
                          Details <ChevronRight size={12} />
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}


          {activeTab === 'address' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-4xl serif text-black mb-10">Address Book</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="border border-dashed border-border p-10 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-black transition-all">
                  <div className="w-12 h-12 bg-accent flex items-center justify-center rounded-full mb-4 group-hover:bg-black group-hover:text-white transition-all">
                    <MapPin size={20} />
                  </div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-muted">Add New Address</p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'wishlist' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-4xl serif text-black mb-10">Saved Pieces</h2>
              {wishlistItems.length === 0 ? (
                <div className="p-20 text-center border border-dashed border-border">
                  <Heart size={48} className="mx-auto mb-6 text-muted opacity-20" />
                  <p className="text-muted italic">Your wishlist is currently empty.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {wishlistItems.map((item) => (
                    <div key={item._id} className="bg-white border border-border p-6 flex gap-6 group hover:shadow-lg transition-all">
                      <div className="w-24 h-32 bg-accent overflow-hidden">
                        <img src={item.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="text-sm font-medium mb-1">{item.title}</h4>
                          <p className="text-lg font-serif">₹{item.price}</p>
                        </div>
                        <div className="flex gap-4">
                          <button 
                            onClick={() => dispatch(addToCart({...item, qty: 1}))}
                            className="text-[10px] uppercase font-bold tracking-widest border-b border-black pb-1"
                          >
                            Add to Bag
                          </button>
                          <button 
                            onClick={() => dispatch(removeFromWishlist(item._id))}
                            className="text-[10px] uppercase font-bold tracking-widest text-red-500"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

        </div>

      </div>
    </div>
  );
};

export default Profile;

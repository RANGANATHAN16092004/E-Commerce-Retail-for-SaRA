import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingBag, Heart, User, LogOut, Menu, X, ChevronRight, Home, Grid, Package, Tag, List } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { logout } from '../../redux/slices/authSlice';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    setIsMenuOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: <Home size={18} /> },
    { name: 'Shop', path: '/shop', icon: <ShoppingBag size={18} /> },
    { name: 'Collections', path: '/collections', icon: <Package size={18} /> },
  ];

  const adminLinks = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <Grid size={18} /> },
    { name: 'Products', path: '/admin/products', icon: <Package size={18} /> },
    { name: 'Orders', path: '/admin/orders', icon: <List size={18} /> },
    { name: 'Coupons', path: '/admin/coupons', icon: <Tag size={18} /> },
  ];

  return (
    <>
      <nav className="fixed top-0 w-full z-[100] bg-white/90 backdrop-blur-md border-b border-border px-4 md:px-12 py-4 md:py-6 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4 md:gap-10">
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="md:hidden p-2 -ml-2 text-black hover:text-gold transition-colors"
          >
            <Menu size={24} />
          </button>
          
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <img src="/logo.png" alt="VSR Logo" className="h-10 md:h-14 w-auto object-contain" />
          </Link>

          <div className="hidden md:flex gap-10 text-[10px] font-bold uppercase tracking-widest text-muted">
            {navLinks.map(link => (
              <Link 
                key={link.path} 
                to={link.path} 
                className={`hover:text-gold transition-all duration-300 relative py-1 ${location.pathname === link.path ? 'text-gold' : ''}`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gold" />
                )}
              </Link>
            ))}
            {userInfo?.role === 'admin' && (
              <div className="flex gap-10 border-l border-border pl-10">
                {adminLinks.map(link => (
                  <Link 
                    key={link.path} 
                    to={link.path} 
                    className={`hover:text-gold transition-all duration-300 ${location.pathname === link.path ? 'text-gold' : ''}`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-8">
          <Link to="/wishlist" className="hover:text-gold transition-colors text-black hidden sm:block">
            <Heart size={20} />
          </Link>
          <Link to="/cart" className="relative hover:text-gold transition-colors text-black">
            <ShoppingBag size={20} />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-lg shadow-gold/30">
                {cartItems.length}
              </span>
            )}
          </Link>
          
          {userInfo ? (
            <div className="flex items-center gap-4">
              <Link to="/profile" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest hover:text-gold transition-colors text-black">
                <div className="w-8 h-8 bg-accent flex items-center justify-center rounded-full border border-border">
                  <User size={16} />
                </div>
                <span className="hidden lg:inline">{userInfo.name ? userInfo.name.split(' ')[0] : 'Account'}</span>
              </Link>
              <button onClick={handleLogout} className="hidden md:block text-muted hover:text-gold transition-colors">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="luxury-btn py-2.5 px-8 text-[9px]">Login</Link>
          )}
        </div>
      </nav>

      {/* Mobile Menu Drawer - Premium Motion Version */}
      <AnimatePresence>
        {isMenuOpen && (
          <div className="fixed inset-0 z-[200] md:hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 left-0 h-full w-[85%] max-w-sm bg-white shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-border flex justify-between items-center bg-accent/30">
                <Link to="/" onClick={() => setIsMenuOpen(false)}>
                  <img src="/logo.png" alt="VSR Logo" className="h-10 w-auto object-contain" />
                </Link>
                <button 
                  onClick={() => setIsMenuOpen(false)} 
                  className="p-2 hover:bg-white rounded-full transition-all active:scale-90"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-8 no-scrollbar">
                <div className="px-6 space-y-2">
                  <p className="text-[9px] uppercase font-bold tracking-[0.3em] text-muted mb-4 opacity-50">Navigation</p>
                  {navLinks.map((link, idx) => (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + idx * 0.05 }}
                      key={link.path}
                    >
                      <Link 
                        to={link.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center justify-between p-4 transition-all rounded-sm group active:bg-accent ${location.pathname === link.path ? 'bg-gold/5 border-l-2 border-gold' : 'hover:bg-accent/50'}`}
                      >
                        <div className="flex items-center gap-4">
                          <span className={`transition-colors ${location.pathname === link.path ? 'text-gold' : 'text-muted group-hover:text-gold'}`}>{link.icon}</span>
                          <span className={`text-xs font-bold uppercase tracking-widest ${location.pathname === link.path ? 'text-black' : 'text-muted group-hover:text-black'}`}>{link.name}</span>
                        </div>
                        <ChevronRight size={14} className="opacity-30 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {userInfo?.role === 'admin' && (
                  <div className="px-6 mt-10 space-y-2">
                    <p className="text-[9px] uppercase font-bold tracking-[0.3em] text-gold mb-4">Command Center</p>
                    {adminLinks.map((link, idx) => (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + idx * 0.05 }}
                        key={link.path}
                      >
                        <Link 
                          to={link.path}
                          onClick={() => setIsMenuOpen(false)}
                          className={`flex items-center justify-between p-4 transition-all rounded-sm group active:bg-accent ${location.pathname === link.path ? 'bg-gold/10 border-l-2 border-gold' : 'hover:bg-gold/5'}`}
                        >
                          <div className="flex items-center gap-4">
                            <span className="text-gold">{link.icon}</span>
                            <span className="text-xs font-bold uppercase tracking-widest">{link.name}</span>
                          </div>
                          <ChevronRight size={14} className="opacity-30 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                )}

                <div className="px-6 mt-10 space-y-2">
                  <p className="text-[9px] uppercase font-bold tracking-[0.3em] text-muted mb-4 opacity-50">Identity</p>
                  <Link 
                    to="/profile" 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-4 p-4 hover:bg-accent transition-all rounded-sm active:scale-[0.98]"
                  >
                    <User size={18} className="text-muted" />
                    <span className="text-xs font-bold uppercase tracking-widest">My Profile</span>
                  </Link>
                  <Link 
                    to="/wishlist" 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-4 p-4 hover:bg-accent transition-all rounded-sm active:scale-[0.98]"
                  >
                    <Heart size={18} className="text-muted" />
                    <span className="text-xs font-bold uppercase tracking-widest">Wishlist</span>
                  </Link>
                </div>
              </div>

              {userInfo && (
                <div className="p-6 border-t border-border bg-accent/10">
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-3 p-4 bg-black text-white hover:bg-gold transition-all text-xs font-bold uppercase tracking-widest shadow-xl shadow-black/10 active:scale-95"
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;

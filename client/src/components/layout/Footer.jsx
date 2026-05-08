import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <footer className="bg-[#F5F5F5] text-black pt-16 pb-8 px-8 mt-20 border-t border-border">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        
        {/* Brand Section */}
        <div className="space-y-6">
          <img src="/logo.png" alt="VSR Logo" className="h-10 w-auto object-contain" />
          <p className="text-black text-xs leading-relaxed font-light max-w-xs">
            Crafting timeless elegance and preserving heritage. Every thread tells a story of luxury.
          </p>
          <div className="flex flex-col gap-4">
            <a href="https://www.instagram.com/sarulathavasantha?igsh=MW95ank1emNhd3ljdQ==" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
              <div className="p-2 bg-white rounded-full group-hover:bg-gold group-hover:text-white transition-all shadow-sm text-black flex items-center justify-center w-8 h-8">
                <FontAwesomeIcon icon={faInstagram} size="sm" />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-black group-hover:text-gold transition-colors">Instagram</span>
            </a>
            <a href="https://chat.whatsapp.com/FVWt6fXqKQh91t4cXj1J73" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
              <div className="p-2 bg-white rounded-full group-hover:bg-gold group-hover:text-white transition-all shadow-sm text-black flex items-center justify-center w-8 h-8">
                <FontAwesomeIcon icon={faWhatsapp} size="sm" />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-black group-hover:text-gold transition-colors">WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-6">
          <h4 className="text-[9px] font-bold uppercase tracking-[0.2em] text-gold">Navigation</h4>
          <ul className="space-y-3 text-xs text-black font-light">
            <li><Link to="/shop" className="hover:text-gold transition-colors">Shop All</Link></li>
            <li><Link to="/collections" className="hover:text-gold transition-colors">Collections</Link></li>
            <li><Link to="/wishlist" className="hover:text-gold transition-colors">Wishlist</Link></li>
            <li><Link to="/profile" className="hover:text-gold transition-colors">Account</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-6">
          <h4 className="text-[9px] font-bold uppercase tracking-[0.2em] text-gold">Connect</h4>
          <ul className="space-y-4 text-xs text-black font-light">
            <li className="flex items-start gap-3">
              <MapPin size={14} className="text-gold mt-0.5" />
              <div>
                <span className="block text-black/50 text-[9px] uppercase font-bold mb-1">Visit Us</span>
                <span className="text-[11px]">Salem, Tamilnadu - 636104</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Mail size={14} className="text-gold mt-0.5" />
              <div>
                <span className="block text-black/50 text-[9px] uppercase font-bold mb-1">Email</span>
                <a href="mailto:vranganathan9@gmail.com" className="hover:text-gold transition-colors text-[11px]">vranganathan9@gmail.com</a>
              </div>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="space-y-6">
          <h4 className="text-[9px] font-bold uppercase tracking-[0.2em] text-gold">Membership</h4>
          <p className="text-xs text-black font-light">Join for exclusive collection previews.</p>
          <div className="relative">
            <input 
              type="email" 
              placeholder="Email Address" 
              className="w-full bg-transparent border-b border-black/20 py-2 text-xs focus:outline-none focus:border-gold transition-colors text-black"
            />
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[9px] text-black uppercase tracking-widest font-bold">
          © 2026 VSR LUXURY.
        </p>
        <div className="flex gap-6 text-[9px] text-black uppercase tracking-widest font-bold">
          <a href="#" className="hover:text-gold transition-colors">Privacy</a>
          <a href="#" className="hover:text-gold transition-colors">Terms</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

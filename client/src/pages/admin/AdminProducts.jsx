import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Trash2, Edit2, Package, Image as ImageIcon } from 'lucide-react';
import { toast } from 'react-toastify';

import CustomModal from '../../components/common/CustomModal';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [modalConfig, setModalConfig] = useState({ 
    isOpen: false, 
    onConfirm: () => {}, 
    title: '', 
    message: '', 
    type: 'warning' 
  });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    stock: '',
    sizes: '',
    colors: '',
    images: ''
  });

  const { userInfo } = useSelector((state) => state.auth);

  const fetchProducts = async () => {
    const { data } = await axios.get('/api/products');
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check limit
    const currentImages = formData.images ? formData.images.split(',').filter(i => i !== '') : [];
    if (currentImages.length >= 8) {
      toast.error('Maximum 8 images allowed per product');
      return;
    }

    const formDataUpload = new FormData();
    formDataUpload.append('image', file);
    setUploading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.post('/api/upload', formDataUpload, config);


      setFormData((prev) => ({
        ...prev,
        images: prev.images ? `${prev.images},${data.url}` : data.url,
      }));
      setUploading(false);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error(error);
      setUploading(false);
      toast.error('Image upload failed');
    }
  };


  const removeImage = (index) => {
    const currentImages = formData.images.split(',');
    currentImages.splice(index, 1);
    setFormData({ ...formData, images: currentImages.join(',') });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const productData = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        sizes: formData.sizes ? formData.sizes.split(',').map(s => s.trim()).filter(s => s !== '') : [],
        colors: formData.colors ? formData.colors.split(',').map(c => c.trim()).filter(c => c !== '') : [],
        images: formData.images.split(','),
        ratings: { average: 0, count: 0 }
      };


      if (isEditing) {
        await axios.put(`/api/products/${currentId}`, productData, config);
        toast.success('Product updated');
      } else {
        await axios.post('/api/products', productData, config);
        toast.success('Product created');
      }

      setShowModal(false);
      setIsEditing(false);
      setCurrentId(null);
      fetchProducts();
      setFormData({ title: '', description: '', category: '', price: '', stock: '', sizes: '', colors: '', images: '' });
    } catch (error) {
      toast.error('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      title: product.title,
      description: product.description,
      category: product.category,
      price: product.price,
      stock: product.stock,
      sizes: product.sizes.join(','),
      colors: product.colors.join(','),
      images: product.images.join(',')
    });
    setCurrentId(product._id);
    setIsEditing(true);
    setShowModal(true);
  };

  const openAddModal = () => {
    setFormData({ title: '', description: '', category: '', price: '', stock: '', sizes: '', colors: '', images: '' });
    setIsEditing(false);
    setCurrentId(null);
    setShowModal(true);
  };


  const deleteProduct = async (id) => {
    setModalConfig({
      isOpen: true,
      title: 'Remove Piece from Collection?',
      message: 'Are you sure you want to delete this product? This action will permanently remove it from the boutique and cannot be undone.',
      type: 'warning',
      onConfirm: async () => {
        try {
          const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
          await axios.delete(`/api/products/${id}`, config);
          toast.success('Product removed successfully');
          fetchProducts();
        } catch (error) {
          toast.error('Failed to delete product');
        }
      }
    });
  };

  return (
    <div className="px-12 py-10">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-5xl serif mb-4 text-black">Inventory</h2>
          <p className="text-muted text-xs uppercase tracking-widest font-bold">Manage your collections</p>
        </div>
        <button 
          onClick={openAddModal}
          className="luxury-btn flex items-center gap-2"
        >
          <Plus size={14} /> New Piece
        </button>

      </div>

      <div className="grid grid-cols-1 gap-6">
        {products.map((product) => (
          <div key={product._id} className="glass p-6 flex items-center justify-between group">
            <div className="flex items-center gap-6">
              <div className="w-16 h-20 bg-white/5 overflow-hidden">
                <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="text-lg font-medium">{product.title}</h4>
                <p className="text-muted text-xs uppercase tracking-widest">{product.category} • ₹{product.price} • {product.stock} in stock</p>
              </div>
            </div>
            <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => handleEdit(product)} className="p-2 text-muted hover:text-gold transition-colors"><Edit2 size={18} /></button>
              <button onClick={() => deleteProduct(product._id)} className="p-2 text-muted hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Product Modal */}
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
              className="relative bg-white border border-border p-10 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-muted hover:text-gold transition-colors">
                <X size={24} />
              </button>

              <h3 className="text-3xl serif mb-8">{isEditing ? 'Edit Piece' : 'Add New Piece'}</h3>

              
              <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-muted mb-2">Title</label>
                  <input className="luxury-input w-full" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-muted mb-2">Description</label>
                  <textarea className="luxury-input w-full h-24" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-muted mb-2">Category</label>
                  <input 
                    list="categories"
                    className="luxury-input w-full" 
                    value={formData.category} 
                    onChange={(e) => setFormData({...formData, category: e.target.value})} 
                    required 
                  />
                  <datalist id="categories">
                    {[...new Set(products.map(p => p.category))].map(cat => (
                      <option key={cat} value={cat} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-muted mb-2">Price (₹)</label>
                  <input type="number" className="luxury-input w-full" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-muted mb-2">Stock</label>
                  <input type="number" className="luxury-input w-full" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} required />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-muted mb-2">Sizes (comma separated)</label>
                  <input className="luxury-input w-full" value={formData.sizes} onChange={(e) => setFormData({...formData, sizes: e.target.value})} placeholder="S, M, L" />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-muted mb-2">Colors (comma separated)</label>
                  <input className="luxury-input w-full" value={formData.colors} onChange={(e) => setFormData({...formData, colors: e.target.value})} placeholder="Black, White, Red" />
                </div>

                <div className="col-span-2">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-muted">Gallery (Max 8 Images)</label>
                    <div className="relative">
                      <input 
                        type="file" 
                        id="image-upload" 
                        className="hidden" 
                        onChange={handleUpload} 
                        accept="image/*"
                        disabled={formData.images.split(',').filter(i => i !== '').length >= 8}
                      />
                      <label 
                        htmlFor="image-upload" 
                        className={`text-[10px] font-bold uppercase tracking-widest cursor-pointer border border-border px-4 py-1 hover:bg-black hover:text-white transition-all flex items-center gap-2 ${(uploading || formData.images.split(',').filter(i => i !== '').length >= 8) ? 'opacity-50 pointer-events-none' : ''}`}
                      >
                        <ImageIcon size={12} /> {uploading ? 'Uploading...' : 'Add Image'}
                      </label>
                    </div>
                  </div>
                  
                  {/* Image Previews */}
                  <div className="grid grid-cols-4 md:grid-cols-8 gap-4 mb-4">
                    {formData.images.split(',').filter(img => img !== '').map((img, index) => (
                      <div key={index} className="relative aspect-square border border-border group overflow-hidden">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute inset-0 bg-red-600/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <input 
                    className="luxury-input w-full text-[10px]" 
                    value={formData.images} 
                    onChange={(e) => setFormData({...formData, images: e.target.value})} 
                    placeholder="Image URLs appear here..." 
                    required 
                  />
                </div>

                <button type="submit" disabled={loading} className="col-span-2 luxury-btn py-4 mt-4">
                  {loading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Piece' : 'Publish Piece')}
                </button>
              </form>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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

export default AdminProducts;

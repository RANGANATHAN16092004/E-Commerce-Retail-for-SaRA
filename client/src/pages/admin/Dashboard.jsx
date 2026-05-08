import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign, 
  TrendingUp, 
  PlusCircle,
  Settings
} from 'lucide-react';

import { Link } from 'react-router-dom';

import { 
  LineElement, 
  PointElement, 
  LinearScale, 
  Title, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  Chart as ChartJS 
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  LineElement, 
  PointElement, 
  LinearScale, 
  Title, 
  Tooltip, 
  Legend, 
  CategoryScale
);

const AdminDashboard = () => {

  const [stats, setStats] = useState({ 
    totalSales: 0, 
    totalOrders: 0, 
    totalCustomers: 0, 
    totalStock: 0,
    salesOverTime: [] 
  });
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get('/api/orders/analytics', config);
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      }
    };
    fetchStats();
  }, [userInfo]);

  const cards = [
    { title: 'Total Revenue', value: `₹${stats.totalSales.toLocaleString()}`, icon: DollarSign, color: 'text-green-500' },
    { title: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'text-blue-500' },
    { title: 'New Customers', value: stats.totalCustomers, icon: Users, color: 'text-purple-500' },
    { title: 'In Stock', value: stats.totalStock, icon: Package, color: 'text-secondary' },
  ];

  const chartData = {
    labels: stats.salesOverTime.map(d => d._id),
    datasets: [
      {
        label: 'Daily Sales (INR)',
        data: stats.salesOverTime.map(d => d.total),
        borderColor: '#C5A059',
        backgroundColor: 'rgba(197, 160, 89, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#C5A059',
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#000',
        titleFont: { size: 10, family: 'Inter' },
        bodyFont: { size: 12, family: 'Inter' },
        padding: 12,
        cornerRadius: 0
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0,0,0,0.05)' },
        ticks: { font: { size: 9 } }
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 9 } }
      }
    }
  };

  return (
    <div className="px-12 py-10">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-5xl serif mb-4 text-black">Admin Command</h2>
          <p className="text-muted text-xs uppercase tracking-widest font-bold">Performance Overview</p>
        </div>
        <div className="flex gap-4">

          <Link to="/admin/products" className="luxury-btn flex items-center gap-2">
            <PlusCircle size={14} /> New Product
          </Link>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {cards.map((card, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-8 flex items-center gap-6"
          >
            <div className={`p-4 bg-white/5 rounded-full ${card.color}`}>
              <card.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] text-muted uppercase font-bold tracking-widest mb-1">{card.title}</p>
              <h4 className="text-2xl font-bold">{card.value}</h4>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass p-10">
          <h3 className="text-2xl serif mb-8 flex items-center gap-3">
            <TrendingUp size={20} className="text-secondary" /> Sales Velocity
          </h3>
          <div className="h-[300px]">
            {stats.salesOverTime.length > 0 ? (
              <Line data={chartData} options={chartOptions} />
            ) : (
              <div className="h-full flex items-center justify-center text-muted italic text-xs uppercase tracking-widest border border-dashed border-border">
                Waiting for acquisition data...
              </div>
            )}
          </div>
        </div>
        
        <div className="glass p-10">
          <h3 className="text-2xl serif mb-8 flex items-center gap-3">
            <Settings size={20} className="text-secondary" /> Quick Actions
          </h3>
          <div className="space-y-4">
            <Link to="/admin/orders" className="w-full text-left p-4 hover:bg-black/5 transition-colors border-b border-border flex justify-between group">
              <span className="text-sm font-medium">Order Desk</span>
              <span className="text-black group-hover:translate-x-2 transition-transform">→</span>
            </Link>
            <Link to="/admin/products" className="w-full text-left p-4 hover:bg-black/5 transition-colors border-b border-border flex justify-between group">
              <span className="text-sm font-medium">Manage Inventory</span>
              <span className="text-black group-hover:translate-x-2 transition-transform">→</span>
            </Link>
            <Link to="/admin/coupons" className="w-full text-left p-4 hover:bg-black/5 transition-colors border-b border-border flex justify-between group">
              <span className="text-sm font-medium">Promotion Settings</span>
              <span className="text-black group-hover:translate-x-2 transition-transform">→</span>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

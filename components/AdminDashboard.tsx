import React, { useState, useEffect } from 'react';
import { Product, Order, OrderStatus } from '../types';
import { formatCurrency } from '../constants';
import { db } from '../services/db';
import { 
  LayoutDashboardIcon, PackageIcon, ClipboardListIcon, TagIcon,
  LogoutIcon, PlusIcon, SearchIcon, EditIcon, TrashIcon, CheckCircleIcon 
} from './Icons';

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  onLogout: () => void;
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (id: number) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  orders,
  onLogout,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateOrderStatus
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'brands'>('overview');
  const [productSearch, setProductSearch] = useState('');
  
  // Brands State
  const [brands, setBrands] = useState<string[]>([]);
  const [newBrandName, setNewBrandName] = useState('');

  // Product Form State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '', category: 'Áo thun', price: 0, image: '', description: '', brand: ''
  });

  useEffect(() => {
    setBrands(db.getBrands());
  }, []);

  // Calculate Stats
  const totalRevenue = orders.reduce((sum, order) => {
      // Only count valid orders (not cancelled)
      return order.status !== 'cancelled' ? sum + order.total : sum;
  }, 0);
  
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const recentOrders = [...orders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()));

  // --- Real Chart Data Calculation (Last 7 Days) ---
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        days.push(d);
    }
    return days;
  };

  const last7Days = getLast7Days();

  const chartData = last7Days.map(date => {
    const dateString = date.toLocaleDateString('vi-VN');
    const dayRevenue = orders
        .filter(o => o.date === dateString && o.status !== 'cancelled')
        .reduce((sum, o) => sum + o.total, 0);

    const dayOfWeek = date.getDay();
    const shortDay = dayOfWeek === 0 ? 'CN' : `T${dayOfWeek + 1}`;
    const longDay = dayOfWeek === 0 ? 'Chủ Nhật' : `Thứ ${dayOfWeek + 1}`;

    return {
        day: longDay,
        short: shortDay,
        value: dayRevenue,
        fullDate: dateString
    };
  });

  const maxChartValue = Math.max(...chartData.map(d => d.value), 1000000) * 1.1;
  const yAxisLabels = [0, 0.25, 0.5, 0.75, 1].map(ratio => Math.round(maxChartValue * ratio));

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setFormData(product);
    setIsProductModalOpen(true);
  };

  const handleAddNewClick = () => {
    setEditingProduct(null);
    setFormData({
        name: '', 
        brand: brands[0] || 'Nexa Core',
        category: 'Áo thun', 
        price: 0, 
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=60', 
        description: 'Mô tả sản phẩm...',
        colors: ['Đen', 'Trắng'],
        sizes: ['S', 'M', 'L']
    });
    setIsProductModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
        onUpdateProduct({ ...editingProduct, ...formData } as Product);
    } else {
        const newProduct = {
            ...formData,
            id: Date.now(),
            colors: formData.colors || ['Đen', 'Trắng'],
            sizes: formData.sizes || ['S', 'M', 'L']
        } as Product;
        onAddProduct(newProduct);
    }
    setIsProductModalOpen(false);
  };

  const handleAddBrand = (e: React.FormEvent) => {
      e.preventDefault();
      if(newBrandName.trim()) {
          const updated = db.addBrand(newBrandName.trim());
          setBrands(updated);
          setNewBrandName('');
      }
  };

  const handleDeleteBrand = (brand: string) => {
      if(confirm(`Bạn có chắc muốn xóa thương hiệu "${brand}"?`)) {
          const updated = db.deleteBrand(brand);
          setBrands(updated);
      }
  };

  const getStatusBadge = (status: OrderStatus) => {
    const styles = {
        pending: 'bg-yellow-100 text-yellow-800',
        processing: 'bg-blue-100 text-blue-800',
        shipped: 'bg-gray-800 text-white',
        delivered: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800'
    };
    return <span className={`px-2 py-1 text-xs font-bold uppercase tracking-wide ${styles[status]}`}>{status}</span>;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
      {/* Sidebar - Light & Clean */}
      <aside className="w-64 bg-white flex flex-col fixed h-full z-20 border-r border-gray-200">
        <div className="p-8 flex items-center space-x-3 border-b border-gray-100">
            <div className="w-8 h-8 bg-[#ED1C24] text-white flex flex-col items-center justify-center font-bold leading-none text-[8px] tracking-tighter">
                <span>NEXA</span><span>MODE</span>
            </div>
            <div>
                <h1 className="text-lg font-bold tracking-tight text-black">Nexa Mode</h1>
                <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Admin Portal</p>
            </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 mt-6">
          {[
            { id: 'overview', icon: LayoutDashboardIcon, label: 'Tổng quan' },
            { id: 'products', icon: PackageIcon, label: 'Sản phẩm' },
            { id: 'orders', icon: ClipboardListIcon, label: 'Đơn hàng' },
            { id: 'brands', icon: TagIcon, label: 'Thương hiệu' },
          ].map((item) => (
            <button 
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === item.id 
                    ? 'bg-black text-white' 
                    : 'text-gray-500 hover:bg-gray-100 hover:text-black'
                }`}
            >
                <item.icon className={`w-4 h-4`} />
                <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors text-sm font-medium"
          >
            <LogoutIcon className="w-4 h-4" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 lg:p-12 max-w-[1600px] mx-auto">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <header>
                    <h2 className="text-3xl font-bold text-black uppercase tracking-wide">Tổng quan</h2>
                    <p className="text-gray-500 mt-1">Hiệu suất kinh doanh hôm nay.</p>
                </header>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-500 font-bold text-xs uppercase tracking-wider">Doanh thu</h3>
                            <CheckCircleIcon className="w-5 h-5 text-gray-400" />
                        </div>
                        <p className="text-3xl font-bold text-black">{formatCurrency(totalRevenue)}</p>
                    </div>
                    <div className="bg-white p-6 border border-gray-200">
                         <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-500 font-bold text-xs uppercase tracking-wider">Đơn hàng</h3>
                            <ClipboardListIcon className="w-5 h-5 text-gray-400" />
                        </div>
                        <p className="text-3xl font-bold text-black">{totalOrders}</p>
                    </div>
                    <div className="bg-white p-6 border border-gray-200">
                         <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-500 font-bold text-xs uppercase tracking-wider">Sản phẩm</h3>
                            <PackageIcon className="w-5 h-5 text-gray-400" />
                        </div>
                        <p className="text-3xl font-bold text-black">{totalProducts}</p>
                    </div>
                </div>

                {/* Chart */}
                <div className="bg-white p-8 border border-gray-200">
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <h3 className="font-bold text-xl text-black">Biểu đồ doanh thu</h3>
                            <p className="text-gray-500 text-sm mt-1">Dữ liệu thực tế 7 ngày gần nhất</p>
                        </div>
                    </div>
                    
                    <div className="relative h-64 w-full">
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                            {yAxisLabels.reverse().map((label, i) => (
                                <div key={i} className="flex items-center w-full group">
                                    <span className="text-xs font-bold text-gray-400 w-16 text-right pr-6">
                                        {label >= 1000000 ? `${(label/1000000).toFixed(1)}M` : `${label/1000}k`}
                                    </span>
                                    <div className="flex-1 h-px bg-gray-100"></div>
                                </div>
                            ))}
                        </div>

                        <div className="absolute inset-0 flex items-end justify-between pl-20 pt-6 pb-0 pr-4">
                            {chartData.map((item, index) => {
                                const heightPercentage = (item.value / maxChartValue) * 100;
                                return (
                                    <div key={index} className="flex flex-col items-center justify-end h-full w-full group relative">
                                        <div className="w-full h-full flex items-end justify-center px-2">
                                            <div 
                                                style={{ height: `${heightPercentage}%` }} 
                                                className={`w-full max-w-[40px] transition-all duration-500 ease-out ${item.value > 0 ? 'bg-black hover:bg-[#ED1C24]' : 'bg-gray-100'}`}
                                            >
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                                                    <div className="bg-black text-white text-[10px] font-bold py-1 px-2 whitespace-nowrap">
                                                        {formatCurrency(item.value)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="absolute -bottom-6 text-[10px] font-bold text-gray-400">
                                            {item.short}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white border border-gray-200">
                    <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="font-bold text-lg text-black">Đơn hàng mới</h3>
                        <button onClick={() => setActiveTab('orders')} className="text-xs font-bold uppercase tracking-wider text-black hover:underline">Xem tất cả</button>
                    </div>
                    {recentOrders.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">Chưa có đơn hàng nào.</div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                                <tr>
                                    <th className="p-4">Mã đơn</th>
                                    <th className="p-4">Khách hàng</th>
                                    <th className="p-4">Tổng tiền</th>
                                    <th className="p-4">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {recentOrders.map(order => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-bold text-black">{order.id}</td>
                                        <td className="p-4 text-sm text-gray-700">{order.customerName || 'Khách vãng lai'}</td>
                                        <td className="p-4 font-bold text-black">{formatCurrency(order.total)}</td>
                                        <td className="p-4">{getStatusBadge(order.status)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        )}

        {/* BRANDS TAB */}
        {activeTab === 'brands' && (
             <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <header>
                    <h2 className="text-3xl font-bold text-black uppercase tracking-wide">Quản lý thương hiệu</h2>
                    <p className="text-gray-500 mt-1">Thêm hoặc xóa các thương hiệu sản phẩm.</p>
                </header>

                <div className="bg-white border border-gray-200 p-8 max-w-2xl">
                     <form onSubmit={handleAddBrand} className="flex gap-4 mb-8">
                         <input 
                             type="text" 
                             value={newBrandName}
                             onChange={(e) => setNewBrandName(e.target.value)}
                             placeholder="Nhập tên thương hiệu mới..."
                             className="flex-1 bg-white border border-gray-300 p-3 focus:border-black outline-none transition-colors rounded-none"
                         />
                         <button 
                            type="submit"
                            className="bg-black text-white px-6 font-bold text-sm uppercase tracking-wider hover:bg-[#ED1C24] transition-colors"
                         >
                             Thêm
                         </button>
                     </form>

                     <div className="border rounded-none overflow-hidden">
                        <table className="w-full text-left">
                             <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                                 <tr>
                                     <th className="p-4">Tên thương hiệu</th>
                                     <th className="p-4 text-right">Hành động</th>
                                 </tr>
                             </thead>
                             <tbody className="divide-y divide-gray-100">
                                 {brands.map((brand, idx) => (
                                     <tr key={idx} className="hover:bg-gray-50">
                                         <td className="p-4 font-medium">{brand}</td>
                                         <td className="p-4 text-right">
                                             <button 
                                                onClick={() => handleDeleteBrand(brand)}
                                                className="text-red-500 hover:text-red-700 p-2"
                                             >
                                                 <TrashIcon className="w-4 h-4" />
                                             </button>
                                         </td>
                                     </tr>
                                 ))}
                                 {brands.length === 0 && (
                                     <tr><td colSpan={2} className="p-8 text-center text-gray-500">Chưa có thương hiệu nào.</td></tr>
                                 )}
                             </tbody>
                        </table>
                     </div>
                </div>
             </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-black uppercase tracking-wide">Sản phẩm</h2>
                    <button 
                        onClick={handleAddNewClick}
                        className="bg-black text-white px-6 py-3 font-bold text-sm uppercase tracking-wider hover:bg-[#ED1C24] flex items-center space-x-2 transition-colors"
                    >
                        <PlusIcon className="w-4 h-4" />
                        <span>Thêm mới</span>
                    </button>
                </div>

                <div className="bg-white border border-gray-200">
                    <div className="p-4 border-b border-gray-200 flex items-center space-x-3">
                        <SearchIcon className="w-4 h-4 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Tìm kiếm sản phẩm..." 
                            value={productSearch}
                            onChange={(e) => setProductSearch(e.target.value)}
                            className="flex-1 outline-none text-sm placeholder-gray-400 bg-transparent"
                        />
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                                <tr>
                                    <th className="p-4">Sản phẩm</th>
                                    <th className="p-4">Thương hiệu</th>
                                    <th className="p-4">Danh mục</th>
                                    <th className="p-4">Giá</th>
                                    <th className="p-4 text-right">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredProducts.map(product => (
                                    <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="p-4 flex items-center space-x-4">
                                            <img src={product.image} alt="" className="w-12 h-12 object-cover bg-gray-100" />
                                            <span className="font-bold text-black line-clamp-1 text-sm">{product.name}</span>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-sm font-medium text-gray-700">{product.brand}</span>
                                        </td>
                                        <td className="p-4">
                                            <span className="bg-gray-100 text-gray-600 px-2 py-1 text-xs font-bold">{product.category}</span>
                                        </td>
                                        <td className="p-4 font-bold text-black text-sm">{formatCurrency(product.price)}</td>
                                        <td className="p-4 text-right space-x-2">
                                            <button 
                                                onClick={() => handleEditClick(product)}
                                                className="p-2 text-black hover:bg-gray-200 transition-colors"
                                            >
                                                <EditIcon className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => onDeleteProduct(product.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                 <h2 className="text-3xl font-bold text-black uppercase tracking-wide">Đơn hàng</h2>
                 <div className="bg-white border border-gray-200">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                                <tr>
                                    <th className="p-4">Mã đơn</th>
                                    <th className="p-4">Ngày đặt</th>
                                    <th className="p-4">Khách hàng</th>
                                    <th className="p-4">Địa chỉ</th>
                                    <th className="p-4">Tổng tiền</th>
                                    <th className="p-4">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orders.map(order => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-bold text-black">{order.id}</td>
                                        <td className="p-4 text-sm text-gray-500">{order.date}</td>
                                        <td className="p-4">
                                            <div className="font-bold text-black text-sm">{order.customerName || 'Khách vãng lai'}</div>
                                            <div className="text-xs text-gray-500 mt-1">{order.items.length} sản phẩm</div>
                                        </td>
                                        <td className="p-4 text-sm text-gray-600 max-w-xs truncate">{order.shippingAddress}</td>
                                        <td className="p-4 font-bold text-black">{formatCurrency(order.total)}</td>
                                        <td className="p-4">
                                            <div className="relative">
                                                <select 
                                                    value={order.status}
                                                    onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                                                    className="appearance-none bg-gray-50 border border-gray-200 text-black text-xs font-bold rounded-none focus:border-black block w-full pl-2 pr-8 py-1 cursor-pointer transition-colors uppercase"
                                                >
                                                    <option value="pending">Chờ xác nhận</option>
                                                    <option value="processing">Đang xử lý</option>
                                                    <option value="shipped">Đang giao</option>
                                                    <option value="delivered">Đã giao</option>
                                                    <option value="cancelled">Đã hủy</option>
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                 </div>
            </div>
        )}
      </main>

      {/* Add/Edit Product Modal - Minimalist */}
      {isProductModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white w-full max-w-lg p-8 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300">
                <h3 className="text-xl font-bold mb-6 text-black uppercase tracking-wide">{editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h3>
                <form onSubmit={handleFormSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold mb-2 text-gray-500 uppercase">Tên sản phẩm</label>
                        <input required className="w-full bg-white border border-gray-300 p-3 focus:border-black outline-none transition-colors rounded-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Nhập tên sản phẩm" />
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                        <div>
                             <label className="block text-xs font-bold mb-2 text-gray-500 uppercase">Thương hiệu</label>
                             <div className="relative">
                                 <select 
                                    required
                                    value={formData.brand} 
                                    onChange={e => setFormData({...formData, brand: e.target.value})}
                                    className="w-full bg-white border border-gray-300 p-3 focus:border-black outline-none appearance-none rounded-none"
                                 >
                                     <option value="" disabled>Chọn thương hiệu</option>
                                     {brands.map((b, i) => (
                                         <option key={i} value={b}>{b}</option>
                                     ))}
                                 </select>
                                 <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                             </div>
                        </div>
                        <div>
                             <label className="block text-xs font-bold mb-2 text-gray-500 uppercase">Danh mục</label>
                             <div className="relative">
                                <select className="w-full bg-white border border-gray-300 p-3 focus:border-black outline-none appearance-none rounded-none" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                                    {["Áo khoác", "Váy", "Áo thun", "Quần", "Áo sơ mi", "Giày dép", "Phụ kiện"].map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                             </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold mb-2 text-gray-500 uppercase">Giá (VND)</label>
                        <input type="number" required className="w-full bg-white border border-gray-300 p-3 focus:border-black outline-none transition-colors rounded-none" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold mb-2 text-gray-500 uppercase">URL Hình ảnh</label>
                        <input required className="w-full bg-white border border-gray-300 p-3 focus:border-black outline-none transition-colors rounded-none" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} placeholder="https://..." />
                    </div>
                    <div>
                        <label className="block text-xs font-bold mb-2 text-gray-500 uppercase">Mô tả</label>
                        <textarea className="w-full bg-white border border-gray-300 p-3 focus:border-black outline-none transition-colors rounded-none resize-none" rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Mô tả chi tiết sản phẩm..." />
                    </div>
                    <div className="flex justify-end space-x-3 mt-8 pt-4 border-t border-gray-100">
                        <button type="button" onClick={() => setIsProductModalOpen(false)} className="px-6 py-3 text-gray-600 hover:text-black hover:bg-gray-100 transition-colors font-bold text-sm uppercase rounded-none">Hủy</button>
                        <button type="submit" className="px-6 py-3 bg-black text-white hover:bg-[#ED1C24] transition-colors font-bold text-sm uppercase rounded-none">{editingProduct ? 'Cập nhật' : 'Thêm mới'}</button>
                    </div>
                </form>
            </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
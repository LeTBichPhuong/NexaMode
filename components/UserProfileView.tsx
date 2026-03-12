import React, { useState } from 'react';
import { User, Order, Product } from '../types';
import { formatCurrency, MOCK_PRODUCTS } from '../constants';
import { UserIcon, ShoppingBagIcon, HeartIcon, LogoutIcon, CheckCircleIcon } from './Icons';

interface UserProfileViewProps {
  user: User;
  orders: Order[];
  wishlist: Set<number>;
  onLogout: () => void;
  onSelectProduct: (product: Product) => void;
  onRemoveFromWishlist: (productId: number) => void;
}

const UserProfileView: React.FC<UserProfileViewProps> = ({ 
  user, 
  orders, 
  wishlist, 
  onLogout,
  onSelectProduct,
  onRemoveFromWishlist
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'orders' | 'wishlist'>('info');

  const wishlistProducts = MOCK_PRODUCTS.filter(p => wishlist.has(p.id));

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'delivered': return 'bg-black text-white';
      case 'processing': return 'bg-gray-200 text-black';
      case 'cancelled': return 'bg-red-50 text-[#ED1C24] border border-red-100';
      case 'shipped': return 'bg-gray-800 text-white';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
     switch(status) {
      case 'delivered': return 'Đã giao hàng';
      case 'processing': return 'Đang xử lý';
      case 'cancelled': return 'Đã hủy';
      case 'shipped': return 'Đang giao hàng';
      default: return 'Chờ xác nhận';
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* User Info Card */}
          <div className="bg-white border border-gray-200 p-8 text-center mb-8">
            <div className="w-24 h-24 mx-auto bg-gray-100 mb-6 overflow-hidden">
               <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            </div>
            <h2 className="text-lg font-bold text-black uppercase tracking-wider">{user.name}</h2>
            <p className="text-gray-500 text-xs mt-1">{user.email}</p>
          </div>

          {/* Navigation */}
          <nav className="bg-white border-t border-gray-200">
            <button 
              onClick={() => setActiveTab('info')}
              className={`w-full flex items-center space-x-4 px-6 py-5 text-left transition-colors border-b border-gray-200 text-xs font-bold uppercase tracking-widest ${activeTab === 'info' ? 'bg-black text-white' : 'text-gray-500 hover:text-black hover:bg-gray-50'}`}
            >
              <UserIcon className="w-4 h-4" />
              <span>Thông tin cá nhân</span>
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center space-x-4 px-6 py-5 text-left transition-colors border-b border-gray-200 text-xs font-bold uppercase tracking-widest ${activeTab === 'orders' ? 'bg-black text-white' : 'text-gray-500 hover:text-black hover:bg-gray-50'}`}
            >
              <ShoppingBagIcon className="w-4 h-4" />
              <span>Đơn hàng của tôi</span>
            </button>
            <button 
              onClick={() => setActiveTab('wishlist')}
              className={`w-full flex items-center space-x-4 px-6 py-5 text-left transition-colors border-b border-gray-200 text-xs font-bold uppercase tracking-widest ${activeTab === 'wishlist' ? 'bg-black text-white' : 'text-gray-500 hover:text-black hover:bg-gray-50'}`}
            >
              <HeartIcon className="w-4 h-4" />
              <span>Sản phẩm yêu thích</span>
            </button>
            <button 
              onClick={onLogout}
              className="w-full flex items-center space-x-4 px-6 py-5 text-left text-[#ED1C24] hover:bg-red-50 transition-colors border-b border-gray-200 text-xs font-bold uppercase tracking-widest"
            >
              <LogoutIcon className="w-4 h-4" />
              <span>Đăng xuất</span>
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white min-h-[500px]">
            {activeTab === 'info' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <h3 className="text-2xl font-bold text-black mb-8 uppercase tracking-widest border-b border-black pb-4">Hồ sơ của bạn</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <label className="block text-xs font-bold text-gray-500 uppercase">Họ và tên</label>
                      <input type="text" value={user.name} readOnly className="w-full bg-white border border-gray-300 px-4 py-3 text-black focus:outline-none rounded-none" />
                   </div>
                   <div className="space-y-2">
                      <label className="block text-xs font-bold text-gray-500 uppercase">Email</label>
                      <input type="email" value={user.email} readOnly className="w-full bg-gray-100 border border-transparent px-4 py-3 text-gray-500 cursor-not-allowed focus:outline-none rounded-none" />
                   </div>
                   <div className="space-y-2">
                      <label className="block text-xs font-bold text-gray-500 uppercase">Số điện thoại</label>
                      <input type="text" value={user.phone || "Chưa cập nhật"} readOnly className="w-full bg-white border border-gray-300 px-4 py-3 text-black focus:outline-none rounded-none" />
                   </div>
                   <div className="space-y-2">
                      <label className="block text-xs font-bold text-gray-500 uppercase">Địa chỉ mặc định</label>
                      <input type="text" value={user.address || "Chưa cập nhật"} readOnly className="w-full bg-white border border-gray-300 px-4 py-3 text-black focus:outline-none rounded-none" />
                   </div>
                </div>
                <div className="mt-10 flex justify-start">
                   <button className="bg-black text-white px-8 py-3 font-bold text-sm uppercase tracking-widest hover:bg-[#ED1C24] transition-colors rounded-none">
                      Cập nhật thông tin
                   </button>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <h3 className="text-2xl font-bold text-black mb-8 uppercase tracking-widest border-b border-black pb-4">Lịch sử đơn hàng</h3>
                {orders.length === 0 ? (
                  <div className="text-center py-20 bg-gray-50 border border-gray-100">
                     <p className="text-gray-500 text-sm mb-4">Bạn chưa có đơn hàng nào.</p>
                     <button className="text-black border-b border-black text-sm font-bold uppercase tracking-wide hover:text-[#ED1C24] hover:border-[#ED1C24] transition-colors">Bắt đầu mua sắm</button>
                  </div>
                ) : (
                  <div className="space-y-8">
                     {orders.map(order => (
                        <div key={order.id} className="border border-gray-200">
                           <div className="bg-gray-50 px-6 py-4 flex flex-wrap justify-between items-center border-b border-gray-200 gap-4">
                              <div className="flex space-x-8">
                                  <div>
                                     <span className="block text-[10px] uppercase text-gray-500 font-bold mb-1">Mã đơn</span>
                                     <p className="text-sm font-bold text-black">#{order.id}</p>
                                  </div>
                                  <div>
                                     <span className="block text-[10px] uppercase text-gray-500 font-bold mb-1">Ngày đặt</span>
                                     <p className="text-sm text-black">{order.date}</p>
                                  </div>
                                  <div>
                                     <span className="block text-[10px] uppercase text-gray-500 font-bold mb-1">Tổng cộng</span>
                                     <p className="text-sm font-bold text-black">{formatCurrency(order.total)}</p>
                                  </div>
                              </div>
                              <div className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest border ${getStatusColor(order.status).includes('border') ? '' : 'border-transparent'} ${getStatusColor(order.status)}`}>
                                 {getStatusText(order.status)}
                              </div>
                           </div>
                           <div className="p-6">
                              <div className="space-y-6">
                                 {order.items.map(item => (
                                    <div key={item.cartId} className="flex items-start space-x-6">
                                       <div className="w-16 h-20 bg-gray-100 flex-shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                       </div>
                                       <div className="flex-1">
                                          <h4 className="font-bold text-sm text-black uppercase mb-1">{item.name}</h4>
                                          <p className="text-xs text-gray-500 mb-1">Màu: {item.selectedColor} | Size: {item.selectedSize}</p>
                                          <p className="text-xs text-gray-500">Số lượng: {item.quantity}</p>
                                       </div>
                                       <p className="font-bold text-sm text-black">{formatCurrency(item.price)}</p>
                                    </div>
                                 ))}
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <h3 className="text-2xl font-bold text-black mb-8 uppercase tracking-widest border-b border-black pb-4">Danh sách yêu thích</h3>
                {wishlistProducts.length === 0 ? (
                  <div className="text-center py-20 bg-gray-50 border border-gray-100">
                     <HeartIcon className="w-8 h-8 text-gray-300 mx-auto mb-4" />
                     <p className="text-gray-500 text-sm">Danh sách yêu thích đang trống.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                     {wishlistProducts.map(product => (
                        <div key={product.id} className="group relative border border-gray-200">
                           <button 
                              onClick={() => onRemoveFromWishlist(product.id)}
                              className="absolute top-2 right-2 z-10 p-2 bg-white text-black hover:text-[#ED1C24] transition-colors"
                              title="Xóa"
                           >
                              <HeartIcon className="w-4 h-4" fill="currentColor" />
                           </button>
                           <div 
                              className="aspect-[3/4] bg-gray-100 cursor-pointer overflow-hidden relative"
                              onClick={() => onSelectProduct(product)}
                           >
                              <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                              {product.isNew && <span className="absolute top-0 left-0 bg-black text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider">New</span>}
                           </div>
                           <div className="p-4 text-center">
                              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide mb-1">{product.brand}</p>
                              <h4 
                                 className="font-bold text-sm text-black mb-2 truncate cursor-pointer hover:text-[#ED1C24] transition-colors"
                                 onClick={() => onSelectProduct(product)}
                              >
                                 {product.name}
                              </h4>
                              <p className="font-medium text-black">{formatCurrency(product.price)}</p>
                           </div>
                        </div>
                     ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileView;
import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { formatCurrency, MOCK_PRODUCTS } from '../constants';
import { ShoppingBagIcon, StarIcon, HeartIcon, RulerIcon, HistoryIcon } from './Icons';
import SizeGuideModal from './SizeGuideModal';

interface ProductDetailViewProps {
  product: Product;
  onAddToCart: (product: Product, size: string, color: string, quantity: number) => void;
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
  isFavorite: boolean;
  onToggleFavorite: (product: Product) => void;
}

const ProductDetailView: React.FC<ProductDetailViewProps> = ({ 
  product, 
  onAddToCart, 
  onBack,
  onSelectProduct,
  isFavorite,
  onToggleFavorite
}) => {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

  // Filter related products by Gender AND Category
  const relatedProducts = MOCK_PRODUCTS
    .filter(p => p.gender === product.gender && p.category === product.category && p.id !== product.id)
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);

  useEffect(() => {
    setSelectedSize(product.sizes[0]);
    setSelectedColor(product.colors[0]);
    setQuantity(1);
    
    // Manage Recently Viewed in LocalStorage
    const stored = localStorage.getItem('recently_viewed');
    let items: number[] = stored ? JSON.parse(stored) : [];
    
    // Add current, remove duplicates, limit to 6
    items = items.filter(id => id !== product.id);
    items.unshift(product.id);
    if(items.length > 6) items.pop();
    
    localStorage.setItem('recently_viewed', JSON.stringify(items));
    
    // Hydrate state
    const viewProducts = items.map(id => MOCK_PRODUCTS.find(p => p.id === id)).filter(Boolean) as Product[];
    setRecentlyViewed(viewProducts);

  }, [product]);

  return (
    <div className="max-w-[1200px] mx-auto px-4 lg:px-8">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-500 mb-8 flex space-x-2">
         <span onClick={onBack} className="cursor-pointer hover:underline">Trang chủ</span>
         <span>/</span>
         <span className="uppercase cursor-pointer hover:underline">{product.gender === 'WOMEN' ? 'NỮ' : product.gender === 'MEN' ? 'NAM' : 'TRẺ EM'}</span>
         <span>/</span>
         <span className="cursor-pointer hover:underline">{product.category}</span>
         <span>/</span>
         <span className="text-black font-medium">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <div className="space-y-4">
              <div className="aspect-[3/4] w-full bg-gray-100 relative group overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  <button 
                    onClick={() => onToggleFavorite(product)}
                    className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all"
                  >
                      <HeartIcon className={`w-6 h-6 ${isFavorite ? 'text-[#ED1C24]' : 'text-gray-400'}`} fill={isFavorite ? "currentColor" : "none"} />
                  </button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                   {[1,2,3].map(i => (
                       <div key={i} className="aspect-square bg-gray-100 cursor-pointer hover:opacity-80 transition-opacity">
                           <img src={product.image} className="w-full h-full object-cover" />
                       </div>
                   ))}
              </div>
          </div>

          {/* Info */}
          <div>
              <span className="text-[#ED1C24] font-bold text-xs uppercase tracking-wider mb-1 block">{product.brand}</span>
              <h1 className="text-3xl font-bold text-black mb-2 leading-tight">{product.name}</h1>
              <div className="flex items-center space-x-2 mb-4">
                  <div className="flex text-yellow-500 text-xs">
                      {[1,2,3,4,5].map(i => (
                        <React.Fragment key={i}>
                          <StarIcon className="w-4 h-4" fill="currentColor" />
                        </React.Fragment>
                      ))}
                  </div>
                  <span className="text-xs text-gray-500 underline cursor-pointer">Xem 24 đánh giá</span>
              </div>

              <div className="mb-6">
                  <span className={`text-2xl font-bold ${product.isLimited ? 'text-[#ED1C24]' : 'text-black'}`}>{formatCurrency(product.price)}</span>
                  {product.isLimited && <span className="text-sm text-gray-500 line-through ml-3">{formatCurrency(product.price * 1.3)}</span>}
              </div>

              {/* Description */}
              <div className="bg-gray-50 p-4 mb-8 text-sm text-gray-700 leading-relaxed border-l-4 border-[#ED1C24]">
                  {product.description}
              </div>

              {/* Selectors */}
              <div className="space-y-6 mb-8">
                  {/* Color */}
                  <div>
                      <span className="block text-xs font-bold uppercase mb-2">Màu sắc: {selectedColor}</span>
                      <div className="flex flex-wrap gap-2">
                          {product.colors.map(color => (
                              <button
                                  key={color}
                                  onClick={() => setSelectedColor(color)}
                                  className={`w-10 h-10 border transition-all ${selectedColor === color ? 'border-[#ED1C24] ring-1 ring-[#ED1C24]' : 'border-gray-300 hover:border-gray-500'}`}
                                  style={{backgroundColor: color === 'Trắng' ? '#fff' : color === 'Đen' ? '#000' : 'gray'}}
                                  title={color}
                              ></button>
                          ))}
                      </div>
                  </div>

                  {/* Size */}
                  <div>
                      <div className="flex justify-between items-center mb-2">
                          <span className="block text-xs font-bold uppercase">Kích thước: {selectedSize}</span>
                          <button 
                            onClick={() => setIsSizeGuideOpen(true)}
                            className="flex items-center space-x-1 text-xs font-bold uppercase text-[#ED1C24] hover:underline"
                          >
                             <RulerIcon className="w-4 h-4" />
                             <span>Gợi ý Size</span>
                          </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                          {product.sizes.map(size => (
                              <button
                                  key={size}
                                  onClick={() => setSelectedSize(size)}
                                  className={`h-10 min-w-[3rem] px-2 border text-sm font-medium transition-all ${selectedSize === size ? 'border-[#ED1C24] bg-red-50 text-[#ED1C24] font-bold' : 'border-gray-300 bg-white hover:border-gray-500'}`}
                              >
                                  {size}
                              </button>
                          ))}
                      </div>
                  </div>

                  {/* Quantity */}
                   <div>
                      <span className="block text-xs font-bold uppercase mb-2">Số lượng</span>
                      <select 
                        value={quantity} 
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="h-10 w-24 border border-gray-300 pl-3 pr-8 bg-white text-sm focus:border-black outline-none"
                      >
                          {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                   </div>
              </div>

              <button 
                  onClick={() => onAddToCart(product, selectedSize, selectedColor, quantity)}
                  className="w-full bg-[#ED1C24] text-white py-4 font-bold text-lg uppercase tracking-wider hover:bg-red-700 transition-colors mb-4"
              >
                  Thêm vào giỏ hàng
              </button>
              
              <div className="text-xs text-gray-500 space-y-1 mt-4">
                  <p>• Mã sản phẩm: {product.id}</p>
                  <p>• Đổi trả trong vòng 30 ngày</p>
              </div>
          </div>
      </div>

      {/* Recently Viewed */}
      {recentlyViewed.length > 1 && (
        <div className="border-t border-gray-200 pt-12 pb-8">
             <div className="flex items-center space-x-2 mb-6">
                <HistoryIcon className="w-5 h-5 text-gray-400" />
                <h3 className="text-lg font-bold uppercase tracking-wider">Đã xem gần đây</h3>
             </div>
             <div className="flex space-x-4 overflow-x-auto pb-4 custom-scrollbar">
                {recentlyViewed.filter(p => p.id !== product.id).map(p => (
                   <div key={p.id} className="min-w-[160px] w-[160px] cursor-pointer group" onClick={() => onSelectProduct(p)}>
                       <div className="aspect-[3/4] bg-gray-100 mb-2 overflow-hidden">
                           <img src={p.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                       </div>
                       <h4 className="text-xs font-bold uppercase line-clamp-1">{p.name}</h4>
                       <p className="text-xs text-gray-500">{formatCurrency(p.price)}</p>
                   </div>
                ))}
             </div>
        </div>
      )}

      {/* Related */}
      <div className="border-t border-gray-200 pt-12">
          <h3 className="text-xl font-bold uppercase mb-6">Gợi ý phối đồ</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {relatedProducts.map(rp => (
                   <div key={rp.id} className="cursor-pointer group" onClick={() => onSelectProduct(rp)}>
                       <div className="aspect-[3/4] bg-gray-100 mb-2 overflow-hidden">
                           <img src={rp.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                       </div>
                       <h4 className="text-sm font-medium text-gray-900 line-clamp-1 group-hover:underline">{rp.name}</h4>
                       <p className="text-sm font-bold text-black">{formatCurrency(rp.price)}</p>
                   </div>
               ))}
          </div>
      </div>

      <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} gender={product.gender} />
    </div>
  );
};

export default ProductDetailView;
import React, { useState } from 'react';
import { Product } from '../types';
import { formatCurrency } from '../constants';
import { XIcon, ShoppingBagIcon, PlusIcon, MinusIcon } from './Icons';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, color: string, quantity: number) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  // Reset state when product changes
  React.useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0]);
      setSelectedColor(product.colors[0]);
      setQuantity(1);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  return (
    <>
      <div className="fixed inset-0 bg-gray-900/60 z-50 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row relative animate-in zoom-in-95 duration-300">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 bg-white/80 backdrop-blur-md rounded-full hover:bg-gray-100 transition-colors shadow-sm"
          >
            <XIcon className="w-6 h-6 text-gray-500" />
          </button>

          {/* Image Section */}
          <div className="w-full md:w-1/2 h-64 md:h-auto bg-gray-100 relative">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
             <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
          </div>

          {/* Details Section */}
          <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col overflow-y-auto">
            <div className="mb-1">
                <span className="text-indigo-600 font-bold text-xs uppercase tracking-wider bg-indigo-50 px-2 py-1 rounded-md">{product.category}</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h2>
            <p className="text-2xl font-bold text-gray-900 mb-6">{formatCurrency(product.price)}</p>

            <p className="text-gray-600 mb-8 leading-relaxed text-sm">
              {product.description}
            </p>

            <div className="space-y-6 flex-1">
              {/* Colors */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-3">Màu sắc</h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                        selectedColor === color 
                          ? 'border-indigo-600 bg-indigo-600 text-white shadow-md' 
                          : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-3">Kích thước</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 rounded-xl border flex items-center justify-center text-sm font-bold transition-all ${
                        selectedSize === size 
                          ? 'border-gray-900 bg-gray-900 text-white shadow-md' 
                          : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center gap-4">
              <div className="flex items-center bg-gray-100 rounded-xl p-1">
                 <button 
                    className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-lg transition-all text-gray-600"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                 ><MinusIcon className="w-4 h-4" /></button>
                 <span className="w-10 text-center font-bold text-gray-900">{quantity}</span>
                 <button 
                    className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-lg transition-all text-gray-600"
                    onClick={() => setQuantity(quantity + 1)}
                 ><PlusIcon className="w-4 h-4" /></button>
              </div>
              <button
                onClick={() => {
                  onAddToCart(product, selectedSize, selectedColor, quantity);
                  onClose();
                }}
                className="flex-1 bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200 flex items-center justify-center space-x-2 active:scale-95"
              >
                <ShoppingBagIcon className="w-5 h-5" />
                <span>Thêm vào giỏ</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductModal;
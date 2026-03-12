import React from 'react';
import { CartItem } from '../types';
import { formatCurrency } from '../constants';
import { XIcon, PlusIcon, MinusIcon, TrashIcon } from './Icons';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (cartId: string, newQuantity: number) => void;
  onRemoveItem: (cartId: string) => void;
  onCheckout: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ 
  isOpen, 
  onClose, 
  cart, 
  onUpdateQuantity, 
  onRemoveItem,
  onCheckout
}) => {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div className={`fixed inset-y-0 right-0 z-50 w-full sm:w-[450px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-200 flex justify-between items-center bg-white">
            <h2 className="text-xl font-bold text-black uppercase tracking-wider">Giỏ hàng ({cart.reduce((a, b) => a + b.quantity, 0)})</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 transition-colors">
              <XIcon className="w-6 h-6 text-black" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-8 space-y-8">
            {cart.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 mb-6">Giỏ hàng của bạn đang trống</p>
                <button 
                    onClick={onClose}
                    className="inline-block border-b-2 border-black pb-1 text-black font-bold uppercase tracking-wide hover:text-[#ED1C24] hover:border-[#ED1C24] transition-colors"
                >
                    Tiếp tục mua sắm
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.cartId} className="flex space-x-5 group">
                  <div className="w-24 h-32 flex-shrink-0 bg-gray-100 relative">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-black text-sm uppercase line-clamp-2 pr-4">{item.name}</h3>
                        <button 
                            onClick={() => onRemoveItem(item.cartId)}
                            className="text-gray-400 hover:text-[#ED1C24] transition-colors"
                        >
                            <XIcon className="w-4 h-4" />
                        </button>
                    </div>
                    
                    <p className="text-xs text-gray-500 mb-4">
                      Màu: {item.selectedColor} | Size: {item.selectedSize}
                    </p>

                    <div className="mt-auto flex justify-between items-end">
                       {/* Quantity Selector - Minimalist Box */}
                      <div className="flex items-center border border-gray-300 h-8">
                         <button 
                            className="w-8 h-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                            onClick={() => {
                                if(item.quantity === 1) onRemoveItem(item.cartId);
                                else onUpdateQuantity(item.cartId, item.quantity - 1);
                            }}
                         >
                             <MinusIcon className="w-3 h-3" />
                         </button>
                         <div className="w-10 text-center text-sm font-medium border-x border-gray-300 h-full flex items-center justify-center">
                             {item.quantity}
                         </div>
                         <button 
                            className="w-8 h-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                            onClick={() => onUpdateQuantity(item.cartId, item.quantity + 1)}
                         >
                             <PlusIcon className="w-3 h-3" />
                         </button>
                      </div>

                      <p className="font-bold text-black text-base">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="p-8 border-t border-gray-200 bg-white">
              <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tạm tính</span>
                    <span className="font-medium text-black">{formatCurrency(total)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Vận chuyển</span>
                    <span className="font-medium text-black">Miễn phí</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <span className="font-bold text-lg text-black uppercase">Tổng cộng</span>
                    <span className="font-bold text-xl text-[#ED1C24]">{formatCurrency(total)}</span>
                  </div>
              </div>
              
              <button 
                onClick={onCheckout}
                className="w-full bg-[#ED1C24] text-white py-4 font-bold uppercase tracking-widest hover:bg-red-700 transition-colors rounded-none"
              >
                Thanh toán ngay
              </button>
              
              <p className="text-center text-[10px] text-gray-400 mt-4 uppercase">
                  Đã bao gồm thuế GTGT
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
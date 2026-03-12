import React, { useState } from 'react';
import { CartItem } from '../types';
import { formatCurrency } from '../constants';
import { XIcon, CreditCardIcon, CheckCircleIcon } from './Icons';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onSuccess: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, cart, onSuccess }) => {
  const [step, setStep] = useState<'info' | 'payment' | 'success'>('info');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: ''
  });
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card'>('cod');
  const [loading, setLoading] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePaymentSubmit = () => {
    setLoading(true);
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      setStep('success');
      setTimeout(() => {
          onSuccess();
          onClose();
          setStep('info'); // Reset for next time
      }, 2000);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm transition-opacity duration-300" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl animate-in zoom-in-95 duration-300 rounded-none border border-gray-200">
            
            {/* Left Column: Form Steps */}
            <div className="flex-1 overflow-y-auto p-8 md:p-12">
                 <div className="flex justify-between items-center mb-8 md:hidden">
                    <h2 className="text-xl font-bold uppercase tracking-widest">Thanh toán</h2>
                    <button onClick={onClose}><XIcon className="w-6 h-6" /></button>
                 </div>

                 {step === 'success' ? (
                     <div className="h-full flex flex-col items-center justify-center text-center py-12">
                        <div className="mb-6 animate-in zoom-in duration-500">
                             <CheckCircleIcon className="w-16 h-16 text-black" />
                        </div>
                        <h3 className="text-2xl font-bold uppercase tracking-widest mb-2">Đặt hàng thành công</h3>
                        <p className="text-gray-500">Cảm ơn bạn đã lựa chọn StyleAI.</p>
                     </div>
                 ) : (
                     <>
                        {/* Stepper Text */}
                        <div className="flex items-center space-x-4 mb-8 text-xs font-bold uppercase tracking-widest">
                            <span className={step === 'info' ? 'text-black border-b-2 border-black pb-1' : 'text-gray-400'}>1. Giao hàng</span>
                            <span className="text-gray-300">/</span>
                            <span className={step === 'payment' ? 'text-black border-b-2 border-black pb-1' : 'text-gray-400'}>2. Thanh toán</span>
                        </div>

                        {step === 'info' ? (
                            <form id="info-form" onSubmit={handleInfoSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Họ và tên</label>
                                    <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-white border border-gray-300 px-4 py-3 focus:border-black outline-none rounded-none transition-colors" placeholder="Nhập họ tên" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Số điện thoại</label>
                                        <input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-white border border-gray-300 px-4 py-3 focus:border-black outline-none rounded-none transition-colors" placeholder="Số điện thoại" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Thành phố</label>
                                        <input required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full bg-white border border-gray-300 px-4 py-3 focus:border-black outline-none rounded-none transition-colors" placeholder="Tỉnh/Thành phố" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Địa chỉ nhận hàng</label>
                                    <input required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-white border border-gray-300 px-4 py-3 focus:border-black outline-none rounded-none transition-colors" placeholder="Số nhà, tên đường, phường/xã" />
                                </div>
                                
                                <button 
                                    type="submit"
                                    className="w-full bg-black text-white py-4 font-bold uppercase tracking-widest hover:bg-[#ED1C24] transition-colors rounded-none mt-4"
                                >
                                    Tiếp tục thanh toán
                                </button>
                            </form>
                        ) : (
                            <div className="space-y-6 animate-in slide-in-from-right duration-300">
                                <h3 className="font-bold uppercase tracking-wide">Phương thức thanh toán</h3>
                                
                                <div className="space-y-3">
                                    <label className={`flex items-center p-4 border cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-400'}`}>
                                        <input type="radio" name="payment" className="hidden" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                                        <div className={`w-4 h-4 border border-gray-400 mr-4 flex items-center justify-center rounded-full ${paymentMethod === 'cod' ? 'border-black' : ''}`}>
                                            {paymentMethod === 'cod' && <div className="w-2 h-2 bg-black rounded-full" />}
                                        </div>
                                        <div>
                                            <span className="block font-bold text-sm uppercase">Thanh toán khi nhận hàng (COD)</span>
                                            <span className="text-xs text-gray-500">Thanh toán tiền mặt cho người giao hàng</span>
                                        </div>
                                    </label>

                                    <label className={`flex items-center p-4 border cursor-pointer transition-colors ${paymentMethod === 'card' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-400'}`}>
                                        <input type="radio" name="payment" className="hidden" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                                        <div className={`w-4 h-4 border border-gray-400 mr-4 flex items-center justify-center rounded-full ${paymentMethod === 'card' ? 'border-black' : ''}`}>
                                            {paymentMethod === 'card' && <div className="w-2 h-2 bg-black rounded-full" />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center">
                                                <span className="block font-bold text-sm uppercase">Thẻ tín dụng / Ghi nợ</span>
                                                <CreditCardIcon className="w-5 h-5" />
                                            </div>
                                            <span className="text-xs text-gray-500">Visa, Mastercard, JCB</span>
                                        </div>
                                    </label>
                                </div>

                                {paymentMethod === 'card' && (
                                    <div className="p-4 bg-gray-100 text-xs text-gray-600">
                                        Hệ thống thanh toán thẻ đang bảo trì. Vui lòng chọn COD.
                                    </div>
                                )}

                                <button 
                                    onClick={handlePaymentSubmit}
                                    disabled={loading || paymentMethod === 'card'}
                                    className="w-full bg-black text-white py-4 font-bold uppercase tracking-widest hover:bg-[#ED1C24] transition-colors rounded-none disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Đang xử lý...' : `Hoàn tất đơn hàng`}
                                </button>
                                <button 
                                    onClick={() => setStep('info')}
                                    className="w-full text-xs text-gray-500 font-bold uppercase tracking-wider hover:text-black py-2"
                                >
                                    Quay lại
                                </button>
                            </div>
                        )}
                     </>
                 )}
            </div>

            {/* Right Column: Order Summary */}
            <div className="w-full md:w-[400px] bg-gray-50 border-t md:border-t-0 md:border-l border-gray-200 p-8 md:p-12 flex flex-col">
                 <div className="hidden md:flex justify-end mb-8">
                     <button onClick={onClose} className="hover:opacity-70"><XIcon className="w-6 h-6" /></button>
                 </div>
                 
                 <h3 className="font-bold uppercase tracking-widest mb-6">Đơn hàng của bạn</h3>
                 
                 <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4 mb-6 max-h-[300px]">
                     {cart.map(item => (
                         <div key={item.cartId} className="flex gap-4">
                             <div className="w-16 h-20 bg-gray-200 flex-shrink-0">
                                 <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                             </div>
                             <div className="flex-1">
                                 <h4 className="text-sm font-bold uppercase line-clamp-2 mb-1">{item.name}</h4>
                                 <p className="text-xs text-gray-500 mb-1">{item.selectedColor} | {item.selectedSize} | x{item.quantity}</p>
                                 <p className="text-sm font-medium">{formatCurrency(item.price * item.quantity)}</p>
                             </div>
                         </div>
                     ))}
                 </div>

                 <div className="border-t border-gray-200 pt-6 space-y-3">
                     <div className="flex justify-between text-sm">
                         <span className="text-gray-600">Tạm tính</span>
                         <span className="font-medium">{formatCurrency(total)}</span>
                     </div>
                     <div className="flex justify-between text-sm">
                         <span className="text-gray-600">Vận chuyển</span>
                         <span className="font-medium">Miễn phí</span>
                     </div>
                     <div className="flex justify-between items-center pt-4 border-t border-gray-200 mt-2">
                         <span className="font-bold uppercase">Tổng cộng</span>
                         <span className="font-bold text-xl text-[#ED1C24]">{formatCurrency(total)}</span>
                     </div>
                 </div>
            </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutModal;
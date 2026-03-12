import React, { useState, useRef } from 'react';
import { CameraIcon, XIcon, SearchIcon, SparklesIcon } from './Icons';
import { analyzeImageAndFindProducts } from '../services/geminiService';
import { Product } from '../types';
import { MOCK_PRODUCTS } from '../constants';

interface VisualSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

const VisualSearchModal: React.FC<VisualSearchModalProps> = ({ isOpen, onClose, onSelectProduct }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        handleAnalyze(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async (fullBase64: string) => {
      setIsAnalyzing(true);
      setResults([]);
      
      // Remove data:image/jpeg;base64, prefix for API
      const base64Data = fullBase64.split(',')[1];
      
      try {
          const ids = await analyzeImageAndFindProducts(base64Data);
          const foundProducts = MOCK_PRODUCTS.filter(p => ids.includes(p.id.toString()));
          setResults(foundProducts);
      } catch (error) {
          console.error(error);
      } finally {
          setIsAnalyzing(false);
      }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 rounded-none border border-gray-200">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <div className="flex items-center space-x-3">
                    <CameraIcon className="w-6 h-6 text-[#ED1C24]" />
                    <div>
                        <h3 className="text-lg font-bold uppercase tracking-wider">Style Lens</h3>
                        <p className="text-xs text-gray-500">Tìm kiếm sản phẩm bằng hình ảnh</p>
                    </div>
                </div>
                <button onClick={onClose}><XIcon className="w-6 h-6 hover:text-[#ED1C24]" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
                {!imagePreview ? (
                    <div 
                        className="border-2 border-dashed border-gray-300 bg-gray-50 h-64 flex flex-col items-center justify-center cursor-pointer hover:border-[#ED1C24] hover:bg-red-50 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <CameraIcon className="w-12 h-12 text-gray-400 mb-4" />
                        <p className="font-bold text-gray-600 uppercase tracking-wide">Tải ảnh lên</p>
                        <p className="text-xs text-gray-400 mt-2">JPEG, PNG (Max 5MB)</p>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                    </div>
                ) : (
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Source Image */}
                        <div className="w-full md:w-1/3">
                            <p className="text-xs font-bold uppercase mb-2 text-gray-500">Ảnh của bạn</p>
                            <div className="aspect-[3/4] bg-gray-100 overflow-hidden relative border border-gray-200">
                                <img src={imagePreview} alt="Uploaded" className="w-full h-full object-cover opacity-80" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    {isAnalyzing && (
                                        <div className="bg-black/70 text-white px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center animate-pulse">
                                            <SparklesIcon className="w-4 h-4 mr-2" />
                                            Đang phân tích...
                                        </div>
                                    )}
                                </div>
                            </div>
                            <button 
                                onClick={() => { setImagePreview(null); setResults([]); }}
                                className="mt-4 w-full text-xs font-bold uppercase border border-black py-2 hover:bg-black hover:text-white transition-colors"
                            >
                                Chọn ảnh khác
                            </button>
                        </div>

                        {/* Results */}
                        <div className="w-full md:w-2/3">
                            <p className="text-xs font-bold uppercase mb-2 text-gray-500">Kết quả tìm kiếm ({results.length})</p>
                            {results.length === 0 && !isAnalyzing ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400 border border-gray-100 bg-gray-50">
                                    <SearchIcon className="w-8 h-8 mb-2 opacity-20" />
                                    <p className="text-sm">Không tìm thấy sản phẩm tương tự.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    {results.map(p => (
                                        <div 
                                            key={p.id} 
                                            className="cursor-pointer group border border-gray-100 hover:border-black transition-colors"
                                            onClick={() => { onSelectProduct(p); onClose(); }}
                                        >
                                            <div className="aspect-square bg-gray-100 overflow-hidden">
                                                <img src={p.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                            </div>
                                            <div className="p-3">
                                                <h4 className="font-bold text-xs uppercase line-clamp-1 mb-1">{p.name}</h4>
                                                <p className="text-sm font-bold text-[#ED1C24]">{p.price.toLocaleString()}đ</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </>
  );
};

export default VisualSearchModal;
import React, { useState } from 'react';
import { RulerIcon, XIcon, CheckCircleIcon } from './Icons';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  gender: string;
}

const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose, gender }) => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [recommendedSize, setRecommendedSize] = useState<string | null>(null);

  const calculateSize = (e: React.FormEvent) => {
    e.preventDefault();
    const h = parseInt(height);
    const w = parseInt(weight);

    let size = 'M'; // Default

    // Simple Logic for demo
    if (gender === 'WOMEN') {
        if (w < 45) size = 'XS';
        else if (w < 50) size = 'S';
        else if (w < 55) size = 'M';
        else if (w < 60) size = 'L';
        else if (w < 65) size = 'XL';
        else size = 'XXL';
    } else if (gender === 'MEN') {
        if (w < 55) size = 'XS';
        else if (w < 63) size = 'S';
        else if (w < 70) size = 'M';
        else if (w < 78) size = 'L';
        else if (w < 85) size = 'XL';
        else size = 'XXL';
    } else {
        // Kids based on height roughly
        if (h < 110) size = '110';
        else if (h < 120) size = '120';
        else if (h < 130) size = '130';
        else if (h < 140) size = '140';
        else if (h < 150) size = '150';
        else size = '160';
    }
    setRecommendedSize(size);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md shadow-2xl animate-in zoom-in-95 rounded-none border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <div className="flex items-center space-x-3">
                    <RulerIcon className="w-6 h-6 text-black" />
                    <div>
                        <h3 className="text-lg font-bold uppercase tracking-wider">Smart Fit</h3>
                        <p className="text-xs text-gray-500">Gợi ý size phù hợp</p>
                    </div>
                </div>
                <button onClick={onClose}><XIcon className="w-6 h-6 hover:text-[#ED1C24]" /></button>
            </div>

            <div className="p-8">
                {recommendedSize ? (
                    <div className="text-center py-6 animate-in fade-in slide-in-from-bottom-2">
                        <CheckCircleIcon className="w-16 h-16 text-[#ED1C24] mx-auto mb-4" />
                        <p className="text-gray-500 text-sm mb-2 uppercase tracking-wide">Size phù hợp với bạn là</p>
                        <h2 className="text-6xl font-bold text-black mb-6">{recommendedSize}</h2>
                        <button 
                            onClick={() => { setRecommendedSize(null); setHeight(''); setWeight(''); }}
                            className="text-xs font-bold underline text-gray-500 hover:text-black"
                        >
                            Tính lại
                        </button>
                    </div>
                ) : (
                    <form onSubmit={calculateSize} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Chiều cao (cm)</label>
                                <input 
                                    type="number" required 
                                    value={height} onChange={e => setHeight(e.target.value)}
                                    className="w-full border border-gray-300 p-3 focus:border-black outline-none rounded-none"
                                    placeholder="170"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Cân nặng (kg)</label>
                                <input 
                                    type="number" required 
                                    value={weight} onChange={e => setWeight(e.target.value)}
                                    className="w-full border border-gray-300 p-3 focus:border-black outline-none rounded-none"
                                    placeholder="65"
                                />
                            </div>
                        </div>
                        <div className="bg-gray-50 p-4 text-xs text-gray-500 leading-relaxed border border-gray-100">
                            Công nghệ Smart Fit sử dụng dữ liệu chiều cao, cân nặng để đối chiếu với bảng size chuẩn của StyleAI nhằm đưa ra gợi ý chính xác tới 95%.
                        </div>
                        <button type="submit" className="w-full bg-black text-white py-4 font-bold uppercase tracking-widest hover:bg-[#ED1C24] transition-colors rounded-none">
                            Tìm Size Ngay
                        </button>
                    </form>
                )}
            </div>
        </div>
      </div>
    </>
  );
};

export default SizeGuideModal;
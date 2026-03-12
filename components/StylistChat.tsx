import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage } from '../types';
import { XIcon, SparklesIcon, SendIcon } from './Icons';

interface StylistChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const StylistChat: React.FC<StylistChatProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Xin chào! Tôi là AI Stylist của Nexa Mode. Bạn cần tôi tư vấn trang phục gì hôm nay?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsLoading(true);

    // Add a placeholder for the model response
    setMessages(prev => [...prev, { role: 'model', text: '' }]);

    try {
      const stream = await sendMessageToGemini(userMessage);

      let fullResponse = '';
      for await (const chunk of stream) {
        fullResponse += chunk;
        setMessages(prev => {
          const newMsgs = [...prev];
          newMsgs[newMsgs.length - 1] = { role: 'model', text: fullResponse };
          return newMsgs;
        });
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại.', isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-md bg-white shadow-2xl border border-gray-200 flex flex-col h-[600px] max-h-[80vh] animate-in slide-in-from-bottom-5 fade-in duration-300 rounded-none">
      {/* Header - Minimalist */}
      <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="bg-[#ED1C24] p-1.5 flex items-center justify-center">
            <SparklesIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-black uppercase tracking-wide text-sm">AI Stylist</h3>
            <p className="text-[10px] text-gray-500 font-medium">Tư vấn phong cách</p>
          </div>
        </div>
        <button onClick={onClose} className="hover:bg-gray-100 p-2 transition-colors">
          <XIcon className="w-5 h-5 text-black" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] p-4 text-sm font-medium leading-relaxed ${msg.role === 'user'
                  ? 'bg-black text-white rounded-none'
                  : 'bg-white border border-gray-200 text-gray-800 rounded-none shadow-sm'
                } ${msg.isError ? 'bg-red-50 border-red-200 text-red-600' : ''}`}
            >
              {msg.text.split('\n').map((line, i) => (
                <p key={i} className={i > 0 ? 'mt-2' : ''}>{line}</p>
              ))}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex space-x-0 border border-gray-300 focus-within:border-black transition-colors">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Hỏi về cách phối đồ..."
            className="flex-1 px-4 py-3 focus:outline-none text-sm bg-transparent rounded-none placeholder-gray-400"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-black text-white px-4 hover:bg-[#ED1C24] disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-none"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="text-center mt-2">
          <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Powered by Gemini</span>
        </div>
      </div>
    </div>
  );
};

export default StylistChat;
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { Product } from "../types";
import { MOCK_PRODUCTS } from "../constants";

// Khởi tạo API Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Xây dựng ngữ cảnh về kho hàng của cửa hàng
const productContext = MOCK_PRODUCTS.map(p => 
  `- ID: ${p.id}, Tên: ${p.name}, Giá: ${p.price} VND, Loại: ${p.category}, Màu: ${p.colors.join(', ')}`
).join('\n');

const SYSTEM_INSTRUCTION = `
Bạn là một trợ lý thời trang chuyên nghiệp (AI Stylist) cho cửa hàng "Nexa Mode" (trước đây là StyleAI).
Nhiệm vụ của bạn là tư vấn phong cách, gợi ý phối đồ và giúp khách hàng chọn sản phẩm phù hợp.

Dưới đây là danh sách sản phẩm hiện có trong cửa hàng:
${productContext}

Nguyên tắc trả lời:
1. Luôn thân thiện, lịch sự và chuyên nghiệp.
2. Khi gợi ý sản phẩm, hãy nhắc đến tên sản phẩm chính xác và giá của nó.
3. Nếu khách hàng hỏi về một dịp cụ thể (đi làm, đi tiệc, đi chơi), hãy gợi ý set đồ từ danh sách trên.
4. Trả lời ngắn gọn, súc tích (dưới 150 từ mỗi lần trả lời trừ khi cần thiết).
5. Sử dụng tiếng Việt.
6. Nếu khách hỏi sản phẩm không có trong danh sách, hãy lịch sự gợi ý sản phẩm tương tự mà cửa hàng có.
`;

let chatSession: Chat | null = null;

export const getChatSession = (): Chat => {
  if (!chatSession) {
    chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });
  }
  return chatSession;
};

export const sendMessageToGemini = async (message: string): Promise<AsyncIterable<string>> => {
  const chat = getChatSession();
  
  // Tạo generator để trả về từng đoạn văn bản
  async function* streamGenerator() {
    try {
      const result = await chat.sendMessageStream({ message });
      for await (const chunk of result) {
        const c = chunk as GenerateContentResponse;
        if (c.text) {
            yield c.text;
        }
      }
    } catch (error) {
      console.error("Lỗi API Gemini:", error);
      yield "Xin lỗi, hiện tại tôi đang gặp sự cố kết nối. Vui lòng thử lại sau.";
    }
  }

  return streamGenerator();
};

// Hàm mới cho Tìm kiếm bằng hình ảnh
export const analyzeImageAndFindProducts = async (base64Image: string): Promise<string[]> => {
    try {
        const prompt = `
        Đây là hình ảnh một sản phẩm thời trang. 
        Hãy phân tích hình ảnh này (loại quần áo, màu sắc, phong cách) và tìm trong danh sách sản phẩm dưới đây những sản phẩm tương tự nhất.
        
        Danh sách sản phẩm cửa hàng:
        ${productContext}

        Chỉ trả về danh sách ID của các sản phẩm tương tự, ngăn cách bằng dấu phẩy. Ví dụ: "1, 5, 12".
        Nếu không tìm thấy sản phẩm nào thực sự giống, hãy tìm sản phẩm cùng loại và cùng màu.
        Không trả lời thêm bất kỳ lời dẫn nào.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
                    { text: prompt }
                ]
            }
        });

        const text = response.text || "";
        // Trích xuất ID từ phản hồi "1, 2, 3" -> ["1", "2", "3"]
        const ids = text.match(/\d+/g) || [];
        return ids;
    } catch (error) {
        console.error("Lỗi tìm kiếm hình ảnh:", error);
        return [];
    }
};

export const resetChatSession = () => {
    chatSession = null;
}
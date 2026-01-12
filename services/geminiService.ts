
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Product } from "../types";

const API_KEY = process.env.API_KEY || "";

export const getSmartRecommendations = async (query: string, products: Product[]): Promise<string> => {
  if (!API_KEY) return "Sistem AI sedang tidak tersedia saat ini.";

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  // Provide context about the store to the AI
  const productContext = products.map(p => 
    `- ${p.title} (Harga: Rp${p.price.toLocaleString('id-ID')}, Kategori: ${p.category})`
  ).join('\n');

  const prompt = `
    Anda adalah asisten belanja untuk 'Lokal Market'. 
    Berikut adalah daftar produk kami:
    ${productContext}

    Pertanyaan Pelanggan: "${query}"

    Berikan rekomendasi produk yang relevan berdasarkan pertanyaan tersebut. 
    Jawablah dengan nada yang ramah, profesional, dan dalam Bahasa Indonesia yang baik.
    Jika produk tidak ada, sarankan alternatif atau tanyakan preferensi mereka.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Maaf, saya tidak bisa memproses permintaan Anda saat ini.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Terjadi kesalahan saat menghubungi asisten AI kami.";
  }
};

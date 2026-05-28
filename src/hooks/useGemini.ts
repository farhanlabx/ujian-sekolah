import { useCallback, useState } from 'react';

export interface GeminiResponse {
  text: string;
  isError: boolean;
}

export function useGemini() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const askGemini = useCallback(async (prompt: string): Promise<GeminiResponse> => {
    setLoading(true);
    setError(null);

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      setLoading(false);
      return { text: 'API Gemini belum diatur. Silakan tambahkan VITE_GEMINI_API_KEY di .env.', isError: true };
    }

    try {
      const response = await fetch('https://gemini.googleapis.com/v1/models/text-bison-001:generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          prompt: { text: prompt },
          temperature: 0.7,
          candidate_count: 1
        })
      });

      const data = await response.json();
      const text = data?.candidates?.[0]?.output || data?.output?.[0]?.content?.[0]?.text || 'Gemini tidak memberi respons yang valid.';
      setLoading(false);
      return { text, isError: false };
    } catch (e) {
      setLoading(false);
      const message = e instanceof Error ? e.message : 'Permintaan Gemini gagal.';
      setError(message);
      return { text: `Kesalahan: ${message}`, isError: true };
    }
  }, []);

  return { askGemini, loading, error };
}

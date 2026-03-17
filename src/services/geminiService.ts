import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface GeneratedSong {
  title: string;
  englishLyrics: string;
  koreanLyrics: string;
}

export async function generateSongLyrics(theme: string, genre: string, musicPrompt: string): Promise<GeneratedSong> {
  const prompt = `
    You are an expert Indie R&B and Folk songwriter.
    Write a song based on the theme: "${theme}". The genre is ${genre}.
    
    Here is the musical direction and tempo for the song:
    "${musicPrompt}"

    CRITICAL INSTRUCTION: Based on the slow tempo (72-82 BPM) provided in the musical direction, the lyrics MUST be concise enough so the song finishes within 3 minutes (around 2 minutes 40 seconds to 3 minutes). Do not write overly long verses. Keep the lines relatively short and the overall word count appropriate for a 3-minute slow-tempo song.
    
    The song must follow this exact structure. You MUST include an empty line (double line break) between each section to separate them clearly:
    
    [Verse 1]
    (lyrics here)

    [Pre-Chorus]
    (lyrics here)

    [Chorus]
    (lyrics here)

    [Verse 2]
    (lyrics here)

    [Pre-Chorus]
    (lyrics here)

    [Chorus]
    (lyrics here)

    [Bridge]
    (lyrics here)

    [Chorus]
    (lyrics here)

    [Outro]
    (lyrics here)

    Provide the title in the format: [${genre}] 'English Title' (Korean Title)
    Provide the lyrics in both English and Korean.
    
    Return the result as a JSON object with the following schema:
    {
      "title": "[${genre}] 'English Title' (Korean Title)",
      "englishLyrics": "The full English lyrics following the structure, with empty lines between sections...",
      "koreanLyrics": "The full Korean lyrics following the structure, with empty lines between sections..."
    }
  `;

  let response;
  try {
    response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: `The title of the song in the format: [${genre}] 'English Title' (Korean Title)`,
            },
            englishLyrics: {
              type: Type.STRING,
              description: "The full English lyrics following the specified structure.",
            },
            koreanLyrics: {
              type: Type.STRING,
              description: "The full Korean lyrics following the specified structure.",
            },
          },
          required: ["title", "englishLyrics", "koreanLyrics"],
        },
      },
    });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    if (error?.status === 429 || error?.message?.includes("429") || error?.message?.includes("RESOURCE_EXHAUSTED") || error?.message?.includes("quota")) {
      throw new Error("AI 사용량이 초과되었습니다. 잠시 후 다시 시도해주세요. (Quota exceeded)");
    }
    throw new Error("곡 생성 중 오류가 발생했습니다. (API Error)");
  }

  const jsonStr = response.text?.trim() || "{}";
  try {
    return JSON.parse(jsonStr) as GeneratedSong;
  } catch (error) {
    console.error("Failed to parse JSON response:", error);
    throw new Error("Failed to generate song.");
  }
}

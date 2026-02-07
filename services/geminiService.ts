
import { GoogleGenAI, Type } from "@google/genai";
import { FormData, HomileticResult, SermonStructureResult, GroundingSource } from "../types";
import { ARTICLES_OF_FAITH } from "../constants";

const getSystemInstruction = (input: FormData) => `Du bist ein theologischer Homiletik-Experte der Neuapostolischen Kirche (NAK). 
Nutze zwingend Luther 2017, den NAK-Katechismus und nac.today.
VERIFIZIERUNG: Nutze Google Search für Bibeltexte auf bibelserver.com. Halluziniere niemals!
BOTSCHAFT (1:1): "${input.message}"
GLAUBENSARTIKEL: ${ARTICLES_OF_FAITH.join("\n")}`;

export const generateHomileticAnalysis = async (input: FormData): Promise<HomileticResult> => {
  // Creating instance right before call as recommended
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const systemInstruction = getSystemInstruction(input) + `\nFokus: Wissenschaftliche Analyse und Hintergründe. Antworte in reinem JSON.`;

  const prompt = `Erstelle eine homiletische Analyse für: ${input.biblePassage}. Zuhörer: ${input.audience}. Botschaft: ${input.message}. Themen: ${input.currentTopics}. Anlass: ${input.specialOccasion || 'Allgemein'}.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      systemInstruction,
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          biblePassage: { type: Type.STRING },
          bibleWord: { type: Type.STRING },
          message: { type: Type.STRING },
          backgrounds: { 
            type: Type.OBJECT, 
            properties: { 
              main: { type: Type.STRING }, 
              deep: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, content: { type: Type.STRING }, sources: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ["title", "content", "sources"] } 
            }, 
            required: ["main", "deep"] 
          },
          exegesis: { 
            type: Type.OBJECT, 
            properties: { 
              main: { type: Type.STRING }, 
              deep: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, content: { type: Type.STRING }, sources: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ["title", "content", "sources"] } 
            }, 
            required: ["main", "deep"] 
          },
          context: { 
            type: Type.OBJECT, 
            properties: { 
              main: { type: Type.STRING }, 
              deep: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, content: { type: Type.STRING }, sources: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ["title", "content", "sources"] } 
            }, 
            required: ["main", "deep"] 
          },
          genre: { 
            type: Type.OBJECT, 
            properties: { 
              main: { type: Type.STRING }, 
              deep: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, content: { type: Type.STRING }, sources: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ["title", "content", "sources"] } 
            }, 
            required: ["main", "deep"] 
          },
          originalText: { 
            type: Type.OBJECT, 
            properties: { 
              main: { type: Type.STRING }, 
              deep: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, content: { type: Type.STRING }, sources: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ["title", "content", "sources"] } 
            }, 
            required: ["main", "deep"] 
          },
          theologicalAspects: { 
            type: Type.OBJECT, 
            properties: { 
              main: { type: Type.STRING }, 
              deep: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, content: { type: Type.STRING }, sources: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ["title", "content", "sources"] } 
            }, 
            required: ["main", "deep"] 
          },
          catechismRef: { 
            type: Type.OBJECT, 
            properties: { 
              main: { type: Type.STRING }, 
              deep: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, content: { type: Type.STRING }, sources: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ["title", "content", "sources"] } 
            }, 
            required: ["main", "deep"] 
          },
          nacTodayRefs: { 
            type: Type.OBJECT, 
            properties: { 
              main: { type: Type.STRING }, 
              deep: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, content: { type: Type.STRING }, sources: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ["title", "content", "sources"] } 
            }, 
            required: ["main", "deep"] 
          },
          meditation: { 
            type: Type.OBJECT, 
            properties: { 
              main: { type: Type.STRING }, 
              deep: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, content: { type: Type.STRING }, sources: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ["title", "content", "sources"] } 
            }, 
            required: ["main", "deep"] 
          },
          communityTransfer: { type: Type.STRING },
          furtherImpulses: { 
            type: Type.OBJECT, 
            properties: { 
              missingWord: { type: Type.STRING }, 
              irritatingParts: { type: Type.STRING }, 
              goodNews: { type: Type.STRING } 
            },
            required: ["missingWord", "irritatingParts", "goodNews"]
          },
          translationComparison: { 
            type: Type.OBJECT, 
            properties: { 
              zuercher: { type: Type.STRING }, 
              guteNachricht: { type: Type.STRING }, 
              elberfelder: { type: Type.STRING }, 
              volxbibel: { type: Type.STRING } 
            },
            required: ["zuercher", "guteNachricht", "elberfelder", "volxbibel"]
          }
        },
        required: ["biblePassage", "bibleWord", "message", "backgrounds", "exegesis", "context", "genre", "originalText", "theologicalAspects", "catechismRef", "nacTodayRefs", "meditation", "communityTransfer", "furtherImpulses", "translationComparison"]
      }
    }
  });

  // Mandatory: extract website URLs from groundingChunks when googleSearch is used
  const groundingSources: GroundingSource[] = [];
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (chunks) {
    for (const chunk of chunks) {
      if (chunk.web) {
        groundingSources.push({
          title: chunk.web.title || '',
          uri: chunk.web.uri || '',
        });
      }
    }
  }

  // Access .text property directly as it is a property (getter), not a method.
  const rawText = response.text || '{}';
  const cleanedJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
  const parsed = JSON.parse(cleanedJson) as HomileticResult;
  parsed.groundingSources = groundingSources;
  return parsed;
};

export const generateSermonStructure = async (
  input: FormData,
  analysis: HomileticResult,
  userImpulses: string
): Promise<SermonStructureResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const systemInstruction = getSystemInstruction(input) + `\nFokus: Praktische Predigtstrukturierung. Antworte in reinem JSON.`;

  const prompt = `
  BASIS-ANALYSE:
  Wort: ${analysis.bibleWord}
  Exegese: ${analysis.exegesis.main}
  Transfer: ${analysis.communityTransfer}
  
  NUTZER-IMPULSE:
  "${userImpulses}"
  
  AUFGABE:
  Erstelle eine Predigtstruktur für ${input.audience}. 
  Die Einleitung braucht genau 3 Punkte. 
  Der Hauptteil zwischen 3 und 5 Punkte. 
  Der Schluss muss eine Zusammenfassung und GENAU 2 prägnante Merksätze enthalten.
  Erstelle zudem "Interessante Verweise" zu passenden Luther 2017 Bibelstellen und NAK-Katechismus-Punkten mit kurzer Erläuterung.
  Achte auf theologische Tiefe und den NAK-Kontext.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      systemInstruction,
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          introduction: {
            type: Type.OBJECT,
            properties: {
              points: { 
                type: Type.ARRAY, 
                items: { 
                  type: Type.OBJECT, 
                  properties: { title: { type: Type.STRING }, description: { type: Type.STRING } },
                  required: ["title", "description"]
                } 
              }
            },
            required: ["points"]
          },
          mainPart: {
            type: Type.OBJECT,
            properties: {
              points: { 
                type: Type.ARRAY, 
                items: { 
                  type: Type.OBJECT, 
                  properties: { title: { type: Type.STRING }, description: { type: Type.STRING } },
                  required: ["title", "description"]
                } 
              }
            },
            required: ["points"]
          },
          conclusion: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              punchyLines: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["summary", "punchyLines"]
          },
          interestingReferences: {
            type: Type.OBJECT,
            properties: {
              bibleReferences: { 
                type: Type.ARRAY, 
                items: { 
                  type: Type.OBJECT, 
                  properties: { reference: { type: Type.STRING }, explanation: { type: Type.STRING } },
                  required: ["reference", "explanation"]
                } 
              },
              catechismReferences: { 
                type: Type.ARRAY, 
                items: { 
                  type: Type.OBJECT, 
                  properties: { reference: { type: Type.STRING }, explanation: { type: Type.STRING } },
                  required: ["reference", "explanation"]
                } 
              }
            },
            required: ["bibleReferences", "catechismReferences"]
          }
        },
        required: ["introduction", "mainPart", "conclusion", "interestingReferences"]
      }
    }
  });

  const rawText = response.text || '{}';
  const cleanedJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(cleanedJson) as SermonStructureResult;
};

import { GoogleGenAI, Type } from "@google/genai";
import { ComicPanelData } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SCRIPT_GENERATION_PROMPT = `
Basado en la siguiente historia, crea un guión para una tira cómica de 4 viñetas.
Para cada viñeta, proporciona:
1.  Una descripción visual detallada y vívida, optimizada para un modelo de generación de imágenes de IA. Describe la escena, los personajes, las acciones y las emociones con claridad.
2.  Una sola línea corta de diálogo o narración.

Historia:
`;

export async function generateComicScript(prompt: string): Promise<ComicPanelData[]> {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `${SCRIPT_GENERATION_PROMPT} "${prompt}"`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            panel: {
                                type: Type.INTEGER,
                                description: 'El número de la viñeta, comenzando desde 1.',
                            },
                            description: {
                                type: Type.STRING,
                                description: 'La descripción visual detallada para el generador de imágenes.',
                            },
                            dialogue: {
                                type: Type.STRING,
                                description: 'La línea de diálogo o narración para la viñeta.',
                            },
                        },
                        required: ["panel", "description", "dialogue"],
                    },
                },
            },
        });

        const jsonText = response.text.trim();
        const scriptData = JSON.parse(jsonText);

        if (!Array.isArray(scriptData) || scriptData.length === 0) {
            throw new Error("La respuesta de la IA no fue un guión de cómic válido.");
        }
        
        return scriptData as ComicPanelData[];

    } catch (error) {
        console.error("Error generating comic script:", error);
        throw new Error("No se pudo generar el guión del cómic. Por favor, intenta de nuevo.");
    }
}

export async function generatePanelImage(description: string): Promise<string> {
    try {
        const fullPrompt = `${description}, en el estilo artístico de Moebius (Jean Giraud), arte de línea clara, detalles intrincados, arte de cómic de ciencia ficción, paleta de colores limitada.`;
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: fullPrompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '1:1',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        } else {
            throw new Error("La API no devolvió ninguna imagen.");
        }
    } catch (error) {
        console.error("Error generating panel image:", error);
        throw new Error("No se pudo generar la imagen para una viñeta.");
    }
}
import React, { useState, useCallback } from 'react';
import { ComicPanelData } from './types';
import { generateComicScript, generatePanelImage } from './services/geminiService';
import Loader from './components/Loader';
import ComicPanel from './components/ComicPanel';
import SparklesIcon from './components/icons/SparklesIcon';

const App: React.FC = () => {
  const [storyPrompt, setStoryPrompt] = useState<string>('');
  const [comicPanels, setComicPanels] = useState<ComicPanelData[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleGenerateComic = useCallback(async () => {
    if (!storyPrompt.trim()) {
      setError('Por favor, escribe una idea para tu cómic.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setComicPanels(null);

    try {
      setLoadingMessage('Creando el guión de tu cómic...');
      const script = await generateComicScript(storyPrompt);
      setComicPanels(script); // Display panels with placeholders

      setLoadingMessage('Generando imágenes para las viñetas...');
      
      const imagePromises = script.map(panel => generatePanelImage(panel.description));
      const imageUrls = await Promise.all(imagePromises);

      const panelsWithImages = script.map((panel, index) => ({
        ...panel,
        imageUrl: imageUrls[index],
      }));
      
      setComicPanels(panelsWithImages);

    } catch (e: any) {
      setError(e.message || 'Ocurrió un error inesperado.');
      setComicPanels(null);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [storyPrompt]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8">
      <div className="container mx-auto max-w-5xl">
        <header className="text-center mb-8">
          <h1 className="text-5xl sm:text-7xl font-display text-yellow-300 tracking-wider" style={{ textShadow: '3px 3px 0px #000' }}>
            Generador de Cómics AI
          </h1>
          <p className="text-purple-300 mt-2 text-lg">
            ¡Convierte tus ideas en una tira cómica al instante!
          </p>
        </header>

        <main>
          <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700">
            <div className="flex flex-col gap-4">
              <label htmlFor="story-prompt" className="text-lg font-bold text-gray-200">
                Describe tu historia:
              </label>
              <textarea
                id="story-prompt"
                value={storyPrompt}
                onChange={(e) => setStoryPrompt(e.target.value)}
                placeholder="Ej: Un astronauta encuentra un gato en Marte que solo habla con acertijos..."
                className="w-full h-28 p-3 bg-gray-900 border-2 border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                disabled={isLoading}
              />
              <button
                onClick={handleGenerateComic}
                disabled={isLoading || !storyPrompt}
                className="w-full sm:w-auto self-center flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-lg text-xl transition-all duration-300 shadow-lg transform hover:scale-105"
              >
                {isLoading ? 'Generando...' : 'Crear Cómic'}
                {!isLoading && <SparklesIcon className="w-6 h-6" />}
              </button>
            </div>
          </div>

          <div className="mt-10">
            {isLoading && <Loader message={loadingMessage} />}
            {error && <div className="text-center p-4 bg-red-900/50 text-red-300 border border-red-700 rounded-lg">{error}</div>}
            
            {comicPanels && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {comicPanels.map((panel) => (
                  <ComicPanel key={panel.panel} panelData={panel} />
                ))}
              </div>
            )}

            {!isLoading && !comicPanels && !error && (
                <div className="text-center p-8 bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-600">
                    <h3 className="text-2xl font-bold text-gray-300">¡Tu lienzo te espera!</h3>
                    <p className="text-gray-400 mt-2">Escribe una historia arriba y presiona "Crear Cómic" para ver la magia de la IA.</p>
                </div>
            )}

          </div>
        </main>

        <footer className="text-center mt-12 text-gray-500 text-sm">
          <p>Creado con React, Tailwind CSS y la API de Gemini. | <a href="https://www.example.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-purple-300 transition-colors">Visita mi Portafolio</a></p>
        </footer>
      </div>
    </div>
  );
};

export default App;
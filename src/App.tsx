import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff } from 'lucide-react';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { useLocalStorage } from './hooks/useLocalStorage';
import { TranscriptDisplay } from './components/TranscriptDisplay';
import { SavedTranscripts } from './components/SavedTranscripts';

function App() {
  const { 
    isListening, 
    transcript, 
    error, 
    currentType,
    startListening, 
    stopListening,
    toggleType 
  } = useSpeechRecognition();
  const { savedTranscripts, saveTranscript, downloadTranscript } = useLocalStorage();
  const recognitionRef = useRef<any>(null);

  const handleToggleListening = () => {
    if (isListening) {
      stopListening(recognitionRef.current);
      recognitionRef.current = null;
    } else {
      recognitionRef.current = startListening();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Speech to Text Assistant
          </h1>
          <p className="text-gray-600 text-lg">
            Your intelligent lecture companion
          </p>
        </motion.div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
            {error}
          </div>
        )}

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex justify-center mb-8"
        >
          <button
            onClick={handleToggleListening}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-full text-white font-medium
              transition-colors duration-200
              ${isListening 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-blue-500 hover:bg-blue-600'}
            `}
          >
            {isListening ? (
              <>
                <MicOff className="w-5 h-5" />
                Stop Recording
              </>
            ) : (
              <>
                <Mic className="w-5 h-5" />
                Start Recording
              </>
            )}
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <TranscriptDisplay 
            segments={transcript}
            currentType={currentType}
            onToggleType={toggleType}
            onSave={saveTranscript}
            onDownload={downloadTranscript}
          />
          <SavedTranscripts
            transcripts={savedTranscripts}
            onDownload={downloadTranscript}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
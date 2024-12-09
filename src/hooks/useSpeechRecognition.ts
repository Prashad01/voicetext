import { useState, useEffect, useCallback } from 'react';
import type { TranscriptSegment } from '../types';

export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptSegment[]>([]);
  const [error, setError] = useState<string>('');
  const [currentType, setCurrentType] = useState<'point' | 'paragraph'>('paragraph');

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      setError('Speech recognition is not supported in this browser.');
      return;
    }
  }, []);

  const toggleType = () => {
    setCurrentType(prev => prev === 'point' ? 'paragraph' : 'point');
  };

  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window)) return;

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const result = event.results[event.results.length - 1];
      if (result.isFinal) {
        setTranscript(prev => [...prev, {
          text: result[0].transcript,
          timestamp: Date.now(),
          type: currentType
        }]);
      }
    };

    recognition.onerror = (event: any) => {
      setError(event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
    return recognition;
  }, [currentType]);

  const stopListening = useCallback((recognition: any) => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  }, []);

  return {
    isListening,
    transcript,
    error,
    currentType,
    startListening,
    stopListening,
    toggleType
  };
};
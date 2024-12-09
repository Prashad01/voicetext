import { useState, useEffect } from 'react';
import type { SavedTranscript, TranscriptSection } from '../types';

export const useLocalStorage = () => {
  const [savedTranscripts, setSavedTranscripts] = useState<SavedTranscript[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('transcripts');
    if (stored) {
      setSavedTranscripts(JSON.parse(stored));
    }
  }, []);

  const saveTranscript = (transcript: SavedTranscript) => {
    const updated = [...savedTranscripts, transcript];
    setSavedTranscripts(updated);
    localStorage.setItem('transcripts', JSON.stringify(updated));
  };

  const downloadTranscript = (transcript: SavedTranscript) => {
    const sections = organizeTranscript(transcript.segments);
    let content = `${transcript.title || 'Transcript'}\nDate: ${new Date(transcript.date).toLocaleString()}\n\n`;

    sections.forEach((section, index) => {
      if (section.type === 'point') {
        content += '\nPoints:\n';
        section.segments.forEach((segment, i) => {
          content += `${i + 1}. ${segment.text}\n`;
        });
      } else {
        content += '\nParagraphs:\n';
        section.segments.forEach(segment => {
          content += `${segment.text}\n\n`;
        });
      }
    });

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcript-${transcript.date}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const organizeTranscript = (segments: SavedTranscript['segments']): TranscriptSection[] => {
    const points = segments.filter(s => s.type === 'point');
    const paragraphs = segments.filter(s => s.type === 'paragraph');
    
    const sections: TranscriptSection[] = [];
    if (points.length > 0) sections.push({ type: 'point', segments: points });
    if (paragraphs.length > 0) sections.push({ type: 'paragraph', segments: paragraphs });
    
    return sections;
  };

  return {
    savedTranscripts,
    saveTranscript,
    downloadTranscript,
    organizeTranscript
  };
};
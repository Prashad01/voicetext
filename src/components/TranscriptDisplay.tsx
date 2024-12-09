import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Save, List, AlignLeft } from 'lucide-react';
import type { TranscriptSegment, SavedTranscript } from '../types';

interface TranscriptDisplayProps {
  segments: TranscriptSegment[];
  currentType: 'point' | 'paragraph';
  onToggleType: () => void;
  onSave: (transcript: SavedTranscript) => void;
  onDownload: (transcript: SavedTranscript) => void;
}

export const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({ 
  segments, 
  currentType,
  onToggleType,
  onSave,
  onDownload 
}) => {
  const [title, setTitle] = useState('');

  const handleSave = () => {
    const transcript: SavedTranscript = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      segments,
      title: title.trim() || undefined
    };
    onSave(transcript);
    setTitle('');
  };

  const handleDownload = () => {
    const transcript: SavedTranscript = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      segments,
      title: title.trim() || undefined
    };
    onDownload(transcript);
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-lg">
      <div className="border-b p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Transcript</h3>
          <div className="flex gap-2">
            <button
              onClick={onToggleType}
              className="flex items-center gap-1 px-3 py-1 rounded bg-purple-500 text-white hover:bg-purple-600 transition-colors"
            >
              {currentType === 'point' ? (
                <>
                  <List className="w-4 h-4" />
                  Points Mode
                </>
              ) : (
                <>
                  <AlignLeft className="w-4 h-4" />
                  Paragraph Mode
                </>
              )}
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1 px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1 px-3 py-1 rounded bg-green-500 text-white hover:bg-green-600 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter transcript title (optional)"
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="max-h-[400px] overflow-y-auto p-6">
        {segments.map((segment, index) => (
          <motion.div
            key={segment.timestamp}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`mb-4 ${
              segment.type === 'point' 
                ? 'pl-4 border-l-4 border-purple-500' 
                : ''
            }`}
          >
            <div className="flex items-center gap-2">
              {segment.type === 'point' && (
                <span className="text-purple-500 font-bold">•</span>
              )}
              <div>
                <p className="text-gray-600 text-sm">
                  {new Date(segment.timestamp).toLocaleTimeString()} - 
                  {segment.type === 'point' ? ' Point' : ' Paragraph'}
                </p>
                <p className="text-gray-800">{segment.text}</p>
              </div>
            </div>
          </motion.div>
        ))}
        {segments.length === 0 && (
          <p className="text-gray-500 text-center italic">
            Your transcript will appear here...
          </p>
        )}
      </div>
    </div>
  );
};
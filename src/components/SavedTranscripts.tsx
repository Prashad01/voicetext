import React from 'react';
import { motion } from 'framer-motion';
import { Download, Trash2 } from 'lucide-react';
import type { SavedTranscript } from '../types';

interface SavedTranscriptsProps {
  transcripts: SavedTranscript[];
  onDownload: (transcript: SavedTranscript) => void;
}

export const SavedTranscripts: React.FC<SavedTranscriptsProps> = ({
  transcripts,
  onDownload,
}) => {
  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold mb-4">Saved Transcripts</h3>
      <div className="space-y-4">
        {transcripts.map((transcript, index) => (
          <motion.div
            key={transcript.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="p-4 border rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">
                  {new Date(transcript.date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  {transcript.segments.length} segments
                </p>
              </div>
              <button
                onClick={() => onDownload(transcript)}
                className="p-2 text-blue-500 hover:text-blue-600 transition-colors"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ))}
        {transcripts.length === 0 && (
          <p className="text-gray-500 text-center italic">
            No saved transcripts yet
          </p>
        )}
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import voiceService from '../services/voiceService';

const VoiceInput = ({ onCommand, onTranscript, language = 'en-IN' }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');

  const startListening = () => {
    setError('');
    setTranscript('');
    setIsListening(true);

    voiceService.setLanguage(language);
    voiceService.startListening(
      (result) => {
        setTranscript(result.transcript);
        setIsListening(false);
        onTranscript?.(result.transcript);
        onCommand?.(result.transcript);
      },
      (err) => {
        setIsListening(false);
        setError('Could not recognize speech. Please try again.');
        console.error('Speech recognition error:', err);
      }
    );
  };

  const stopListening = () => {
    voiceService.stopListening();
    setIsListening(false);
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <button
        onClick={toggleListening}
        disabled={isListening}
        className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
          isListening
            ? 'bg-red-500 hover:bg-red-600 animate-pulse'
            : 'bg-primary-600 hover:bg-primary-700 active:scale-95'
        }`}
        aria-label={isListening ? 'Stop listening' : 'Start listening'}
      >
        {isListening ? (
          <MicOff className="w-12 h-12 text-white" />
        ) : (
          <Mic className="w-12 h-12 text-white" />
        )}
        
        {isListening && (
          <span className="absolute inset-0 rounded-full bg-red-400 opacity-50 animate-ping" />
        )}
      </button>

      <div className="text-center min-h-[60px]">
        {isListening && (
          <div className="flex items-center space-x-2 text-primary-600">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-lg font-medium">Listening...</span>
          </div>
        )}
        
        {transcript && !isListening && (
          <div className="space-y-2">
            <p className="text-sm text-gray-500">You said:</p>
            <p className="text-lg font-medium text-gray-800">{transcript}</p>
          </div>
        )}
        
        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}
        
        {!isListening && !transcript && !error && (
          <p className="text-gray-500 text-sm">
            Tap the microphone to start speaking
          </p>
        )}
      </div>
    </div>
  );
};

export default VoiceInput;

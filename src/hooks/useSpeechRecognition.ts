import { useState, useEffect, useRef, useCallback } from 'react';

// Declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function useSpeechRecognition(onResult?: (transcript: string) => void) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState<number>(0);

  const recognitionRef = useRef<any>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US'; // Supports multilingual speech and transliterated roman Urdu

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
        startAudioSimulation();
      };

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let currentInterim = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const item = event.results[i];
          if (item.isFinal) {
            finalTranscript += item[0].transcript;
          } else {
            currentInterim += item[0].transcript;
          }
        }

        if (currentInterim) {
          setInterimTranscript(currentInterim);
        }

        if (finalTranscript) {
          setTranscript(finalTranscript);
          setInterimTranscript('');
          if (onResult) {
            onResult(finalTranscript);
          }
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('SpeechRecognition error:', event.error);
        if (event.error !== 'no-speech') {
          setError(`Microphone error: ${event.error}`);
        }
        setIsListening(false);
        stopAudioSimulation();
      };

      recognition.onend = () => {
        setIsListening(false);
        stopAudioSimulation();
      };

      recognitionRef.current = recognition;
    } catch (e: any) {
      console.warn('SpeechRecognition init failed:', e);
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      stopAudioSimulation();
    };
  }, [onResult]);

  const startAudioSimulation = () => {
    const simulateWaves = () => {
      const level = Math.random() * 0.7 + 0.3;
      setAudioLevel(level);
      animationFrameRef.current = requestAnimationFrame(simulateWaves);
    };
    animationFrameRef.current = requestAnimationFrame(simulateWaves);
  };

  const stopAudioSimulation = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setAudioLevel(0);
  };

  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      setError('Speech recognition is not available in this browser.');
      return;
    }
    setError(null);
    setTranscript('');
    setInterimTranscript('');
    try {
      recognitionRef.current.start();
    } catch (e: any) {
      // If already started, restart
      recognitionRef.current.stop();
      setTimeout(() => {
        try {
          recognitionRef.current.start();
        } catch (err) {
          console.error(err);
        }
      }, 100);
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
    }
    setIsListening(false);
    stopAudioSimulation();
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    isSupported,
    error,
    audioLevel,
    startListening,
    stopListening,
    resetTranscript,
  };
}

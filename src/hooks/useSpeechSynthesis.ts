import { useState, useEffect, useCallback, useRef } from 'react';

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const selectedVoiceRef = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const updateVoices = () => {
      const available = window.speechSynthesis.getVoices();
      setVoices(available);
      // Prefer modern natural English voice
      const preferred = available.find(
        (v) => (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('David') || v.name.includes('Zira')) && v.lang.startsWith('en')
      ) || available[0];
      selectedVoiceRef.current = preferred || null;
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const speak = useCallback(
    (text: string, rate: number = 1.0) => {
      if (isMuted || !text || typeof window === 'undefined' || !window.speechSynthesis) return;

      window.speechSynthesis.cancel();

      // Clean markdown characters from spoken speech
      const cleanText = text
        .replace(/[*#`_~[\]()]/g, '')
        .replace(/https?:\/\/\S+/g, 'link')
        .substring(0, 300); // keep concise

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = rate;
      utterance.pitch = 1.0;
      if (selectedVoiceRef.current) {
        utterance.voice = selectedVoiceRef.current;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    },
    [isMuted]
  );

  const cancel = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      if (!prev && typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }
      return !prev;
    });
  }, []);

  return {
    isSpeaking,
    isMuted,
    voices,
    speak,
    cancel,
    toggleMute,
  };
}

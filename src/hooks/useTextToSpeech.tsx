import { useState, useEffect, useCallback } from "react";

// Hook for handling text-to-speech functionality
const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechText, setSpeechText] = useState("");
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(
    null
  );

  // Initialize speech synthesis utterance
  useEffect(() => {
    if (speechText && !utterance) {
      const newUtterance = new SpeechSynthesisUtterance(speechText);
      setUtterance(newUtterance);
    }
  }, [speechText, utterance]);

  // Handle speech end event
  useEffect(() => {
    if (utterance) {
      utterance.onend = () => {
        setIsSpeaking(false);
      };

      return () => {
        utterance.onend = null;
      };
    }
  }, [utterance]);

  // Start speaking function
  const speak = useCallback(
    (text: string) => {
      // If already speaking, stop it first
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);

        // If the text is the same, just stop it
        if (text === speechText) {
          setSpeechText("");
          setUtterance(null);
          return;
        }
      }

      // Set new text and start speaking
      setSpeechText(text);
      setIsSpeaking(true);

      // Create a new utterance and speak immediately
      const newUtterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(newUtterance);
      setUtterance(newUtterance);
    },
    [isSpeaking, speechText]
  );

  // Stop speaking function
  const stop = useCallback(() => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isSpeaking]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  return { isSpeaking, speak, stop };
};

export default useTextToSpeech;

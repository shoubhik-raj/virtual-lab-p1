// Utility functions for accessibility features
import { Icon } from "@iconify/react";

export const speak = (text: string, rate = 1, pitch = 1, lang = "en-US") => {
  if ("speechSynthesis" in window) {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.lang = lang;

    window.speechSynthesis.speak(utterance);
    return true;
  }
  return false;
};

export const vibrate = (pattern: number | number[]) => {
  if ("vibrate" in navigator) {
    navigator.vibrate(pattern);
    return true;
  }
  return false;
};

// Example component for text-to-speech button
export const TextToSpeechButton = ({ text }: { text: string }) => {
  const handleClick = () => {
    speak(text);
  };

  return (
    <button
      onClick={handleClick}
      className="px-2 py-1 bg-blue-100 text-blue-600 rounded-md text-sm flex items-center"
      aria-label="Read text aloud"
    >
      <Icon icon="mdi:volume-high" className="mr-1" />
      Listen
    </button>
  );
};

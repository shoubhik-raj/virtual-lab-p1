import React from "react";
import { Icon } from "@iconify/react";
import useTextToSpeech from "../hooks/useTextToSpeech";

interface SpeechButtonProps {
  text: string;
  className?: string;
}

const SpeechButton: React.FC<SpeechButtonProps> = ({
  text,
  className = "",
}) => {
  const { isSpeaking, speak, stop } = useTextToSpeech();

  const handleClick = () => {
    if (isSpeaking) {
      stop();
    } else {
      // Clean the text - remove HTML tags if present
      const cleanText = text.replace(/<[^>]*>/g, "");
      speak(cleanText);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`p-2 rounded-full transition-colors ${
        isSpeaking
          ? "bg-blue-100 text-blue-600"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      } ${className}`}
      title={isSpeaking ? "Stop reading" : "Read aloud"}
      aria-label={isSpeaking ? "Stop reading" : "Read aloud"}
    >
      <Icon
        icon={isSpeaking ? "mdi:stop-circle" : "mdi:text-to-speech"}
        className="text-xl"
      />
    </button>
  );
};

export default SpeechButton;

import React from "react";
import { useNavigate } from "react-router-dom";
import { FlaskRound as Flask } from "lucide-react";

interface LandingPageProps {
  onEnterPortal: () => void;
}

const LandingPage = ({ onEnterPortal }: LandingPageProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-blue-500 to-blue-700 text-white">
      <div className="text-center max-w-md p-8 rounded-lg bg-white bg-opacity-10 backdrop-blur-sm">
        <h1 className="text-4xl font-bold mb-4">Virtual Lab Portal</h1>
        <p className="text-xl mb-8">
          Welcome to the interactive learning platform for engineering students
        </p>
        <button
          onClick={onEnterPortal}
          className="px-8 py-3 bg-white text-blue-700 font-semibold rounded-full transition duration-300 hover:bg-opacity-90 hover:shadow-lg"
        >
          Enter Portal
        </button>
      </div>
    </div>
  );
};

export default LandingPage;

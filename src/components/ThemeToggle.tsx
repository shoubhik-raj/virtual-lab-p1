import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";

const ThemeToggle = () => {
  // State to track if dark mode is active
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Effect to initialize the theme based on localStorage or default to light
  useEffect(() => {
    // Check if theme is already set in localStorage
    const savedTheme = localStorage.getItem("theme");

    // Initialize with saved theme or default to light mode
    const initialIsDark = savedTheme === "dark";

    setIsDarkMode(initialIsDark);

    // Apply the initial theme
    applyTheme(initialIsDark);
  }, []);

  // Function to apply theme changes
  const applyTheme = (isDark: boolean) => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // Toggle between light and dark modes
  const toggleTheme = () => {
    // Toggle the state
    const newIsDarkMode = !isDarkMode;
    setIsDarkMode(newIsDarkMode);

    // Apply the new theme
    applyTheme(newIsDarkMode);

    // Debug info
    console.log("Theme toggled to:", newIsDarkMode ? "dark" : "light");
    console.log("HTML classes:", document.documentElement.classList.toString());
    console.log(
      "Dark class present:",
      document.documentElement.classList.contains("dark")
    );
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {/* Show sun icon when in dark mode, moon icon when in light mode */}
      <Icon
        icon={
          isDarkMode ? "mdi:white-balance-sunny" : "mdi:moon-waning-crescent"
        }
        className="text-xl"
      />
    </button>
  );
};

export default ThemeToggle;

import React from "react";

const ThemeDebug = () => {
  const [theme, setTheme] = React.useState("");

  React.useEffect(() => {
    // Initial check
    updateThemeStatus();

    // Watch for changes
    const observer = new MutationObserver(() => {
      updateThemeStatus();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const updateThemeStatus = () => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  };

  return (
    <div className="fixed bottom-2 right-2 bg-white dark:bg-gray-800 p-2 text-xs rounded shadow z-50">
      Theme: <strong>{theme}</strong>
    </div>
  );
};

export default ThemeDebug;

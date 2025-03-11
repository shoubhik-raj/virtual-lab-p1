import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useState, useEffect } from "react";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Check dark mode on mount and changes
  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setDarkMode(isDark);

      // Force component update by applying a class
      document.body.className = isDark ? "theme-dark" : "theme-light";
    };

    // Check initially
    checkDarkMode();

    // Set up an observer to watch for class changes on html element
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`flex h-screen ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300  ${
          sidebarOpen ? "ml-64" : "ml-16"
        }`}
      >
        {/* Top nav - could be added later */}

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-6 pt-8 mt-3 rounded-tl-xl bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;

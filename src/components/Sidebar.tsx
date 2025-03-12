import { NavLink } from "react-router-dom";
import { Icon } from "@iconify/react";
import ThemeToggle from "./ThemeToggle";
import { useState, useRef, useEffect } from "react";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const [language, setLanguage] = useState("English");
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const languageDropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    "English",
    "Hindi",
    "Tamil",
    "Telugu",
    "Bengali",
    "Marathi",
  ];

  // Close the dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        languageDropdownRef.current &&
        !languageDropdownRef.current.contains(event.target as Node)
      ) {
        setShowLanguageDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`fixed inset-y-0 left-0 z-30 bg-gray-50 dark:bg-gray-800 transition-all duration-300 ${
        isOpen ? "w-64" : "w-16"
      } flex flex-col`}
    >
      {/* Toggle button */}
      <button
        className="absolute -right-3 top-10 bg-white dark:bg-gray-800 rounded-full p-1 shadow-md"
        onClick={toggleSidebar}
      >
        <Icon
          icon={isOpen ? "mdi:chevron-left" : "mdi:chevron-right"}
          className="text-blue-600 text-xl"
        />
      </button>

      {/* Logo & header - always visible */}
      <div className="p-4 flex flex-col items-center">
        {isOpen ? (
          <>
            <img
              src="/assets/img/vlabs-color-small-moe.jpg"
              alt="Virtual Labs"
              className="h-20 w-auto my-2"
            />
            <div className="text-left mt-4 mx-6 font-medium text-gray-800 dark:text-white">
              An MoE Govt of India Initiative
            </div>
          </>
        ) : (
          <Icon icon="mdi:flask" className="text-3xl text-blue-600 my-4" />
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-6">
        {/* Divider */}
        <div className="border-t-2 border-gray-200 dark:border-gray-700 w-full my-4"></div>

        <NavItem
          to="/dashboard"
          icon="mdi:home-outline"
          text="Dashboard"
          isOpen={isOpen}
        />
        <NavItem
          to="/notebook"
          icon="mdi:notebook-outline"
          text="Lab Notebook"
          isOpen={isOpen}
        />
        <NavItem
          to="/collections"
          icon="mdi:bookmark-outline"
          text="Collections"
          isOpen={isOpen}
        />

        {/* Divider */}
        <div className="border-t-2 border-gray-200 dark:border-gray-700 w-full my-4"></div>

        <NavItem
          to="/partners"
          icon="mdi:handshake-outline"
          text="Partners"
          isOpen={isOpen}
        />
        <NavItem
          to="/contact"
          icon="mdi:email-outline"
          text="Contact"
          isOpen={isOpen}
        />
      </nav>

      {/* Theme toggle - positioned above language selector */}
      {isOpen && (
        <div className="px-4 mb-2 flex justify-center">
          <ThemeToggle />
        </div>
      )}

      {/* Language selector at bottom */}
      <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
        {isOpen ? (
          <div
            className="flex items-center px-4 justify-center text-gray-600 dark:text-gray-300 relative"
            ref={languageDropdownRef}
          >
            <span className="font-medium text-gray-400 text-sm">Language</span>
            <div
              className="flex items-center space-x-1 ml-2 cursor-pointer"
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            >
              <span className="font-medium text-sm text-gray-900 dark:text-white">
                {language}
              </span>
              <Icon icon="mdi:chevron-down" className="text-blue-600" />
            </div>

            {/* Language Dropdown */}
            {showLanguageDropdown && (
              <div className="absolute bottom-full left-0 mb-1 w-full bg-white dark:bg-gray-700 rounded-md shadow-lg border border-gray-200 dark:border-gray-600 py-1 z-50">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    className={`w-full text-left px-4 py-2 text-sm ${
                      lang === language
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                        : "hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
                    }`}
                    onClick={() => {
                      setLanguage(lang);
                      setShowLanguageDropdown(false);
                    }}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex justify-center">
            <Icon icon="mdi:web" className="text-gray-500" />
          </div>
        )}
      </div>
    </div>
  );
};

// Helper component for nav links with simpler styling to match design
const NavItem = ({
  to,
  icon,
  text,
  isOpen,
}: {
  to: string;
  icon: string;
  text: string;
  isOpen: boolean;
}) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `
        flex items-center py-3 px-4
        ${
          isActive
            ? "text-gray-800 dark:text-gray-100 font-medium"
            : "text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-white"
        }
      `}
    >
      <Icon icon={icon} className="text-2xl" />
      {isOpen && <span className="ml-4">{text}</span>}
    </NavLink>
  );
};

export default Sidebar;

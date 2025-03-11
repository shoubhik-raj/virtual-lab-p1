const ThemeTest = () => {
  return (
    <div className="p-4 mt-4 rounded-lg">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
        Theme Test
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <p className="text-gray-800 dark:text-white">
            This should be white in light mode and dark in dark mode
          </p>
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md">
          <p className="text-gray-800 dark:text-white">
            This should be light gray in light mode and darker in dark mode
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThemeTest;

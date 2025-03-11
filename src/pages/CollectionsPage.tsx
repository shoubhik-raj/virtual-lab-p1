import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";

interface Collection {
  id: number;
  title: string;
  experimentCount: number;
}

interface Experiment {
  id: number;
  title: string;
  lab: string;
  department: string;
  collectionId: number;
  lastAccessed: string;
}

const CollectionsPage = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [recentExperiments, setRecentExperiments] = useState<Experiment[]>([]);
  const [activeCollection, setActiveCollection] = useState<number | null>(null);

  useEffect(() => {
    // Mock data - in a real app, you would fetch this from local storage or an API
    setCollections([
      { id: 1, title: "Popular Experiments", experimentCount: 4 },
      { id: 2, title: "Circuit Theory", experimentCount: 3 },
      { id: 3, title: "Mechanics Labs", experimentCount: 2 },
      { id: 4, title: "Favorites", experimentCount: 5 },
    ]);

    setRecentExperiments([
      {
        id: 1,
        title: "RC Circuit Analysis",
        lab: "Circuit Theory",
        department: "Electrical Engineering",
        collectionId: 2,
        lastAccessed: "2023-09-18",
      },
      {
        id: 2,
        title: "Beam Deflection",
        lab: "Strength of Materials",
        department: "Mechanical Engineering",
        collectionId: 3,
        lastAccessed: "2023-09-15",
      },
      {
        id: 3,
        title: "Logic Gates",
        lab: "Digital Logic",
        department: "Computer Science",
        collectionId: 1,
        lastAccessed: "2023-09-10",
      },
    ]);

    // Set first collection as active by default
    setActiveCollection(1);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
        My Collections
      </h1>

      {/* Recently Bookmarked */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          Recently Bookmarked
        </h2>
        <div className="flex overflow-x-auto pb-4 space-x-4">
          {recentExperiments.map((exp) => (
            <div
              key={exp.id}
              className="flex-shrink-0 w-72 bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
            >
              <Link
                to={`/experiments/${exp.id}`}
                className="block hover:text-blue-600"
              >
                <h3 className="font-medium text-gray-800 dark:text-white">
                  {exp.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {exp.lab} • {exp.department}
                </p>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Last accessed: {exp.lastAccessed}
                  </span>
                  <Icon icon="mdi:arrow-right" className="text-blue-600" />
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Collections */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex overflow-x-auto">
            {collections.map((collection) => (
              <button
                key={collection.id}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                  activeCollection === collection.id
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
                onClick={() => setActiveCollection(collection.id)}
              >
                {collection.title} ({collection.experimentCount})
              </button>
            ))}
            <button className="px-6 py-3 text-sm font-medium text-blue-600 whitespace-nowrap flex items-center">
              <Icon icon="mdi:plus" className="mr-1" />
              New Collection
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeCollection && (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {collections.find((c) => c.id === activeCollection)?.title}
                </h2>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-sm text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                    Sort
                  </button>
                  <button className="px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900">
                    Edit
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentExperiments
                  .filter((exp) => exp.collectionId === activeCollection)
                  .map((exp) => (
                    <Link
                      key={exp.id}
                      to={`/experiments/${exp.id}`}
                      className="block bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                    >
                      <h3 className="font-medium text-gray-800 dark:text-white">
                        {exp.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {exp.lab}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                        {exp.department}
                      </p>
                    </Link>
                  ))}
                <div className="flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border-2 border-dashed border-gray-300 dark:border-gray-600">
                  <button className="text-blue-600 flex items-center">
                    <Icon icon="mdi:plus" className="mr-2" />
                    Add Experiment
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollectionsPage;

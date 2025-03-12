import { Link } from "react-router-dom";
import { useData } from "../contexts/DataContext";
import { Icon } from "@iconify/react";
import { useState } from "react";

const CollectionsPage = () => {
  const { collections, experiments, deleteCollection } = useData();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter collections by search query
  const filteredCollections = collections.filter((collection) =>
    collection.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get experiment details for each collection
  const collectionsWithDetails = filteredCollections.map((collection) => {
    const collectionExperiments = collection.experimentIds
      .map((id) => experiments.find((exp) => exp.id === id))
      .filter(Boolean);

    const thumbnails = collectionExperiments
      .slice(0, 3)
      .map((exp) => exp?.thumbnail || "");

    return {
      ...collection,
      experimentCount: collection.experimentIds.length,
      experiments: collectionExperiments,
      thumbnails,
    };
  });

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-medium">Experiment Collections</h1>
        <div className="relative w-96">
          <input
            type="text"
            placeholder="Search collections..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Icon
            icon="mdi:magnify"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
        </div>
      </div>

      {/* Collections grid */}
      <div className="space-y-6">
        {collectionsWithDetails.length > 0 ? (
          collectionsWithDetails.map((collection) => (
            <div
              key={collection.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden"
            >
              <Link to={`/collections/${collection.id}`} className="block">
                <div className="p-6 pb-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-medium text-gray-900">
                        {collection.title}
                      </h2>
                      <p className="text-gray-500 mt-1">
                        {collection.experimentCount} Experiments
                      </p>
                    </div>
                    <div className="flex items-center">
                      <Icon
                        icon="mdi:arrow-right"
                        className="text-2xl text-gray-400"
                      />
                    </div>
                  </div>

                  {/* Experiment Thumbnails */}
                  <div className="grid grid-cols-3 gap-4">
                    {collection.thumbnails.map((thumbnail, index) => (
                      <div key={index} className="aspect-video">
                        <img
                          src={thumbnail}
                          alt=""
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </Link>

              {/* Show experiments in this collection */}
              <div className="px-6 py-4 border-t border-gray-100">
                <h3 className="text-sm font-medium text-gray-500 mb-3">
                  EXPERIMENTS IN THIS COLLECTION
                </h3>
                <div className="space-y-2">
                  {collection.experiments.slice(0, 3).map((exp) => (
                    <Link
                      key={exp?.id}
                      to={`/experiments/${exp?.id}`}
                      className="flex items-center p-2 hover:bg-gray-50 rounded"
                    >
                      <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center mr-3">
                        <Icon
                          icon="mdi:flask-outline"
                          className="text-gray-500"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-gray-800 font-medium">
                          {exp?.name}
                        </h4>
                      </div>
                      <Icon icon="mdi:arrow-right" className="text-gray-400" />
                    </Link>
                  ))}

                  {collection.experimentCount > 3 && (
                    <Link
                      to={`/collections/${collection.id}`}
                      className="block text-blue-500 text-sm font-medium mt-2"
                    >
                      View all {collection.experimentCount} experiments
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
            <Icon
              icon="mdi:folder-open-outline"
              className="text-6xl text-gray-400 mx-auto mb-4"
            />
            <h3 className="text-xl font-medium text-gray-800 mb-2">
              No Collections Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create a collection by bookmarking experiments.
            </p>
            <Link
              to="/dashboard"
              className="px-4 py-2 bg-blue-600 text-white rounded-md inline-flex items-center"
            >
              <Icon icon="mdi:flask" className="mr-2" /> Browse Experiments
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionsPage;

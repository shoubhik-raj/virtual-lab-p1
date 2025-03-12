import { useParams, Link } from "react-router-dom";
import { useData } from "../contexts/DataContext";
import { Icon } from "@iconify/react";

const CollectionDetailPage = () => {
  const { collectionId } = useParams<{ collectionId: string }>();
  const {
    getCollectionById,
    experiments,
    removeExperimentFromCollection,
    deleteCollection,
  } = useData();

  const collection = getCollectionById(collectionId || "");

  if (!collection) {
    return (
      <div className="max-w-7xl mx-auto p-6 text-center py-12">
        <Icon
          icon="mdi:alert-circle-outline"
          className="text-6xl text-red-500 mx-auto mb-4"
        />
        <h2 className="text-2xl font-medium text-gray-800 mb-2">
          Collection Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          The collection you're looking for doesn't exist or has been deleted.
        </p>
        <Link
          to="/collections"
          className="px-4 py-2 bg-blue-600 text-white rounded-md inline-flex items-center"
        >
          <Icon icon="mdi:arrow-left" className="mr-2" /> Back to Collections
        </Link>
      </div>
    );
  }

  // Get full experiment details
  const collectionExperiments = collection.experimentIds
    .map((id) => experiments.find((exp) => exp.id === id))
    .filter(Boolean);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-6">
          <Link to="/collections" className="text-blue-500 mr-4">
            <Icon icon="mdi:arrow-left" className="text-xl" />
          </Link>
          <h1 className="text-2xl font-medium">{collection.title}</h1>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-gray-600">
            {collection.experimentIds.length} experiments in this collection
          </p>
          <button
            onClick={() => {
              if (
                window.confirm(
                  "Are you sure you want to delete this collection? This cannot be undone."
                )
              ) {
                deleteCollection(collection.id);
                window.location.href = "/collections";
              }
            }}
            className="text-red-500 hover:text-red-700 font-medium flex items-center"
          >
            <Icon icon="mdi:delete" className="mr-1" />
            Delete Collection
          </button>
        </div>
      </div>

      {/* Experiments grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collectionExperiments.map((exp) => (
          <div
            key={exp?.id}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <Link to={`/experiments/${exp?.id}`}>
              <img
                src={exp?.thumbnail || "/assets/img/placeholder.jpg"}
                alt={exp?.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="font-medium text-gray-900">{exp?.name}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {exp?.aim.substring(0, 80)}...
                </p>
              </div>
            </Link>
            <div className="px-4 pb-4 flex justify-end">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (
                    window.confirm(
                      "Remove this experiment from the collection?"
                    )
                  ) {
                    removeExperimentFromCollection(
                      collection.id,
                      exp?.id || ""
                    );
                  }
                }}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {collectionExperiments.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <Icon
            icon="mdi:flask-empty-outline"
            className="text-6xl text-gray-400 mx-auto mb-4"
          />
          <h3 className="text-xl font-medium text-gray-800 mb-2">
            No Experiments in this Collection
          </h3>
          <p className="text-gray-600 mb-6">
            Start adding experiments to this collection.
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
  );
};

export default CollectionDetailPage;

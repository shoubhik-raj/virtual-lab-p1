import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useData } from "../contexts/DataContext";

interface CollectionModalProps {
  experimentId: string;
  isOpen: boolean;
  onClose: () => void;
}

const CollectionModal: React.FC<CollectionModalProps> = ({
  experimentId,
  isOpen,
  onClose,
}) => {
  const {
    collections,
    createCollection,
    addExperimentToCollection,
    removeExperimentFromCollection,
    getCollectionsByExperimentId,
  } = useData();

  const [newCollectionName, setNewCollectionName] = useState("");
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [experimentCollections, setExperimentCollections] = useState<string[]>(
    []
  );
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  // Initialize collections this experiment is already in
  useEffect(() => {
    const inCollections = getCollectionsByExperimentId(experimentId);
    setExperimentCollections(inCollections.map((c) => c.id));
  }, [experimentId, getCollectionsByExperimentId]);

  // Handle collection toggle
  const toggleCollection = (collectionId: string) => {
    if (experimentCollections.includes(collectionId)) {
      removeExperimentFromCollection(collectionId, experimentId);
      setExperimentCollections((prev) =>
        prev.filter((id) => id !== collectionId)
      );
    } else {
      addExperimentToCollection(collectionId, experimentId);
      setExperimentCollections((prev) => [...prev, collectionId]);
    }
  };

  // Create new collection
  const handleCreateCollection = () => {
    if (newCollectionName.trim()) {
      const newId = createCollection(newCollectionName.trim());
      addExperimentToCollection(newId, experimentId);
      setExperimentCollections((prev) => [...prev, newId]);
      setNewCollectionName("");
      setIsCreatingNew(false);
    }
  };

  // Handle close with animation
  const handleClose = () => {
    setIsAnimatingOut(true);
    setTimeout(() => {
      setIsAnimatingOut(false);
      onClose();
    }, 200); // Match animation duration
  };

  if (!isOpen && !isAnimatingOut) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-200 ${
        isAnimatingOut ? "opacity-0" : "opacity-100"
      }`}
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      onClick={handleClose}
    >
      <div
        className={`bg-white rounded-lg shadow-lg w-full max-w-md mx-4 transition-all duration-200 ${
          isAnimatingOut ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header with icon */}
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-4">
              <Icon
                icon="mdi:bookmark-outline"
                className="text-orange-400 text-xl"
              />
            </div>
            <h3 className="text-xl font-medium text-gray-800">
              Add experiment to collection
            </h3>
          </div>

          {/* Collection list */}
          <div className="max-h-80 overflow-y-auto mb-6">
            {collections.length > 0 ? (
              <div className="space-y-4">
                {collections.map((collection) => (
                  <div
                    key={collection.id}
                    className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                    onClick={() => toggleCollection(collection.id)}
                  >
                    <div className="mr-4">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          experimentCollections.includes(collection.id)
                            ? "bg-blue-500"
                            : "border border-gray-300"
                        }`}
                      >
                        {experimentCollections.includes(collection.id) && (
                          <Icon
                            icon="mdi:check"
                            className="text-white text-sm"
                          />
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">
                        {collection.title}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500">
                  No collections yet. Create your first collection below.
                </p>
              </div>
            )}
          </div>

          {/* Create new collection */}
          {isCreatingNew ? (
            <div className="mt-4">
              <input
                type="text"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                placeholder="Collection name"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsCreatingNew(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateCollection}
                  disabled={!newCollectionName.trim()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
                >
                  Create
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsCreatingNew(true)}
              className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50"
            >
              <Icon icon="mdi:plus" />
              Create New collection
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollectionModal;

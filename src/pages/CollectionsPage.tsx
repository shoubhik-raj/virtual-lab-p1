import { Link } from "react-router-dom";
import { useData } from "../contexts/DataContext";
import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";

const CollectionsPage = () => {
  const { experiments, labs, departments } = useData();
  const [searchQuery, setSearchQuery] = useState("");

  // Mock collections data structure to match the screenshot
  const collections = [
    {
      id: 1,
      title: "Physics Semester 1 Collection",
      experimentCount: 7,
      experiments: experiments.slice(0, 3), // Just for demo, showing first 3 experiments
      thumbnails: [
        "/assets/img/breadboard.jpg",
        "/assets/img/circuit.jpg",
        "/assets/img/logic-gates.jpg",
      ],
    },
    {
      id: 2,
      title: "Chemistry Revision Test Syllabus",
      experimentCount: 2,
      experiments: experiments.slice(3, 5),
      thumbnails: ["/assets/img/chemistry1.jpg", "/assets/img/chemistry2.jpg"],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-medium">Experiment Collection</h1>
        <div className="relative w-96">
          <input
            type="text"
            placeholder="Search for experiments, laboratories etc"
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Icon
            icon="mdi:magnify"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
        </div>
      </div>

      {/* Collections Grid */}
      <div className="space-y-6">
        {collections.map((collection) => (
          <div
            key={collection.id}
            className="bg-white rounded-xl border border-gray-200 p-6"
          >
            <Link to={`/collections/${collection.id}`}>
              <div className="flex items-center justify-between mb-6">
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
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollectionsPage;

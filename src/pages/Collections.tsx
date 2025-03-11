import React, { useState, useEffect } from 'react';
import { Plus, Search, Folder, BookOpen, Trash2, ChevronRight } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface Collection {
  id: string;
  name: string;
  description: string;
  date: string;
  experiments: Experiment[];
}

interface Experiment {
  id: string;
  title: string;
  department: string;
  thumbnail: string;
  progress: number;
}

export default function Collections() {
  const [collections, setCollections] = useState<Collection[]>(() => {
    const savedCollections = localStorage.getItem('collections');
    return savedCollections ? JSON.parse(savedCollections) : [
      {
        id: uuidv4(),
        name: 'Electronics Basics',
        description: 'Fundamental electronics experiments',
        date: new Date().toISOString(),
        experiments: [
          {
            id: uuidv4(),
            title: 'Basic Breadboard Understanding',
            department: 'Electronics & Communications',
            thumbnail: 'https://images.unsplash.com/photo-1631722670977-394a3257333d?auto=format&fit=crop&q=80&w=300&h=200',
            progress: 75
          }
        ]
      }
    ];
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newCollection, setNewCollection] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    localStorage.setItem('collections', JSON.stringify(collections));
  }, [collections]);

  const handleCreateCollection = () => {
    if (newCollection.name) {
      const collection: Collection = {
        id: uuidv4(),
        ...newCollection,
        date: new Date().toISOString(),
        experiments: []
      };
      setCollections([collection, ...collections]);
      setNewCollection({ name: '', description: '' });
      setIsCreating(false);
    }
  };

  const handleDeleteCollection = (id: string) => {
    setCollections(collections.filter(collection => collection.id !== id));
  };

  const filteredCollections = collections.filter(collection =>
    collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collection.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Collections</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search collections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg w-64"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Collection
          </button>
        </div>
      </header>

      {isCreating && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Collection Name"
              value={newCollection.name}
              onChange={(e) => setNewCollection({ ...newCollection, name: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
            <textarea
              placeholder="Collection Description"
              value={newCollection.description}
              onChange={(e) => setNewCollection({ ...newCollection, description: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg h-32"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCollection}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Collection
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {filteredCollections.map((collection) => (
          <div
            key={collection.id}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-3">
                <Folder className="h-6 w-6 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-lg">{collection.name}</h3>
                  <p className="text-sm text-gray-600">{collection.description}</p>
                  <p className="text-xs text-gray-500">
                    Created on {new Date(collection.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleDeleteCollection(collection.id)}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {collection.experiments.map((experiment) => (
                <div
                  key={experiment.id}
                  className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <img
                    src={experiment.thumbnail}
                    alt={experiment.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{experiment.title}</h4>
                    <p className="text-sm text-gray-600">{experiment.department}</p>
                    <div className="mt-2 flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${experiment.progress}%` }}
                        />
                      </div>
                      <span className="ml-2 text-sm text-gray-600">
                        {experiment.progress}%
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              ))}
              {collection.experiments.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                  <BookOpen className="h-12 w-12 mb-2" />
                  <p>No experiments in this collection yet</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
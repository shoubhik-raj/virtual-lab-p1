import React, { createContext, useContext, useState, useEffect } from "react";
import * as initialData from "../data/newMockData";

// Define interfaces for our data types
export interface Simulation {
  id: string;
  name: string;
  code: string;
}

export interface Experiment {
  id: string;
  labId: string;
  institution: string;
  name: string;
  aim: string;
  theory: string;
  pretest: string;
  procedure: string;
  posttest: string;
  references: string;
  contributors: string;
  faqs: { question: string; answer: string }[];
  thumbnail: string;
  simulation?: Simulation[];
}

export interface Lab {
  id: string;
  name: string;
  description: string;
  discipline: string;
  targetAudience: string;
  courseAlignment: string;
  thumbnail: string;
  institution: string;
  institutionLogo: string;
  experimentCount: number;
  experiments: Experiment[];
}

export interface Department {
  id: number;
  name: string;
  institution: string;
  labCount: number;
  labs: Lab[];
}

// Add to existing interfaces
export interface TabProgress {
  aim: boolean;
  theory: boolean;
  procedure: boolean;
  simulation: boolean;
  pretest: boolean;
  posttest: boolean;
}

export interface ExperimentProgress {
  overall: number;
  tabs: TabProgress;
}

// Add this interface to define collection structure
export interface Collection {
  id: string;
  title: string;
  experimentIds: string[];
  lastModified: number; // timestamp
  description?: string;
  thumbnail?: string;
}

// Define our context type
export interface DataContextType {
  departments: Department[];
  labs: Lab[];
  experiments: Experiment[];
  userProgress: { [key: string]: ExperimentProgress }; // experimentId -> progress percentage
  userBookmarks: number[]; // experimentIds that are bookmarked
  userNotes: Record<number, string>; // experimentId -> notes
  collections: Collection[];

  // CRUD operations
  updateExperimentProgress: (experimentId: number, progress: number) => void;
  toggleBookmark: (experimentId: number) => void;
  saveNote: (experimentId: number, note: string) => void;

  // Data access helpers
  getDepartmentById: (id: number) => Department | undefined;
  getLabById: (id: string) => Lab | undefined;
  getExperimentById: (id: string) => Experiment | undefined;
  getLabsByDepartment: (departmentId: number) => Lab[];
  getExperimentsByLab: (labId: string) => Experiment[];

  // New functions
  markTabCompleted: (experimentId: string, tabName: string) => void;
  createCollection: (title: string, description?: string) => string;
  addExperimentToCollection: (
    collectionId: string,
    experimentId: string
  ) => void;
  removeExperimentFromCollection: (
    collectionId: string,
    experimentId: string
  ) => void;
  deleteCollection: (collectionId: string) => void;
  getCollectionById: (id: string) => Collection | undefined;
  getCollectionsByExperimentId: (experimentId: string) => Collection[];
}

// Create the context
const DataContext = createContext<DataContextType | undefined>(undefined);

// Provider component
export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Initialize state with data from mock file and localStorage
  const [departments, setDepartments] = useState<Department[]>(() => {
    return initialData.departments;
  });

  // Extract labs and experiments from departments
  const [labs, setLabs] = useState<Lab[]>(() => {
    return departments.flatMap((dept) => dept.labs || []);
  });

  const [experiments, setExperiments] = useState<Experiment[]>(() => {
    return labs.flatMap((lab) => lab.experiments || []);
  });

  // Debugging logs
  console.log("Departments:", departments);
  console.log("Labs:", labs);
  console.log("Experiments:", experiments);

  // User-specific data
  const [userProgress, setUserProgress] = useState<{
    [key: string]: ExperimentProgress;
  }>(() => {
    const saved = localStorage.getItem("virtualLab_progress");
    return saved ? JSON.parse(saved) : {};
  });

  const [userBookmarks, setUserBookmarks] = useState<number[]>(() => {
    const saved = localStorage.getItem("virtualLab_bookmarks");
    return saved ? JSON.parse(saved) : [];
  });

  const [userNotes, setUserNotes] = useState<Record<number, string>>(() => {
    const saved = localStorage.getItem("virtualLab_notes");
    return saved ? JSON.parse(saved) : {};
  });

  // Save to localStorage whenever user data changes
  useEffect(() => {
    localStorage.setItem("virtualLab_progress", JSON.stringify(userProgress));
  }, [userProgress]);

  useEffect(() => {
    localStorage.setItem("virtualLab_bookmarks", JSON.stringify(userBookmarks));
  }, [userBookmarks]);

  useEffect(() => {
    localStorage.setItem("virtualLab_notes", JSON.stringify(userNotes));
  }, [userNotes]);

  // New state for collections
  const [collections, setCollections] = useState<Collection[]>(() => {
    const saved = localStorage.getItem("virtualLab_collections");
    return saved ? JSON.parse(saved) : [];
  });

  // Save collections to localStorage when changed
  useEffect(() => {
    localStorage.setItem("virtualLab_collections", JSON.stringify(collections));
  }, [collections]);

  // CRUD operations
  const updateExperimentProgress = (experimentId: number, progress: number) => {
    setUserProgress((prev) => ({
      ...prev,
      [experimentId]: {
        overall: progress,
        tabs: {
          aim: false,
          theory: false,
          procedure: false,
          simulation: false,
          pretest: false,
          posttest: false,
        },
      },
    }));
  };

  const toggleBookmark = (experimentId: number) => {
    setUserBookmarks((prev) => {
      if (prev.includes(experimentId)) {
        return prev.filter((id) => id !== experimentId);
      } else {
        return [...prev, experimentId];
      }
    });
  };

  const saveNote = (experimentId: number, note: string) => {
    setUserNotes((prev) => ({
      ...prev,
      [experimentId]: note,
    }));
  };

  // Helper functions to access data
  const getDepartmentById = (id: number) => {
    return departments.find((dept) => dept.id === id);
  };

  const getLabById = (id: string) => {
    return labs.find((lab) => lab.id === id);
  };

  const getExperimentById = (id: string) => {
    return experiments.find((exp) => exp.id === id);
  };

  const getLabsByDepartment = (departmentId: number) => {
    return labs.filter((lab) => {
      const dept = departments.find((d) => d.id === departmentId);
      return dept?.labs.some((l) => l.id === lab.id);
    });
  };

  const getExperimentsByLab = (labId: string) => {
    return experiments.filter((exp) => exp.labId === labId);
  };

  // Function to mark tab as completed
  const markTabCompleted = (experimentId: string, tabName: string) => {
    setUserProgress((prev) => {
      // Get existing progress or create a new one
      const currentProgress = prev[experimentId] || {
        overall: 0,
        tabs: {
          aim: false,
          theory: false,
          procedure: false,
          simulation: false,
          pretest: false,
          posttest: false,
        },
      };

      // Update the tab
      const updatedTabs = { ...currentProgress.tabs, [tabName]: true };

      // Calculate new overall progress (6 important tabs)
      const completedTabs = Object.values(updatedTabs).filter(Boolean).length;
      const newOverall = Math.round((completedTabs / 6) * 100);

      // Return updated progress
      const newProgress = {
        ...prev,
        [experimentId]: {
          overall: newOverall,
          tabs: updatedTabs,
        },
      };

      // Store in localStorage
      localStorage.setItem("virtualLab_progress", JSON.stringify(newProgress));

      return newProgress;
    });
  };

  // Collection management functions
  const createCollection = (title: string, description?: string): string => {
    const newId = Date.now().toString();

    setCollections((prev) => [
      ...prev,
      {
        id: newId,
        title,
        description: description || "",
        experimentIds: [],
        lastModified: Date.now(),
        thumbnail: "", // Will be updated when experiments are added
      },
    ]);

    return newId;
  };

  const addExperimentToCollection = (
    collectionId: string,
    experimentId: string
  ) => {
    setCollections((prev) => {
      return prev.map((collection) => {
        if (collection.id === collectionId) {
          // Only add if not already in collection
          if (!collection.experimentIds.includes(experimentId)) {
            // Find experiment to potentially use as thumbnail
            const experiment = experiments.find((e) => e.id === experimentId);

            return {
              ...collection,
              experimentIds: [...collection.experimentIds, experimentId],
              lastModified: Date.now(),
              // Update thumbnail if not set and experiment has one
              thumbnail: collection.thumbnail || experiment?.thumbnail || "",
            };
          }
        }
        return collection;
      });
    });
  };

  const removeExperimentFromCollection = (
    collectionId: string,
    experimentId: string
  ) => {
    setCollections((prev) => {
      return prev.map((collection) => {
        if (collection.id === collectionId) {
          return {
            ...collection,
            experimentIds: collection.experimentIds.filter(
              (id) => id !== experimentId
            ),
            lastModified: Date.now(),
          };
        }
        return collection;
      });
    });
  };

  const deleteCollection = (collectionId: string) => {
    setCollections((prev) => prev.filter((c) => c.id !== collectionId));
  };

  const getCollectionById = (id: string) => {
    return collections.find((c) => c.id === id);
  };

  const getCollectionsByExperimentId = (experimentId: string) => {
    return collections.filter((c) => c.experimentIds.includes(experimentId));
  };

  // Provide the context value
  const contextValue: DataContextType = {
    departments,
    labs,
    experiments,
    userProgress,
    userBookmarks,
    userNotes,
    collections,
    updateExperimentProgress,
    toggleBookmark,
    saveNote,
    getDepartmentById,
    getLabById,
    getExperimentById,
    getLabsByDepartment,
    getExperimentsByLab,
    markTabCompleted,
    createCollection,
    addExperimentToCollection,
    removeExperimentFromCollection,
    deleteCollection,
    getCollectionById,
    getCollectionsByExperimentId,
  };

  return (
    <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
  );
};

// Custom hook to use the data context
export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

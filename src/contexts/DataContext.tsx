import React, { createContext, useContext, useState, useEffect } from "react";
import * as initialData from "../data/newMockData";
import * as storage from "../utils/storage";
import {
  Department,
  Lab,
  Experiment,
  TabProgress,
  ExperimentProgress,
  Collection,
  StickyNote,
} from "../types";

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
  stickyNotes: Record<string, StickyNote[]>;
  additionalNotes: Record<string, string>;

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
  getExperimentStickyNotes: (experimentId: string) => StickyNote[];
  addStickyNote: (
    experimentId: string,
    text: string,
    color: string
  ) => StickyNote;
  updateStickyNote: (
    experimentId: string,
    noteId: string,
    text: string
  ) => void;
  deleteStickyNote: (experimentId: string, noteId: string) => void;
  saveAdditionalNotes: (experimentId: string, content: string) => void;
  getExperimentAdditionalNotes: (experimentId: string) => string;
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

  // Add these to DataContext state and provide methods
  const [stickyNotes, setStickyNotes] = useState<Record<string, StickyNote[]>>(
    {}
  );
  const [additionalNotes, setAdditionalNotes] = useState<
    Record<string, string>
  >({});

  // Load sticky notes on initial load
  useEffect(() => {
    // Load sticky notes from localStorage on initial load
    const storedNotes = storage.getStickyNotes();
    if (storedNotes && Object.keys(storedNotes).length > 0) {
      setStickyNotes(storedNotes);
      console.log("Loaded sticky notes:", storedNotes);
    }

    // Load additional notes
    const storedAdditionalNotes = storage.getAdditionalNotes();
    if (
      storedAdditionalNotes &&
      Object.keys(storedAdditionalNotes).length > 0
    ) {
      setAdditionalNotes(storedAdditionalNotes);
    }
  }, []);

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

  // Function to get sticky notes for an experiment
  const getExperimentStickyNotes = (experimentId: string) => {
    return stickyNotes[experimentId] || [];
  };

  // Function to add a sticky note
  const addStickyNote = (experimentId: string, text: string, color: string) => {
    const newNote: StickyNote = {
      id: Date.now().toString(),
      text,
      color,
      experimentId,
      createdAt: new Date().toISOString(),
    };

    const updatedNotes = { ...stickyNotes };
    if (!updatedNotes[experimentId]) {
      updatedNotes[experimentId] = [];
    }
    updatedNotes[experimentId] = [...updatedNotes[experimentId], newNote];

    setStickyNotes(updatedNotes);
    storage.saveStickyNote(newNote);

    return newNote;
  };

  // Function to update a sticky note
  const updateStickyNote = (
    experimentId: string,
    noteId: string,
    text: string
  ) => {
    if (!stickyNotes[experimentId]) return;

    const noteIndex = stickyNotes[experimentId].findIndex(
      (n) => n.id === noteId
    );
    if (noteIndex < 0) return;

    const updatedNotes = { ...stickyNotes };
    const updatedNote = { ...updatedNotes[experimentId][noteIndex], text };
    updatedNotes[experimentId][noteIndex] = updatedNote;

    setStickyNotes(updatedNotes);
    storage.saveStickyNote(updatedNote);
  };

  // Function to delete a sticky note
  const deleteStickyNote = (experimentId: string, noteId: string) => {
    if (!stickyNotes[experimentId]) return;

    const updatedNotes = { ...stickyNotes };
    updatedNotes[experimentId] = updatedNotes[experimentId].filter(
      (n) => n.id !== noteId
    );

    setStickyNotes(updatedNotes);
    storage.deleteStickyNote(experimentId, noteId);
  };

  // Function to save additional notes (Quill editor content)
  const saveAdditionalNotes = (experimentId: string, content: string) => {
    const updatedNotes = { ...additionalNotes, [experimentId]: content };
    setAdditionalNotes(updatedNotes);
    storage.saveAdditionalNotes(experimentId, content);
  };

  // Function to get additional notes
  const getExperimentAdditionalNotes = (experimentId: string) => {
    return additionalNotes[experimentId] || "";
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
    stickyNotes,
    additionalNotes,
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
    getExperimentStickyNotes,
    addStickyNote,
    updateStickyNote,
    deleteStickyNote,
    saveAdditionalNotes,
    getExperimentAdditionalNotes,
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

// Create a utility file for local storage operations

export const saveExperimentProgress = (
  experimentId: number,
  progress: number
) => {
  const progressData = JSON.parse(
    localStorage.getItem("experimentProgress") || "{}"
  );
  progressData[experimentId] = progress;
  localStorage.setItem("experimentProgress", JSON.stringify(progressData));
};

export const getExperimentProgress = (experimentId: number): number => {
  const progressData = JSON.parse(
    localStorage.getItem("experimentProgress") || "{}"
  );
  return progressData[experimentId] || 0;
};

export const saveNote = (note: any) => {
  const notes = JSON.parse(localStorage.getItem("labNotes") || "[]");
  const existingNoteIndex = notes.findIndex((n: any) => n.id === note.id);

  if (existingNoteIndex >= 0) {
    notes[existingNoteIndex] = { ...note, updatedAt: new Date().toISOString() };
  } else {
    notes.push({
      ...note,
      id: Date.now(),
      updatedAt: new Date().toISOString(),
    });
  }

  localStorage.setItem("labNotes", JSON.stringify(notes));
};

export const getNotes = () => {
  return JSON.parse(localStorage.getItem("labNotes") || "[]");
};

export const bookmarkExperiment = (
  experimentId: number,
  collectionId: number
) => {
  const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");

  if (
    !bookmarks.some(
      (b: any) =>
        b.experimentId === experimentId && b.collectionId === collectionId
    )
  ) {
    bookmarks.push({
      experimentId,
      collectionId,
      addedAt: new Date().toISOString(),
    });
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }
};

// Sticky notes structure in localStorage
export interface StickyNote {
  id: string;
  text: string;
  color: string;
  experimentId: string;
  createdAt: string;
}

// Get all sticky notes
export const getStickyNotes = (): Record<string, StickyNote[]> => {
  const notes = localStorage.getItem("stickyNotes");
  return notes ? JSON.parse(notes) : {};
};

// Get sticky notes for a specific experiment
export const getExperimentStickyNotes = (
  experimentId: string
): StickyNote[] => {
  const allNotes = getStickyNotes();
  return allNotes[experimentId] || [];
};

// Save a sticky note
export const saveStickyNote = (note: StickyNote): void => {
  const allNotes = getStickyNotes();
  if (!allNotes[note.experimentId]) {
    allNotes[note.experimentId] = [];
  }

  // Update if exists, otherwise add
  const noteIndex = allNotes[note.experimentId].findIndex(
    (n) => n.id === note.id
  );
  if (noteIndex >= 0) {
    allNotes[note.experimentId][noteIndex] = note;
  } else {
    allNotes[note.experimentId].push(note);
  }

  localStorage.setItem("stickyNotes", JSON.stringify(allNotes));
};

// Delete a sticky note
export const deleteStickyNote = (
  experimentId: string,
  noteId: string
): void => {
  const allNotes = getStickyNotes();
  if (allNotes[experimentId]) {
    allNotes[experimentId] = allNotes[experimentId].filter(
      (n) => n.id !== noteId
    );
    localStorage.setItem("stickyNotes", JSON.stringify(allNotes));
  }
};

// Save additional notes content (for Quill editor)
export const saveAdditionalNotes = (
  experimentId: string,
  content: string
): void => {
  const additionalNotes = getAdditionalNotes();
  additionalNotes[experimentId] = content;
  localStorage.setItem("additionalNotes", JSON.stringify(additionalNotes));
};

// Get additional notes content
export const getAdditionalNotes = (): Record<string, string> => {
  const notes = localStorage.getItem("additionalNotes");
  return notes ? JSON.parse(notes) : {};
};

// Get specific experiment additional notes
export const getExperimentAdditionalNotes = (experimentId: string): string => {
  const allNotes = getAdditionalNotes();
  return allNotes[experimentId] || "";
};

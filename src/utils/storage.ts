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

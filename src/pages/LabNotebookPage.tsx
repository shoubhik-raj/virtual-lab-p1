import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";

interface Note {
  id: number;
  title: string;
  content: string;
  experimentId: number;
  experimentTitle: string;
  labId: number;
  labTitle: string;
  departmentId: number;
  departmentTitle: string;
  updatedAt: string;
}

const LabNotebookPage = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNote, setActiveNote] = useState<number | null>(null);
  const [noteContent, setNoteContent] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    // Mock data - in a real app, you would fetch this from local storage
    const mockNotes = [
      {
        id: 1,
        title: "RC Circuit Notes",
        content:
          "Time constant = RC\nWhen t = RC, voltage reaches 63.2% of final value.",
        experimentId: 1,
        experimentTitle: "RC Circuit Analysis",
        labId: 1,
        labTitle: "Circuit Analysis Laboratory",
        departmentId: 1,
        departmentTitle: "Electrical Engineering",
        updatedAt: "2023-09-15",
      },
      {
        id: 2,
        title: "Beam Deflection Observations",
        content:
          "Maximum deflection occurs at the center of the beam when load is uniform.",
        experimentId: 2,
        experimentTitle: "Beam Deflection",
        labId: 3,
        labTitle: "Strength of Materials Lab",
        departmentId: 2,
        departmentTitle: "Mechanical Engineering",
        updatedAt: "2023-09-10",
      },
      {
        id: 3,
        title: "Logic Gates Truth Tables",
        content: "AND Gate: A B | Q\n0 0 | 0\n0 1 | 0\n1 0 | 0\n1 1 | 1",
        experimentId: 3,
        experimentTitle: "Logic Gates",
        labId: 4,
        labTitle: "Digital Logic Lab",
        departmentId: 3,
        departmentTitle: "Computer Science",
        updatedAt: "2023-09-05",
      },
    ];

    setNotes(mockNotes);
  }, []);

  const handleNoteClick = (note: Note) => {
    setActiveNote(note.id);
    setNoteContent(note.content);
  };

  const handleSaveNote = () => {
    if (activeNote) {
      setNotes(
        notes.map((note) =>
          note.id === activeNote
            ? {
                ...note,
                content: noteContent,
                updatedAt: new Date().toISOString().split("T")[0],
              }
            : note
        )
      );
      alert("Note saved successfully!");
    }
  };

  const filteredNotes =
    activeFilter === "all"
      ? notes
      : notes.filter(
          (note) => note.departmentTitle.toLowerCase() === activeFilter
        );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Lab Notebook
        </h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center">
          <Icon icon="mdi:plus" className="mr-2" />
          New Note
        </button>
      </div>

      <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700 pb-2">
        <button
          className={`px-3 py-1 text-sm font-medium rounded-full ${
            activeFilter === "all"
              ? "bg-blue-100 text-blue-600 dark:bg-blue-900"
              : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
          onClick={() => setActiveFilter("all")}
        >
          All Notes
        </button>
        <button
          className={`px-3 py-1 text-sm font-medium rounded-full ${
            activeFilter === "electrical engineering"
              ? "bg-blue-100 text-blue-600 dark:bg-blue-900"
              : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
          onClick={() => setActiveFilter("electrical engineering")}
        >
          Electrical
        </button>
        <button
          className={`px-3 py-1 text-sm font-medium rounded-full ${
            activeFilter === "mechanical engineering"
              ? "bg-blue-100 text-blue-600 dark:bg-blue-900"
              : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
          onClick={() => setActiveFilter("mechanical engineering")}
        >
          Mechanical
        </button>
        <button
          className={`px-3 py-1 text-sm font-medium rounded-full ${
            activeFilter === "computer science"
              ? "bg-blue-100 text-blue-600 dark:bg-blue-900"
              : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
          onClick={() => setActiveFilter("computer science")}
        >
          Computer Science
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Notes List */}
        <div className="md:col-span-1 space-y-4">
          {filteredNotes.length > 0 ? (
            filteredNotes.map((note) => (
              <div
                key={note.id}
                className={`p-4 rounded-lg cursor-pointer transition ${
                  activeNote === note.id
                    ? "bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500"
                    : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
                onClick={() => handleNoteClick(note)}
              >
                <h3 className="font-medium text-gray-800 dark:text-white">
                  {note.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {note.experimentTitle} - {note.labTitle}
                </p>
                <div className="flex justify-between items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>{note.departmentTitle}</span>
                  <span>Updated: {note.updatedAt}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-500 dark:text-gray-400">
              No notes found. Create a new note to get started.
            </div>
          )}
        </div>

        {/* Note Editor */}
        <div className="md:col-span-2">
          {activeNote ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md h-full flex flex-col">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h2 className="font-medium text-gray-800 dark:text-white">
                  {notes.find((n) => n.id === activeNote)?.title}
                </h2>
                <div className="flex space-x-2">
                  <button
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    onClick={handleSaveNote}
                  >
                    Save
                  </button>
                  <Link
                    to={`/experiments/${
                      notes.find((n) => n.id === activeNote)?.experimentId
                    }`}
                    className="px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30"
                  >
                    Go to Experiment
                  </Link>
                </div>
              </div>
              <div className="p-4 flex-1">
                <textarea
                  className="w-full h-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-yellow-50 dark:bg-gray-700 text-gray-800 dark:text-white resize-none"
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Write your notes here..."
                />
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 flex flex-col items-center justify-center h-full">
              <Icon
                icon="mdi:notebook-outline"
                className="text-6xl text-gray-400 mb-4"
              />
              <p className="text-gray-500 dark:text-gray-400 text-center">
                Select a note to view or edit its content
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LabNotebookPage;

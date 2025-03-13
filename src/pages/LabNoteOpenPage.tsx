import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useData } from "../contexts/DataContext";
import { Icon } from "@iconify/react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// StickyNote component specifically for the open page
const StickyNote = ({
  note,
  onDelete,
  onSave,
}: {
  note: any;
  onDelete: () => void;
  onSave: (text: string) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(note.text);

  const handleSave = () => {
    onSave(text);
    setIsEditing(false);
  };

  return (
    <div className={`${note.color} p-7 mb-4 shadow-lg relative min-h-36`}>
      {isEditing ? (
        <>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-32 p-2 bg-transparent bg-opacity-70 focus:outline-none resize-none"
            autoFocus
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-3 py-1 rounded text-sm mr-2"
            >
              Save
            </button>
            <button
              onClick={onDelete}
              className="bg-red-500 text-white px-3 py-1 rounded text-sm"
            >
              Delete
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="pr-8">
            <p className="text-gray-800">{text}</p>
          </div>
          <div className="absolute top-3 right-3 flex space-x-2">
            <button
              onClick={() => setIsEditing(true)}
              className="text-gray-600 hover:text-gray-800 bg-white bg-opacity-70 rounded-full p-1"
            >
              <Icon icon="mdi:pencil" className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              className="text-gray-600 hover:text-red-500 bg-white bg-opacity-70 rounded-full p-1"
            >
              <Icon icon="mdi:trash-can-outline" className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const LabNoteOpenPage = () => {
  const { experimentId } = useParams<{ experimentId: string }>();
  const {
    getExperimentById,
    getLabById,
    getExperimentStickyNotes,
    updateStickyNote,
    deleteStickyNote,
    saveAdditionalNotes,
    getExperimentAdditionalNotes,
    departments,
  } = useData();

  const [editorContent, setEditorContent] = useState("");
  const [notes, setNotes] = useState<any[]>([]);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const experiment = getExperimentById(experimentId || "");
  const lab = experiment ? getLabById(experiment.labId) : null;

  // Find the correct department for this lab
  const department = lab
    ? departments.find((d) => d.labs.some((labId) => labId === lab.id))
    : null;

  // Load notes and editor content
  useEffect(() => {
    if (experimentId) {
      setNotes(getExperimentStickyNotes(experimentId));
      setEditorContent(getExperimentAdditionalNotes(experimentId));
    }
  }, [experimentId, getExperimentStickyNotes, getExperimentAdditionalNotes]);

  useEffect(() => {
    const saveTimer = setTimeout(() => {
      if (editorContent && experimentId && isEditing) {
        saveAdditionalNotes(experimentId, editorContent);
        setLastSaved(new Date());
      }
    }, 1000);

    return () => clearTimeout(saveTimer);
  }, [editorContent, experimentId, saveAdditionalNotes, isEditing]);

  const handleUpdateNote = (noteId: string, text: string) => {
    if (experimentId) {
      updateStickyNote(experimentId, noteId, text);
      setNotes(getExperimentStickyNotes(experimentId));
    }
  };

  const handleDeleteNote = (noteId: string) => {
    if (experimentId) {
      deleteStickyNote(experimentId, noteId);
      setNotes(getExperimentStickyNotes(experimentId));
    }
  };

  const toggleEditor = () => {
    if (!isEditing && experimentId) {
      // Make sure we have the latest content when opening the editor
      setEditorContent(getExperimentAdditionalNotes(experimentId));
    }
    setIsEditing(!isEditing);
  };

  const handleSaveAndClose = () => {
    if (experimentId) {
      saveAdditionalNotes(experimentId, editorContent);
      setLastSaved(new Date());
      setIsEditing(false);
    }
  };

  if (!experiment) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center py-12 text-gray-500">
          Experiment not found
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="text-sm text-gray-600 mb-2">
          <Link to="/notebook" className="hover:underline flex items-center">
            <Icon icon="mdi:arrow-left" className="mr-1" />
            Back to Lab Notebook
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {experiment.name} Notes
        </h1>
        <p className="text-gray-600">{lab?.name || "Unknown Lab"}</p>
      </div>

      {/* Main content with sidebar */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main content - Notes and editor */}
        <div className="flex-1">
          {/* Sticky notes section */}
          <div className="mb-8">
            <h2 className="text-xl font-medium text-gray-800 mb-4">
              Sticky Notes
            </h2>

            {notes.length > 0 ? (
              <div className="space-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {notes.map((note) => (
                  <StickyNote
                    key={note.id}
                    note={note}
                    onDelete={() => handleDeleteNote(note.id)}
                    onSave={(text) => handleUpdateNote(note.id, text)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                No sticky notes found for this experiment.
              </p>
            )}
          </div>

          {/* Rich text editor section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-medium text-gray-800">
                Additional Notes
              </h2>
              <div className="flex items-center">
                {isEditing ? (
                  <button
                    onClick={handleSaveAndClose}
                    className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded flex items-center text-sm"
                  >
                    <Icon icon="mdi:content-save" className="mr-1" />
                    Save & Close
                  </button>
                ) : (
                  <button
                    onClick={toggleEditor}
                    className="text-gray-600 hover:text-blue-600 flex items-center text-sm"
                  >
                    <Icon icon="mdi:pencil" className="mr-1" />
                    Edit Notes
                  </button>
                )}
              </div>
            </div>

            {isEditing ? (
              // Show editor when in editing mode
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <ReactQuill
                  theme="snow"
                  value={editorContent}
                  onChange={setEditorContent}
                  className="h-64"
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, 3, false] }],
                      ["bold", "italic", "underline", "strike"],
                      [{ list: "ordered" }, { list: "bullet" }],
                      ["link", "image"],
                      ["clean"],
                    ],
                  }}
                />
              </div>
            ) : (
              // Show rendered content when not editing
              <div className="border border-gray-200 rounded-lg p-6 min-h-[200px] bg-white shadow-sm">
                {editorContent ? (
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: editorContent }}
                  />
                ) : (
                  <p className="text-gray-500 italic">
                    No additional notes yet. Click "Edit Notes" to add some.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar - Linked experiment */}
        <div className="w-full lg:w-72">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="text-sm text-gray-500 mb-2">Linked Experiment</div>
            <h3 className="text-lg font-medium text-gray-800 mb-3">
              {experiment.name}
            </h3>

            {experiment.image && (
              <div className="mb-4">
                <img
                  src={experiment.image}
                  alt={experiment.name}
                  className="w-full h-40 object-cover rounded-md"
                />
              </div>
            )}

            <Link
              to={`/departments/${department?.id || "1"}/labs/${
                experiment.labId
              }/experiments/${experiment.id}`}
              className="inline-flex items-center text-blue-500 hover:text-blue-700"
            >
              Go to Experiment <Icon icon="mdi:arrow-right" className="ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabNoteOpenPage;

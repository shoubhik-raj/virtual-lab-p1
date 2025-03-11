import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useData } from "../contexts/DataContext";
import { Icon } from "@iconify/react";

const LabNotebookPage = () => {
  const { userNotes, saveNote, experiments, labs, departments } = useData();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(
    "Chemical Engineering"
  );
  const [filteredNotes, setFilteredNotes] = useState<any[]>([]);

  // Get experiment details for notes
  const notesWithDetails = Object.entries(userNotes).map(([id, note]) => {
    const experimentId = parseInt(id);
    const experiment = experiments.find((exp) => exp.id === experimentId);
    const lab = experiment
      ? labs.find((lab) => lab.id === experiment.labId)
      : undefined;
    const department = lab
      ? departments.find((dept) => dept.id === lab.departmentId)
      : undefined;

    return {
      id: experimentId,
      note,
      experimentTitle: experiment?.name || "Unknown Experiment",
      labName: lab?.name || "Unknown Lab",
      departmentName: department?.name || "Unknown Department",
      preview: note.substring(0, 150),
    };
  });

  // Filter notes based on search and department
  useEffect(() => {
    let filtered = notesWithDetails;

    if (searchQuery) {
      filtered = filtered.filter(
        (note) =>
          note.experimentTitle
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          note.note.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedDepartment) {
      filtered = filtered.filter(
        (note) => note.departmentName === selectedDepartment
      );
    }

    setFilteredNotes(filtered);
  }, [searchQuery, selectedDepartment, notesWithDetails]);

  const createNewNote = () => {
    // Implementation for creating a new note
    console.log("Create new note");
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header with search */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-medium">Lab Notebook</h1>
        <div className="relative w-96">
          <input
            type="text"
            placeholder="Search within notebook"
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

      {/* Top section with department selection and create button */}
      <div className="flex gap-6 mb-8">
        {/* Blue department selector */}
        <div className="bg-blue-500 text-white rounded-lg flex-1 p-8 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-blue-100 mb-2">Select Department</p>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-medium">{selectedDepartment}</h2>
              <button className="bg-blue-400/50 p-2 rounded-lg">
                <Icon icon="mdi:chevron-down" className="text-xl" />
              </button>
            </div>
          </div>

          {/* Background illustration */}
          <div className="absolute right-6 top-1/2 transform -translate-y-1/2 opacity-20">
            <Icon icon="mdi:flask-outline" className="text-9xl" />
            <Icon
              icon="mdi:test-tube"
              className="text-9xl absolute -right-10 top-0"
            />
          </div>
        </div>

        {/* Create note button */}
        <div className="bg-gray-100 rounded-lg p-6 flex items-center justify-between w-96">
          <button
            onClick={createNewNote}
            className="text-gray-700 font-medium text-lg"
          >
            Create a New Note
          </button>

          {/* Illustration */}
          <div className="text-blue-500">
            <Icon icon="mdi:note-plus-outline" className="text-5xl" />
          </div>
        </div>
      </div>

      {/* Notes grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note) => (
            <Link
              key={note.id}
              to={`/notes/${note.id}`}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-5">
                <h3 className="font-medium text-lg text-gray-900 mb-2">
                  {note.experimentTitle}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-4">
                  {note.preview}
                </p>
              </div>
              <div className="bg-blue-100 p-3 text-blue-800">
                {note.labName}
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-3 text-center py-12">
            <Icon
              icon="mdi:notebook-outline"
              className="text-6xl text-gray-400 mx-auto mb-4"
            />
            <h3 className="text-xl font-medium text-gray-800 mb-2">
              No Notes Found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery
                ? "No notes match your search criteria"
                : "You haven't created any notes yet"}
            </p>
            <button
              onClick={createNewNote}
              className="px-4 py-2 bg-blue-600 text-white rounded-md inline-flex items-center"
            >
              <Icon icon="mdi:plus" className="mr-1" /> Create Your First Note
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LabNotebookPage;

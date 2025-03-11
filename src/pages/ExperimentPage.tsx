import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useData } from "../contexts/DataContext";
import { Icon } from "@iconify/react";

// Note component for sticky notes
const StickyNote = ({
  note,
  color,
  isNew = false,
  onDelete,
  onSave,
}: {
  note: string;
  color: string;
  isNew?: boolean;
  onDelete: () => void;
  onSave: (text: string) => void;
}) => {
  const [isEditing, setIsEditing] = useState(isNew);
  const [text, setText] = useState(note);

  const handleSave = () => {
    onSave(text);
    setIsEditing(false);
  };

  return (
    <div
      className={`p-4 mb-4 rounded-lg shadow-md ${color} relative`}
      style={{ minHeight: "100px" }}
    >
      {isEditing ? (
        <>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-24 p-1 rounded bg-white bg-opacity-70 focus:outline-none resize-none"
            autoFocus
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-2 py-1 rounded text-xs mr-2 hover:bg-green-600"
            >
              Save
            </button>
            <button
              onClick={onDelete}
              className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="text-gray-800">{text}</p>
          <div className="absolute top-2 right-2 flex space-x-1">
            <button
              onClick={() => setIsEditing(true)}
              className="text-gray-600 hover:text-gray-800"
            >
              <Icon icon="mdi:pencil" className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              className="text-gray-600 hover:text-red-500"
            >
              <Icon icon="mdi:trash-can-outline" className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

// Chat message component
const ChatMessage = ({
  message,
  isUser,
}: {
  message: { text: string; timestamp: Date };
  isUser: boolean;
}) => {
  return (
    <div className={`flex mb-4 ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-3/4 p-3 rounded-lg ${
          isUser ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-800"
        }`}
      >
        <p>{message.text}</p>
        <p className="text-xs mt-1 opacity-70">
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
};

const ExperimentPage = () => {
  const { departmentId, labId, experimentId } = useParams<{
    departmentId: string;
    labId: string;
    experimentId: string;
  }>();

  const deptId = parseInt(departmentId || "0", 10);
  const labIdString = labId || "";
  const experimentIdString = experimentId || "";

  const {
    getExperimentById,
    getLabById,
    getDepartmentById,
    updateExperimentProgress,
    userProgress,
    toggleBookmark,
    userBookmarks,
    saveNote,
    userNotes,
  } = useData();

  const [activeTab, setActiveTab] = useState("aim");
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: string]: string;
  }>({});
  const [feedback, setFeedback] = useState<{ [key: string]: string }>({});
  const [quizSubmitted, setQuizSubmitted] = useState({
    pretest: false,
    posttest: false,
  });

  // New state for the right panel
  const [rightPanelTab, setRightPanelTab] = useState<"notes" | "assistant">(
    "notes"
  );
  const [stickyNotes, setStickyNotes] = useState<
    { id: string; text: string; color: string; isNew: boolean }[]
  >([
    {
      id: "1",
      text: "Remember reasoning behind demorgan ka law dhang se",
      color: "bg-red-200",
      isNew: false,
    },
  ]);
  const [chatMessages, setChatMessages] = useState<
    { text: string; timestamp: Date; isUser: boolean }[]
  >([
    {
      text: "Hello! I'm your AI Learning Assistant. How can I help you understand this experiment?",
      timestamp: new Date(),
      isUser: false,
    },
  ]);
  const [newChatMessage, setNewChatMessage] = useState("");

  // New state to track active simulation index
  const [activeSimIndex, setActiveSimIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const experiment = getExperimentById(experimentIdString);
  const lab = getLabById(labIdString);
  const department = getDepartmentById(deptId);

  const progress = userProgress[experimentIdString] || 50;
  const isBookmarked = userBookmarks.includes(experimentIdString);

  useEffect(() => {
    // Load saved notes when experiment changes
    if (experimentIdString in userNotes) {
      setNotes(userNotes[experimentIdString]);
    } else {
      setNotes("");
    }
  }, [experimentIdString, userNotes]);

  const handleProgressUpdate = (value: number) => {
    updateExperimentProgress(experimentIdString, value);
  };

  const handleSaveNotes = () => {
    saveNote(experimentIdString, notes);
    setShowNotes(false);
  };

  const handleAnswerSelect = (questionId: string, optionId: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleQuizSubmit = (quizType: "pretest" | "posttest") => {
    setQuizSubmitted((prev) => ({ ...prev, [quizType]: true }));

    const questions =
      quizType === "pretest" ? preTestQuestions : postTestQuestions;
    let newFeedback = { ...feedback };

    questions.forEach((question) => {
      const questionId =
        quizType === "posttest" ? `post_${question.id}` : question.id;
      const selectedOption = selectedAnswers[questionId];

      if (!selectedOption) {
        newFeedback[questionId] = "Not answered";
      } else {
        const option = question.options.find(
          (opt) => opt.id === selectedOption
        );
        newFeedback[questionId] = option?.isCorrect ? "Correct!" : "Incorrect";
      }
    });

    setFeedback(newFeedback);

    handleProgressUpdate(Math.min(progress + 10, 100));
  };

  // Function to add a new sticky note
  const addStickyNote = () => {
    const colors = [
      "bg-yellow-200",
      "bg-red-200",
      "bg-green-200",
      "bg-blue-200",
      "bg-purple-200",
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newNote = {
      id: Date.now().toString(),
      text: "",
      color: randomColor,
      isNew: true,
    };

    setStickyNotes([...stickyNotes, newNote]);
  };

  const deleteNote = (id: string) => {
    setStickyNotes(stickyNotes.filter((note) => note.id !== id));
  };

  const updateStickyNote = (id: string, newText: string) => {
    setStickyNotes(
      stickyNotes.map((note) =>
        note.id === id ? { ...note, text: newText, isNew: false } : note
      )
    );
  };

  // Function to send a chat message
  const sendChatMessage = () => {
    if (newChatMessage.trim() === "") return;

    // Add user message
    const userMessage = {
      text: newChatMessage,
      timestamp: new Date(),
      isUser: true,
    };

    setChatMessages([...chatMessages, userMessage]);
    setNewChatMessage("");

    // Simulate AI response after a short delay
    setTimeout(() => {
      const aiResponse = {
        text: "I'm your AI assistant. This is a simulated response.",
        timestamp: new Date(),
        isUser: false,
      };
      setChatMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const handleExportData = () => {
    alert("Exporting simulation data...");
    // Implementation would depend on what data is available from the simulation
  };

  const toggleFullScreen = () => {
    const iframe = document.getElementById("simulation-frame");
    if (iframe) {
      if (!document.fullscreenElement) {
        iframe.requestFullscreen().catch((err) => {
          alert(`Error attempting to enable fullscreen: ${err.message}`);
        });
      } else {
        document.exitFullscreen();
      }
    }
  };

  if (!experiment || !lab || !department) {
    return <div>Experiment, Lab or Department not found</div>;
  }

  // Mock questions for pre-test and post-test if not available in data
  const preTestQuestions = experiment.preTest || [
    {
      id: "q1",
      text: "What is the main purpose of this experiment?",
      options: [
        {
          id: "q1a",
          text: "To demonstrate a scientific principle",
          isCorrect: true,
        },
        { id: "q1b", text: "To entertain students", isCorrect: false },
        { id: "q1c", text: "To fulfill course requirements", isCorrect: false },
      ],
    },
    {
      id: "q2",
      text: "Which of the following is a prerequisite for this experiment?",
      options: [
        { id: "q2a", text: "Advanced mathematics", isCorrect: false },
        { id: "q2b", text: "Basic understanding of concepts", isCorrect: true },
        { id: "q2c", text: "Prior lab experience", isCorrect: false },
      ],
    },
  ];

  const postTestQuestions = experiment.postTest || [
    {
      id: "p1",
      text: "Based on the experiment, which conclusion is most accurate?",
      options: [
        { id: "p1a", text: "Option A is the answer", isCorrect: false },
        { id: "p1b", text: "Option B is the answer", isCorrect: true },
        { id: "p1c", text: "Option C is the answer", isCorrect: false },
      ],
    },
    {
      id: "p2",
      text: "What would happen if we changed a variable in this experiment?",
      options: [
        { id: "p2a", text: "The result would be the same", isCorrect: false },
        {
          id: "p2b",
          text: "The result would be unpredictable",
          isCorrect: false,
        },
        {
          id: "p2c",
          text: "The result would change in a predictable way",
          isCorrect: true,
        },
      ],
    },
  ];

  // Style quiz content for pretest and posttest
  const renderContent = () => {
    switch (activeTab) {
      case "aim":
        return (
          <div className="bg-white py-4">
            <div
              className="prose max-w-none text-gray-600"
              dangerouslySetInnerHTML={{
                __html:
                  experiment.aim || "No aim provided for this experiment.",
              }}
            ></div>
          </div>
        );
      case "theory":
        return (
          <div className="bg-white py-4">
            <div
              className="prose max-w-none text-gray-600"
              dangerouslySetInnerHTML={{
                __html:
                  experiment.theory ||
                  "No theory provided for this experiment.",
              }}
            ></div>
          </div>
        );
      case "procedure":
        return (
          <div className="bg-white py-4">
            <div
              className="prose max-w-none text-gray-600"
              dangerouslySetInnerHTML={{
                __html:
                  experiment.procedure ||
                  "No procedure provided for this experiment.",
              }}
            ></div>
          </div>
        );
      case "simulation":
        return (
          <div className="bg-white py-4">
            {experiment.simulation && experiment.simulation.length > 0 ? (
              <div className="space-y-6">
                {/* Simulation controls */}
                <div className="flex justify-between items-center mb-4">
                  {/* Simulation selector buttons */}
                  <div className="flex space-x-2">
                    {experiment.simulation.map((sim, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveSimIndex(index)}
                        className={`px-6 py-2 rounded-lg ${
                          activeSimIndex === index
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        Simulation {index + 1}
                      </button>
                    ))}
                  </div>

                  {/* Action buttons */}
                  <div className="flex space-x-3">
                    <button
                      onClick={handleExportData}
                      className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Icon icon="mdi:download-outline" className="mr-2" />
                      Export Data
                    </button>
                    <button
                      onClick={toggleFullScreen}
                      className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Icon icon="mdi:fullscreen" className="mr-2" />
                      Full Screen
                    </button>
                  </div>
                </div>

                {/* Active simulation */}
                <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-4">
                  <iframe
                    id="simulation-frame"
                    srcDoc={experiment.simulation[activeSimIndex]?.code || ""}
                    title={`${experiment.name} - Simulation ${
                      activeSimIndex + 1
                    }`}
                    className="w-full h-[500px] border-0"
                    sandbox="allow-scripts allow-same-origin"
                  ></iframe>
                </div>
              </div>
            ) : (
              <div className="text-center py-10">
                <Icon
                  icon="mdi:flask-empty-outline"
                  className="text-5xl text-gray-400 mx-auto mb-3"
                />
                <p className="text-gray-600 dark:text-gray-400">
                  No simulation available for this experiment.
                </p>
              </div>
            )}
          </div>
        );
      case "pretest":
        return (
          <div className="bg-white py-6">
            {preTestQuestions.map((question, qIndex) => (
              <div key={question.id} className="mb-8">
                <h3 className="text-blue-500 font-medium mb-3">
                  Q{qIndex + 1}. {question.text}
                </h3>
                <div className="space-y-4 ml-6 mt-4">
                  {question.options.map((option) => (
                    <div key={option.id} className="flex items-center">
                      <label
                        htmlFor={option.id}
                        className="flex items-center cursor-pointer"
                      >
                        <div className="relative">
                          <input
                            type="radio"
                            id={option.id}
                            name={question.id}
                            checked={selectedAnswers[question.id] === option.id}
                            onChange={() =>
                              handleAnswerSelect(question.id, option.id)
                            }
                            className="sr-only" // Hide but keep accessible
                            disabled={quizSubmitted.pretest}
                          />
                          <div
                            className={`w-5 h-5 rounded-full border ${
                              quizSubmitted.pretest && option.isCorrect
                                ? "border-green-500"
                                : quizSubmitted.pretest &&
                                  selectedAnswers[question.id] === option.id &&
                                  !option.isCorrect
                                ? "border-red-500"
                                : selectedAnswers[question.id] === option.id
                                ? "border-blue-500"
                                : "border-gray-300"
                            }`}
                          >
                            {selectedAnswers[question.id] === option.id && (
                              <div
                                className={`w-3 h-3 absolute top-1 left-1 rounded-full ${
                                  quizSubmitted.pretest
                                    ? option.isCorrect
                                      ? "bg-green-500"
                                      : "bg-red-500"
                                    : "bg-blue-500"
                                }`}
                              ></div>
                            )}
                            {quizSubmitted.pretest &&
                              option.isCorrect &&
                              selectedAnswers[question.id] !== option.id && (
                                <div className="w-3 h-3 absolute top-1 left-1 rounded-full bg-green-500"></div>
                              )}
                          </div>
                        </div>
                        <span
                          className={`ml-3 ${
                            quizSubmitted.pretest && option.isCorrect
                              ? "text-green-700 font-medium"
                              : quizSubmitted.pretest &&
                                selectedAnswers[question.id] === option.id &&
                                !option.isCorrect
                              ? "text-red-700"
                              : "text-gray-700"
                          }`}
                        >
                          {option.text}
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
                {quizSubmitted.pretest && feedback[question.id] && (
                  <p
                    className={`mt-3 ml-6 ${
                      feedback[question.id] === "Correct!"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {feedback[question.id]}
                  </p>
                )}
              </div>
            ))}

            <button
              className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              onClick={() => handleQuizSubmit("pretest")}
              disabled={quizSubmitted.pretest}
            >
              {quizSubmitted.pretest ? "Quiz Submitted" : "Submit Quiz"}
            </button>
          </div>
        );
      case "posttest":
        return (
          <div className="bg-white py-6">
            {postTestQuestions.map((question, qIndex) => (
              <div key={question.id} className="mb-8">
                <h3 className="text-blue-500 font-medium mb-3">
                  Q{qIndex + 1}. {question.text}
                </h3>
                <div className="space-y-4 ml-6 mt-4">
                  {question.options.map((option) => (
                    <div key={option.id} className="flex items-center">
                      <label
                        htmlFor={`post_${option.id}`}
                        className="flex items-center cursor-pointer"
                      >
                        <div className="relative">
                          <input
                            type="radio"
                            id={`post_${option.id}`}
                            name={`post_${question.id}`}
                            checked={
                              selectedAnswers[`post_${question.id}`] ===
                              option.id
                            }
                            onChange={() =>
                              handleAnswerSelect(
                                `post_${question.id}`,
                                option.id
                              )
                            }
                            className="sr-only" // Hide but keep accessible
                            disabled={quizSubmitted.posttest}
                          />
                          <div
                            className={`w-5 h-5 rounded-full border ${
                              quizSubmitted.posttest && option.isCorrect
                                ? "border-green-500"
                                : quizSubmitted.posttest &&
                                  selectedAnswers[`post_${question.id}`] ===
                                    option.id &&
                                  !option.isCorrect
                                ? "border-red-500"
                                : selectedAnswers[`post_${question.id}`] ===
                                  option.id
                                ? "border-blue-500"
                                : "border-gray-300"
                            }`}
                          >
                            {selectedAnswers[`post_${question.id}`] ===
                              option.id && (
                              <div
                                className={`w-3 h-3 absolute top-1 left-1 rounded-full ${
                                  quizSubmitted.posttest
                                    ? option.isCorrect
                                      ? "bg-green-500"
                                      : "bg-red-500"
                                    : "bg-blue-500"
                                }`}
                              ></div>
                            )}
                            {quizSubmitted.posttest &&
                              option.isCorrect &&
                              selectedAnswers[`post_${question.id}`] !==
                                option.id && (
                                <div className="w-3 h-3 absolute top-1 left-1 rounded-full bg-green-500"></div>
                              )}
                          </div>
                        </div>
                        <span
                          className={`ml-3 ${
                            quizSubmitted.posttest && option.isCorrect
                              ? "text-green-700 font-medium"
                              : quizSubmitted.posttest &&
                                selectedAnswers[`post_${question.id}`] ===
                                  option.id &&
                                !option.isCorrect
                              ? "text-red-700"
                              : "text-gray-700"
                          }`}
                        >
                          {option.text}
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
                {quizSubmitted.posttest && feedback[`post_${question.id}`] && (
                  <p
                    className={`mt-3 ml-6 ${
                      feedback[`post_${question.id}`] === "Correct!"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {feedback[`post_${question.id}`]}
                  </p>
                )}
              </div>
            ))}

            <button
              className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              onClick={() => handleQuizSubmit("posttest")}
              disabled={quizSubmitted.posttest}
            >
              {quizSubmitted.posttest ? "Quiz Submitted" : "Submit Quiz"}
            </button>
          </div>
        );
      case "references":
        return (
          <div className="bg-white py-4">
            <div
              className="prose max-w-none text-gray-600"
              dangerouslySetInnerHTML={{
                __html:
                  experiment.references ||
                  "No references provided for this experiment.",
              }}
            ></div>
          </div>
        );
      case "contributors":
        return (
          <div className="bg-white py-4">
            <div
              className="prose max-w-none text-gray-600"
              dangerouslySetInnerHTML={{
                __html:
                  experiment.contributors ||
                  "No contributors listed for this experiment.",
              }}
            ></div>
          </div>
        );
      case "faq":
        return (
          <div className="bg-white py-4">
            {experiment.faqs && experiment.faqs.length > 0 ? (
              <div className="space-y-4">
                {experiment.faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-300 rounded-md shadow-sm"
                  >
                    <h3 className="font-semibold text-gray-800">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 mt-1">{faq.answer}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                No FAQs available for this experiment.
              </p>
            )}
          </div>
        );
      default:
        return (
          <div className="bg-white py-4">
            <div className="prose max-w-none text-gray-600">
              Select a tab to view content.
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-12 p-12 relative">
      {/* Notes Sidebar */}
      {showNotes && (
        <div className="fixed inset-y-0 right-0 w-80 bg-white border-l border-gray-200 p-4 z-20 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-gray-800">Your Notes</h3>
            <button
              onClick={() => setShowNotes(false)}
              className="text-gray-500"
            >
              <Icon icon="mdi:close" className="text-xl" />
            </button>
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-800"
            rows={10}
            placeholder="Write your notes here..."
          ></textarea>
          <button
            onClick={handleSaveNotes}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Save Notes
          </button>
        </div>
      )}

      {/* Header Section */}
      <div className="mb-8">
        <div className="text-sm text-blue-500 mb-1">
          <Link
            to={`/departments/${deptId}/labs/${labIdString}`}
            className="hover:underline flex items-center"
          >
            <Icon icon="mdi:arrow-left" className="mr-1" />
            Back to {lab.name}
          </Link>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-6 mr-3">
              {experiment.name}
            </h1>
            <button
              onClick={() => toggleBookmark(experimentIdString)}
              className="p-2 rounded-full bg-gray-100 mb-6"
            >
              <Icon
                icon={isBookmarked ? "mdi:bookmark" : "mdi:bookmark-outline"}
                className={`text-xl ${
                  isBookmarked ? "text-yellow-500" : "text-gray-500"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center space-x-4">
            {/* Progress bar */}
            <div className="flex items-center">
              <div className="w-32 bg-gray-200 rounded-full h-2.5 mr-2">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-600">{progress}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar - Fixed at the top when scrolling */}
      <div className="sticky top-0 z-50 bg-white border-b-2 border-gray-200 mb-8">
        <div className="flex overflow-x-auto items-center">
          {[
            "aim",
            "theory",
            "procedure",
            "simulation",
            "pretest",
            "posttest",
            "references",
            "contributors",
            "faq",
          ].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-6 font-medium whitespace-nowrap ${
                activeTab === tab
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab === "pretest"
                ? "Pre-test"
                : tab === "posttest"
                ? "Post-test"
                : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Main content area with right panel */}
      <div className="flex">
        {/* Main content section - adjusted width to make room for right panel */}
        <div className="flex-1 mr-8 max-w-[calc(100%-300px)]">
          {/* Content Section */}
          <div className="mb-12">
            <div className="mb-6">
              <div className="inline-flex items-center bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
                <div className="p-5 flex items-center justify-center border-r-2 border-gray-200">
                  <Icon icon="mdi:flask" className="h-5 w-5 text-gray-700" />
                </div>
                <div className="px-6 py-5 pr-24">
                  <h2 className="text-md font-medium text-gray-800">
                    {activeTab === "pretest"
                      ? "Pre-test"
                      : activeTab === "posttest"
                      ? "Post-test"
                      : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                  </h2>
                </div>
              </div>
            </div>

            {/* Render content based on active tab */}
            {renderContent()}
          </div>
        </div>

        {/* Right Panel - Lab Notes and AI Assistant */}
        <div className="w-72 h-fit sticky top-20 bg-white rounded-lg border border-gray-200 shadow-sm">
          {/* Tab navigation */}
          <div className="flex rounded-t-lg overflow-hidden">
            <button
              onClick={() => setRightPanelTab("notes")}
              className={`flex-1 py-3 px-4 text-center font-medium ${
                rightPanelTab === "notes"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Lab Notes
            </button>
            <button
              onClick={() => setRightPanelTab("assistant")}
              className={`flex-1 py-3 px-4 text-center font-medium ${
                rightPanelTab === "assistant"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              AI Learning Assistant
            </button>
          </div>

          {/* Tab content */}
          <div className="p-4">
            {rightPanelTab === "notes" ? (
              <div>
                {/* Sticky notes */}
                <div className="mb-4">
                  {stickyNotes.map((note) => (
                    <StickyNote
                      key={note.id}
                      note={note.text}
                      color={note.color}
                      isNew={note.isNew}
                      onDelete={() => deleteNote(note.id)}
                      onSave={(text) => updateStickyNote(note.id, text)}
                    />
                  ))}
                </div>

                {/* Add new note button */}
                <button
                  onClick={addStickyNote}
                  className="flex items-center text-gray-600 hover:text-gray-900"
                >
                  <Icon icon="mdi:plus" className="mr-2" />
                  Add new sticky note
                </button>
              </div>
            ) : (
              <div>
                {/* Chat interface */}
                <div
                  className="overflow-y-auto mb-4"
                  style={{ height: "400px" }}
                >
                  {chatMessages.map((msg, index) => (
                    <ChatMessage
                      key={index}
                      message={{ text: msg.text, timestamp: msg.timestamp }}
                      isUser={msg.isUser}
                    />
                  ))}
                </div>

                {/* Chat input */}
                <div className="flex">
                  <input
                    type="text"
                    value={newChatMessage}
                    onChange={(e) => setNewChatMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendChatMessage()}
                    placeholder="Ask a question..."
                    className="flex-1 border border-gray-300 rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={sendChatMessage}
                    className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600"
                  >
                    <Icon icon="mdi:send" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperimentPage;

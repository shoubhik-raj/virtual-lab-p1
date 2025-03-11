import { useParams, Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import { createExperimentSlug } from "../utils/routes";
import {
  getLabById,
  experimentsByLab,
  Lab,
  Experiment,
} from "../data/mockData";

const LabPage = () => {
  const { labSlug } = useParams<{ labSlug: string }>();
  const [activeTab, setActiveTab] = useState("experiments");
  const [lab, setLab] = useState<Lab | null>(null);
  const [experiments, setExperiments] = useState<Experiment[]>([]);

  useEffect(() => {
    // In a real app, you would fetch lab data based on the slug
    // For now, use the first lab as a placeholder
    const labData = getLabById(1);
    if (labData) {
      setLab(labData);
      setExperiments(experimentsByLab[labData.id] || []);
    }
  }, [labSlug]);

  if (!lab) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: "mdi:information-outline" },
    { id: "experiments", label: "Experiments", icon: "mdi:flask" },
    { id: "audience", label: "Target Audience", icon: "mdi:account-group" },
    { id: "alignment", label: "Course Alignment", icon: "mdi:school" },
    { id: "feedback", label: "Feedback", icon: "mdi:message-outline" },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Link to="/dashboard" className="text-blue-600 hover:underline">
          Dashboard
        </Link>
        <Icon icon="mdi:chevron-right" className="text-gray-500" />
        <Link to={`/departments/1`} className="text-blue-600 hover:underline">
          {lab.department}
        </Link>
        <Icon icon="mdi:chevron-right" className="text-gray-500" />
        <span className="text-gray-800 dark:text-white font-medium">
          {lab.name}
        </span>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                {lab.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {lab.institution} • {lab.department}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex items-center">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Icon
                      key={i}
                      icon={i < 4 ? "mdi:star" : "mdi:star-outline"}
                    />
                  ))}
                </div>
                <span className="ml-2 text-gray-600 dark:text-gray-400">
                  4.0 (125 ratings)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`flex items-center px-6 py-3 text-sm font-medium whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon icon={tab.icon} className="mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "overview" && (
            <div className="prose max-w-none dark:prose-invert">
              {lab.description ? (
                <div dangerouslySetInnerHTML={{ __html: lab.description }} />
              ) : (
                <p>
                  This laboratory provides hands-on experience with circuit
                  analysis techniques. Students will learn about various circuit
                  components and how they behave in different configurations.
                </p>
              )}

              <h3>Learning Objectives</h3>
              <ul>
                <li>Understand the behavior of passive circuit elements</li>
                <li>Apply Kirchhoff's laws to analyze circuits</li>
                <li>Measure voltage, current, and power in circuits</li>
                <li>Analyze transient and steady-state responses</li>
              </ul>
            </div>
          )}

          {activeTab === "experiments" && (
            <div className="space-y-6">
              {experiments.map((exp) => (
                <Link
                  key={exp.id}
                  to={`/experiments/${createExperimentSlug(exp.title)}`}
                  className="block bg-gray-50 dark:bg-gray-700 rounded-lg p-5 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                        {exp.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {exp.description}
                      </p>
                      <div className="flex items-center mt-2">
                        <Icon
                          icon="mdi:clock-outline"
                          className="text-gray-500"
                        />
                        <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">
                          {exp.duration}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center">
                      <span
                        className={`text-xs px-2 py-1 rounded ${getDifficultyColor(
                          exp.difficulty
                        )}`}
                      >
                        {exp.difficulty}
                      </span>
                      <Icon
                        icon="mdi:arrow-right"
                        className="ml-4 text-blue-600"
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {activeTab === "audience" && (
            <div className="prose max-w-none dark:prose-invert">
              <p>
                {lab.targetAudience ||
                  "This laboratory is designed for undergraduate students in Electrical Engineering, Electronics Engineering, and related disciplines."}
              </p>
              <h3>Prerequisites</h3>
              <ul>
                <li>
                  Basic understanding of electrical quantities (voltage,
                  current, resistance)
                </li>
                <li>Familiarity with Ohm's law and Kirchhoff's laws</li>
                <li>
                  Basic mathematical skills including differential equations
                </li>
              </ul>
            </div>
          )}

          {activeTab === "alignment" && (
            <div className="prose max-w-none dark:prose-invert">
              <p>
                {lab.courseAlignment ||
                  "This laboratory aligns with the following courses in the undergraduate electrical engineering curriculum:"}
              </p>
              {!lab.courseAlignment && (
                <ul>
                  <li>EE101 - Basic Electrical Engineering</li>
                  <li>EE201 - Circuit Theory</li>
                  <li>EE303 - Electronic Circuits</li>
                </ul>
              )}
            </div>
          )}

          {activeTab === "feedback" && (
            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                Share your experience with this laboratory.
              </p>
              <textarea
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                rows={4}
                placeholder="Your feedback helps us improve the laboratory experience"
              ></textarea>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Submit Feedback
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LabPage;

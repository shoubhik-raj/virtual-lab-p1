import { useParams, Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import { getExperimentById, Experiment } from "../data/mockData";

const ExperimentPage = () => {
  const { experimentSlug } = useParams<{ experimentSlug: string }>();
  const [activeTab, setActiveTab] = useState("aim");
  const [showNotes, setShowNotes] = useState(false);
  const [experiment, setExperiment] = useState<Experiment | null>(null);

  useEffect(() => {
    // In a real app, you would fetch experiment data based on the slug
    // For now, use the first experiment as a placeholder
    const exp = getExperimentById(1);
    if (exp) {
      setExperiment(exp);
    }
  }, [experimentSlug]);

  if (!experiment) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  const tabs = [
    { id: "aim", label: "Aim", icon: "mdi:bullseye-arrow" },
    { id: "theory", label: "Theory", icon: "mdi:book-open-variant" },
    {
      id: "pretest",
      label: "Pretest",
      icon: "mdi:checkbox-marked-circle-outline",
    },
    { id: "procedure", label: "Procedure", icon: "mdi:list-numbered" },
    { id: "simulation", label: "Simulation", icon: "mdi:chart-line" },
    { id: "posttest", label: "Posttest", icon: "mdi:clipboard-check-outline" },
    {
      id: "references",
      label: "References",
      icon: "mdi:bookmark-multiple-outline",
    },
    { id: "feedback", label: "Feedback", icon: "mdi:message-outline" },
  ];

  const handleAddToCollection = () => {
    // Logic to show collection selection modal
    alert("Add to collection functionality will be implemented here");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Breadcrumb and header */}
      <div className="mb-4">
        <div className="flex items-center space-x-2 text-sm mb-2">
          <Link to="/dashboard" className="text-blue-600 hover:underline">
            Dashboard
          </Link>
          <Icon icon="mdi:chevron-right" className="text-gray-500" />
          <Link
            to={`/departments/${experiment.departmentId}`}
            className="text-blue-600 hover:underline"
          >
            {experiment.department}
          </Link>
          <Icon icon="mdi:chevron-right" className="text-gray-500" />
          <Link
            to={`/labs/${experiment.labId}`}
            className="text-blue-600 hover:underline"
          >
            {experiment.lab}
          </Link>
          <Icon icon="mdi:chevron-right" className="text-gray-500" />
          <span className="text-gray-800 dark:text-white font-medium">
            {experiment.title}
          </span>
        </div>

        <div className="flex justify-between items-start">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            {experiment.title}
          </h1>
          <button
            onClick={handleAddToCollection}
            className="p-2 text-gray-500 hover:text-blue-600"
            title="Add to Collection"
          >
            <Icon icon="mdi:bookmark-outline" className="text-xl" />
          </button>
        </div>

        <div className="mt-2 mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Progress
            </span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {experiment.progress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${experiment.progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main content with tabs */}
      <div className="flex flex-1 overflow-hidden bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div
          className={`flex flex-col ${
            showNotes ? "w-2/3" : "w-full"
          } transition-all duration-300`}
        >
          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`flex items-center px-4 py-3 text-sm font-medium whitespace-nowrap ${
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
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === "aim" && (
              <div className="prose max-w-none dark:prose-invert">
                <h2>Aim of the Experiment</h2>
                <p>
                  To study the charging and discharging of a capacitor in an RC
                  circuit and determine the time constant.
                </p>
                <h3>Learning Objectives</h3>
                <ul>
                  <li>Understand the behavior of capacitors in DC circuits</li>
                  <li>Visualize the charging and discharging curves</li>
                  <li>Measure the time constant experimentally</li>
                  <li>
                    Verify the theoretical and experimental values of the time
                    constant
                  </li>
                </ul>
              </div>
            )}

            {activeTab === "theory" && (
              <div className="prose max-w-none dark:prose-invert">
                <h2>Theoretical Background</h2>
                <p>
                  An RC circuit consists of a resistor and a capacitor connected
                  in series. When a voltage source is connected to this circuit,
                  the capacitor charges up over time.
                </p>
                <h3>Charging of Capacitor</h3>
                <p>
                  When a DC voltage V is applied to the RC circuit, the voltage
                  across the capacitor (v<sub>c</sub>) increases exponentially
                  according to the equation:
                </p>
                <p>
                  v<sub>c</sub>(t) = V(1 - e<sup>-t/RC</sup>)
                </p>
                <p>
                  Where R is the resistance, C is the capacitance, and t is the
                  time elapsed since the application of the voltage.
                </p>
                <h3>Discharging of Capacitor</h3>
                <p>
                  When the charged capacitor is disconnected from the source and
                  connected across a resistor, it discharges according to the
                  equation:
                </p>
                <p>
                  v<sub>c</sub>(t) = V.e<sup>-t/RC</sup>
                </p>
                <h3>Time Constant</h3>
                <p>
                  The time constant (τ) is the time required for the capacitor
                  to charge to approximately 63.2% of the applied voltage or
                  discharge to 36.8% of its initial voltage. It is given by:
                </p>
                <p>τ = RC</p>
              </div>
            )}

            {activeTab === "pretest" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  Pre-Test Questions
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Test your knowledge before performing the experiment.
                </p>

                <div className="space-y-8">
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-800 dark:text-white mb-3">
                      1. What is the formula for the time constant of an RC
                      circuit?
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="q1a"
                          name="q1"
                          className="mr-2"
                        />
                        <label
                          htmlFor="q1a"
                          className="text-gray-700 dark:text-gray-300"
                        >
                          τ = R/C
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="q1b"
                          name="q1"
                          className="mr-2"
                        />
                        <label
                          htmlFor="q1b"
                          className="text-gray-700 dark:text-gray-300"
                        >
                          τ = RC
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="q1c"
                          name="q1"
                          className="mr-2"
                        />
                        <label
                          htmlFor="q1c"
                          className="text-gray-700 dark:text-gray-300"
                        >
                          τ = R+C
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="q1d"
                          name="q1"
                          className="mr-2"
                        />
                        <label
                          htmlFor="q1d"
                          className="text-gray-700 dark:text-gray-300"
                        >
                          τ = 1/RC
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-800 dark:text-white mb-3">
                      2. After one time constant, a charging capacitor will
                      reach what percentage of the final voltage?
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="q2a"
                          name="q2"
                          className="mr-2"
                        />
                        <label
                          htmlFor="q2a"
                          className="text-gray-700 dark:text-gray-300"
                        >
                          50%
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="q2b"
                          name="q2"
                          className="mr-2"
                        />
                        <label
                          htmlFor="q2b"
                          className="text-gray-700 dark:text-gray-300"
                        >
                          63.2%
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="q2c"
                          name="q2"
                          className="mr-2"
                        />
                        <label
                          htmlFor="q2c"
                          className="text-gray-700 dark:text-gray-300"
                        >
                          86.5%
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="q2d"
                          name="q2"
                          className="mr-2"
                        />
                        <label
                          htmlFor="q2d"
                          className="text-gray-700 dark:text-gray-300"
                        >
                          100%
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  Submit Answers
                </button>
              </div>
            )}

            {/* Other tab contents would go here */}
            {activeTab === "procedure" && (
              <div className="prose max-w-none dark:prose-invert">
                <h2>Procedure</h2>
                <ol>
                  <li>Connect the circuit as shown in the diagram.</li>
                  <li>Set the DC voltage source to 10V.</li>
                  <li>Use a resistor of 10kΩ and a capacitor of 100μF.</li>
                  <li>Connect the oscilloscope across the capacitor.</li>
                  <li>Start the simulation to observe the charging curve.</li>
                  <li>
                    Measure the time taken for the capacitor to charge to 63.2%
                    of the supply voltage.
                  </li>
                  <li>
                    Calculate the time constant and compare with the theoretical
                    value.
                  </li>
                  <li>
                    Disconnect the power supply and connect the charged
                    capacitor across the resistor.
                  </li>
                  <li>Observe the discharging curve on the oscilloscope.</li>
                  <li>Record your observations and complete the analysis.</li>
                </ol>
              </div>
            )}

            {/* Add additional tab content for simulation, posttest, references, etc. */}
          </div>
        </div>

        {/* Notes Panel */}
        <div
          className={`${
            showNotes ? "w-1/3" : "w-0"
          } border-l border-gray-200 dark:border-gray-700 transition-all duration-300 overflow-hidden`}
        >
          {showNotes && (
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h2 className="font-medium text-gray-800 dark:text-white">
                  Lab Notes
                </h2>
                <button className="text-gray-500 hover:text-red-500">
                  <Icon icon="mdi:close" onClick={() => setShowNotes(false)} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <textarea
                  className="w-full h-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-yellow-50 dark:bg-gray-700 text-gray-800 dark:text-white resize-none"
                  placeholder="Take notes about this experiment here..."
                ></textarea>
              </div>
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  Save Notes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Notes toggle button */}
      <div className="flex justify-end mt-4">
        <button
          className="flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-600 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition"
          onClick={() => setShowNotes(!showNotes)}
        >
          <Icon
            icon={
              showNotes
                ? "mdi:notebook-minus-outline"
                : "mdi:notebook-plus-outline"
            }
            className="mr-2"
          />
          {showNotes ? "Hide Notes" : "Show Notes"}
        </button>
      </div>
    </div>
  );
};

export default ExperimentPage;

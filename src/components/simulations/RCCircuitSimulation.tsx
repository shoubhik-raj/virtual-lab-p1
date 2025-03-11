import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";

const RCCircuitSimulation = () => {
  const [voltage, setVoltage] = useState(5);
  const [resistance, setResistance] = useState(1000); // 1kΩ
  const [capacitance, setCapacitance] = useState(100); // 100µF
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [currentVoltage, setCurrentVoltage] = useState(0);

  useEffect(() => {
    let interval: any;

    if (isRunning) {
      interval = setInterval(() => {
        setTime((prev) => {
          const newTime = prev + 0.1;
          // RC circuit charging equation
          const timeConstant = resistance * capacitance * 1e-6; // convert µF to F
          const voltageAtTime =
            voltage * (1 - Math.exp(-newTime / timeConstant));
          setCurrentVoltage(voltageAtTime);

          return newTime;
        });
      }, 100);
    }

    return () => clearInterval(interval);
  }, [isRunning, resistance, capacitance, voltage]);

  const handleReset = () => {
    setTime(0);
    setCurrentVoltage(0);
    setIsRunning(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">RC Circuit Simulation</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          {/* Circuit controls */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Supply Voltage (V)
              </label>
              <input
                type="range"
                min="1"
                max="12"
                value={voltage}
                onChange={(e) => setVoltage(Number(e.target.value))}
                className="w-full"
                disabled={isRunning}
              />
              <div className="flex justify-between text-sm">
                <span>1V</span>
                <span>{voltage}V</span>
                <span>12V</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Resistance (Ω)
              </label>
              <input
                type="range"
                min="100"
                max="10000"
                step="100"
                value={resistance}
                onChange={(e) => setResistance(Number(e.target.value))}
                className="w-full"
                disabled={isRunning}
              />
              <div className="flex justify-between text-sm">
                <span>100Ω</span>
                <span>{resistance}Ω</span>
                <span>10kΩ</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Capacitance (µF)
              </label>
              <input
                type="range"
                min="10"
                max="1000"
                step="10"
                value={capacitance}
                onChange={(e) => setCapacitance(Number(e.target.value))}
                className="w-full"
                disabled={isRunning}
              />
              <div className="flex justify-between text-sm">
                <span>10µF</span>
                <span>{capacitance}µF</span>
                <span>1000µF</span>
              </div>
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`px-4 py-2 rounded-lg flex items-center ${
                  isRunning
                    ? "bg-yellow-500 hover:bg-yellow-600"
                    : "bg-green-500 hover:bg-green-600"
                } text-white`}
              >
                <Icon
                  icon={isRunning ? "mdi:pause" : "mdi:play"}
                  className="mr-2"
                />
                {isRunning ? "Pause" : "Start"}
              </button>

              <button
                onClick={handleReset}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg flex items-center"
                disabled={!time}
              >
                <Icon icon="mdi:refresh" className="mr-2" />
                Reset
              </button>
            </div>
          </div>
        </div>

        <div>
          {/* Circuit visualization */}
          <div className="border border-gray-300 dark:border-gray-600 p-4 rounded-lg h-full flex flex-col">
            <div className="text-center mb-2">
              <span className="text-sm font-medium">
                Time: {time.toFixed(1)}s
              </span>
              <div className="flex justify-between">
                <span>
                  Time Constant (τ):{" "}
                  {(resistance * capacitance * 1e-6).toFixed(2)}s
                </span>
                <span>
                  Charge: {((currentVoltage / voltage) * 100).toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="flex-grow relative">
              {/* Simple circuit diagram */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  width="200"
                  height="200"
                  className="text-gray-700 dark:text-gray-300"
                >
                  {/* Battery */}
                  <line
                    x1="40"
                    y1="100"
                    x2="40"
                    y2="40"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <line
                    x1="30"
                    y1="40"
                    x2="50"
                    y2="40"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <line
                    x1="35"
                    y1="30"
                    x2="45"
                    y2="30"
                    stroke="currentColor"
                    strokeWidth="2"
                  />

                  {/* Resistor */}
                  <line
                    x1="40"
                    y1="100"
                    x2="100"
                    y2="100"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M100,90 L100,110 L120,90 L120,110 L140,90 L140,110 L160,100"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />

                  {/* Capacitor */}
                  <line
                    x1="160"
                    y1="100"
                    x2="160"
                    y2="70"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <line
                    x1="140"
                    y1="70"
                    x2="180"
                    y2="70"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <line
                    x1="140"
                    y1="50"
                    x2="180"
                    y2="50"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <line
                    x1="160"
                    y1="50"
                    x2="160"
                    y2="30"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <line
                    x1="160"
                    y1="30"
                    x2="40"
                    y2="30"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </div>

              {/* Voltage meter */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-full h-16 w-16 flex items-center justify-center text-xl border-4 border-gray-300 dark:border-gray-600">
                  {currentVoltage.toFixed(1)}V
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RCCircuitSimulation;

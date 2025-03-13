import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useData } from "../contexts/DataContext";
import { Icon } from "@iconify/react";
import styled from "styled-components";

// Styled components for the wave animation
const WaveBackground = styled.div`
  position: relative;
  width: 100%;
  height: 234px;
  border-radius: 18px;
  background: url("/assets/svg/background-wave.png"), #4a77fd;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  overflow: hidden;
`;

const NotebookCard = styled.div`
  border-radius: 18px;
  overflow: hidden;
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

const LabBadge = styled.div`
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: #f0f7ff;
  color: #4a77fd;
  border-radius: 2rem;
  font-size: 0.875rem;
  font-weight: 500;
  margin-top: 0.5rem;
`;

const CreateNoteButton = styled.div`
  background-color: #f1f5f9;
  border-radius: 18px;
  padding: 2rem;
  display: flex;
  justify-content: start;
  align-items: flex-start;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  height: 100%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  &:hover {
    transform: translateY(-2px);
  }
`;

const SelectDropdown = styled.select`
  background-color: transparent;
  border: none;
  color: white;
  font-size: 2.5rem;
  font-weight: bold;
  padding-right: 2.5rem;
  appearance: none;
  cursor: pointer;
  outline: none;
  width: 100%;
  max-width: 480px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  option {
    background-color: white;
    color: #333;
    font-size: 1rem;
  }
`;

const LabNotebookPage = () => {
  const { departments, experiments, labs, stickyNotes, getExperimentById } =
    useData();

  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [filteredExperiments, setFilteredExperiments] = useState<any[]>([]);

  // Define sticky note colors
  const noteColors = [
    "bg-yellow-100",
    "bg-blue-100",
    "bg-pink-100",
    "bg-green-100",
    "bg-purple-100",
    "bg-red-100",
    "bg-orange-100",
    "bg-gray-100",
    "bg-teal-100",
    "bg-indigo-100",
    "bg-lime-100",
  ];

  // Function to get a random color
  const getRandomColor = () => {
    return noteColors[Math.floor(Math.random() * noteColors.length)];
  };

  // Group experiments with notes by department
  useEffect(() => {
    // First, get all experiments with notes
    const allExpsWithNotes = Object.keys(stickyNotes)
      .filter((expId) => stickyNotes[expId]?.length > 0)
      .map((expId) => {
        const exp = getExperimentById(expId);
        return {
          id: expId,
          name: exp?.name || "Unknown Experiment",
          notes: stickyNotes[expId] || [],
          labId: exp?.labId,
        };
      });

    console.log("All experiments with notes:", allExpsWithNotes);

    if (!selectedDepartment) {
      // Show all experiments with notes if no department selected
      setFilteredExperiments(allExpsWithNotes);
    } else {
      console.log("Selected department ID:", selectedDepartment);

      // Print all departments to debug
      console.log("All departments:", departments);

      // Find the lab IDs for each experiment
      const expLabMap = allExpsWithNotes.map((exp) => ({
        expId: exp.id,
        labId: exp.labId,
        expName: exp.name,
      }));
      console.log("Experiment-Lab mapping:", expLabMap);

      // Print all labs
      console.log("All labs:", labs);

      // Let's try a simpler approach for now - show all experiments
      // This will help us determine if the filtering itself is the issue
      setFilteredExperiments(allExpsWithNotes);

      /* 
      // Original approach that's not working:
      const departmentId = parseInt(selectedDepartment);
      const selectedDept = departments.find((d) => d.id === departmentId);

      // If we found the department, filter experiments by labs within that department
      if (selectedDept && selectedDept.labs) {
        const filteredExps = allExpsWithNotes.filter((exp) =>
          selectedDept.labs.includes(exp.labId)
        );
        setFilteredExperiments(filteredExps);
      } else {
        // Fallback - no department or no labs in department
        setFilteredExperiments([]);
      }
      */
    }
  }, [selectedDepartment, stickyNotes, getExperimentById, departments, labs]);

  // Debug function to help understand data types
  useEffect(() => {
    console.log("Current filtered experiments:", filteredExperiments);
  }, [filteredExperiments]);

  const getLabName = (labId: string) => {
    // Handle potential type mismatch
    const lab = labs.find((l) => String(l.id) === String(labId));
    return lab?.name || "Unknown Lab";
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Lab Notebook</h1>
      </div>

      <div className="flex flex-col relative md:flex-row gap-6">
        {/* Department selection with wave background - add w-1/3 class */}
        <div className="w-full md:w-2/3">
          <WaveBackground className="flex flex-col justify-center">
            {/* Chemistry equipment SVG overlay */}
            <div
              className="absolute right-6 -bottom-2 transform"
              style={{ zIndex: 1 }}
            >
              <svg
                width="266"
                height="201"
                viewBox="0 0 266 201"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-64 h-52 scale-105"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M87.0192 157.716C85.7604 154.037 85.4386 149.594 87.8711 147.066L113.038 120.853C115.253 120.608 120.364 120.212 121.746 119.665C123.251 119.061 124.737 118.278 126.194 117.316C128.797 115.599 131.391 114.741 133.974 114.741C136.596 114.741 139.322 115.618 142.133 117.373C146.175 119.891 150.225 121.155 154.276 121.155C158.072 121.155 161.782 120.051 165.397 117.835C164.366 121.542 163.826 125.419 163.826 129.39C163.826 140.219 167.811 150.123 174.398 157.726L87.0192 157.716ZM78.4632 36.7217V33.6655C78.4632 25.9306 81.6245 18.903 86.7355 13.8186C91.8371 8.73425 98.8882 5.57422 106.649 5.57422H120.591C128.352 5.57422 135.403 8.72483 140.505 13.8186C145.606 18.903 148.777 25.9304 148.777 33.6655V36.7217H169.638C172.127 36.7217 174.171 38.7498 174.171 41.2401V43.1361C174.171 45.6168 172.127 47.6544 169.638 47.6544H164.091C162.87 47.6544 161.876 48.6449 161.876 49.8617V104.251C161.876 104.779 162.009 105.26 162.369 105.637L165.501 108.901C165.066 109.25 164.735 109.495 164.574 109.58C163.684 110.033 162.851 110.524 162.056 111.042C159.453 112.759 156.86 113.618 154.276 113.618C151.655 113.618 148.929 112.74 146.118 110.986C142.076 108.467 138.025 107.203 133.974 107.203C130.255 107.203 126.62 108.269 123.071 110.392L127.633 105.637C128.002 105.26 128.125 104.779 128.125 104.251V94.6858H141.698C143.78 94.6858 145.474 92.9973 145.474 90.9221C145.474 88.8468 143.78 87.1584 141.698 87.1584H128.125V83.4702H141.698C143.78 83.4702 145.474 81.7817 145.474 79.7065C145.474 77.6312 143.78 75.9427 141.698 75.9427H128.125V72.2546H141.698C143.78 72.2546 145.474 70.5756 145.474 68.4909C145.474 66.4156 143.78 64.7271 141.698 64.7271H128.125V61.039H141.698C143.78 61.039 145.474 59.3599 145.474 57.2753C145.474 55.2 143.78 53.5115 141.698 53.5115H128.125V49.8516C128.125 48.6348 127.131 47.6444 125.91 47.6444H120.364C117.875 47.6444 115.83 45.6163 115.83 43.126V41.23C115.83 38.7492 117.865 36.7116 120.364 36.7116H141.224V33.6554C141.224 27.9956 138.905 22.8547 135.167 19.1289C131.428 15.403 126.27 13.0918 120.591 13.0918H106.65C100.971 13.0918 95.8125 15.4029 92.0646 19.1289C88.326 22.8549 86.0072 27.9958 86.0072 33.6554V36.7116H98.4344C100.678 36.7116 102.514 38.5416 102.514 40.7772V42.8524C102.514 45.088 100.678 46.918 98.4344 46.918H96.3237L96.3332 77.8107H68.1565V46.9277H66.0458C63.8027 46.9277 61.9665 45.0977 61.9665 42.8621V40.7869C61.9665 38.5513 63.8027 36.7213 66.0458 36.7213L78.4632 36.7217ZM44.3817 63.4344H60.6042V75.2631L44.3817 75.2726V157.717H26.7679V19.8187H44.3911V63.4351L44.3817 63.4344ZM96.3327 85.3281H68.1559V96.704C68.1559 104.429 74.4973 110.75 82.2489 110.75C90.0005 110.75 96.3419 104.429 96.3419 96.704L96.3327 85.3281ZM19.7812 182.797V165.233H246.215V182.797H19.7812ZM222.279 96.7308C221.096 96.1931 220.376 95.0801 220.376 93.7877V77.5159C220.376 76.6292 221.105 75.9029 222.004 75.9029H223.339C224.986 75.9029 226.339 74.554 226.339 72.9126V70.7336C226.339 69.0923 224.986 67.7434 223.339 67.7434H191.377C189.731 67.7434 188.377 69.0923 188.377 70.7336V72.9126C188.377 74.5539 189.731 75.9029 191.377 75.9029H192.721C193.611 75.9029 194.349 76.6292 194.349 77.5159V93.7877C194.349 95.0894 193.63 96.193 192.447 96.7308C182.405 101.296 174.843 110.324 172.306 121.265C172.514 121.303 172.732 121.36 172.931 121.435C175.032 122.199 177.086 122.444 179.083 122.171C181.118 121.897 183.181 121.067 185.263 119.7C193.091 114.54 201.117 114.521 209.342 119.643C212.162 121.397 214.879 122.275 217.5 122.275C220.094 122.275 222.677 121.416 225.28 119.699C228.148 117.813 231.082 116.615 234.092 116.124C236.325 115.756 238.569 115.785 240.821 116.2C237.404 107.569 230.721 100.57 222.279 96.7308ZM242.95 124.096C242.353 124.218 241.71 124.19 241.085 124.001C239.116 123.388 237.195 123.237 235.312 123.539C233.371 123.86 231.422 124.661 229.453 125.963C225.572 128.52 221.597 129.802 217.508 129.802C213.457 129.802 209.416 128.538 205.365 126.02C199.866 122.595 194.557 122.577 189.417 125.963C186.388 127.963 183.274 129.18 180.085 129.614C177.189 130.01 174.292 129.746 171.377 128.84C171.377 129.019 171.368 129.199 171.368 129.378C171.368 140.905 176.829 151.158 185.3 157.713H229.395C237.866 151.157 243.328 140.904 243.328 129.378C243.337 127.586 243.205 125.812 242.95 124.096ZM224.446 141.084C226.935 141.084 228.961 143.103 228.961 145.584C228.961 148.065 226.935 150.083 224.446 150.083C221.957 150.083 219.931 148.065 219.931 145.584C219.931 143.103 221.957 141.084 224.446 141.084ZM202.516 128.793C204.741 128.793 206.539 130.586 206.539 132.802C206.539 135.019 204.741 136.811 202.516 136.811C200.292 136.811 198.494 135.019 198.494 132.802C198.484 130.586 200.292 128.793 202.516 128.793ZM190.704 144.084C192.881 144.084 194.651 145.848 194.651 148.017C194.651 150.187 192.881 151.951 190.704 151.951C188.527 151.951 186.758 150.187 186.758 148.017C186.758 145.848 188.527 144.084 190.704 144.084ZM157.522 135.104C153.953 135.104 151.067 137.981 151.067 141.537C151.067 145.093 153.953 147.97 157.522 147.97C161.09 147.97 163.977 145.093 163.977 141.537C163.977 137.981 161.09 135.104 157.522 135.104ZM134.75 126.784C132.44 126.784 130.576 128.642 130.576 130.944C130.576 133.236 132.44 135.104 134.75 135.104C137.05 135.104 138.924 133.236 138.924 130.944C138.924 128.642 137.059 126.784 134.75 126.784ZM115.498 142.188C112.384 142.188 109.857 144.706 109.857 147.81C109.857 150.913 112.385 153.432 115.498 153.432C118.612 153.432 121.139 150.913 121.139 147.81C121.149 144.706 118.622 142.188 115.498 142.188Z"
                  fill="#AEC3FF"
                />
                <rect
                  x="4.14185"
                  y="182.892"
                  width="257.716"
                  height="17.6216"
                  fill="#8EAAFA"
                />
              </svg>
            </div>

            <div className="px-8 py-6 relative z-10">
              <div className="text-white text-lg opacity-80 mb-1">
                Select Department
              </div>
              <div className="flex items-baseline">
                <SelectDropdown
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </SelectDropdown>
                <div className="text-white">
                  <Icon icon="mdi:chevron-down" width="32" height="32" />
                </div>
              </div>
            </div>
          </WaveBackground>
        </div>

        {/* Create Note button - will now take remaining space */}
        <div className="w-full md:w-1/3">
          <Link
            to="/notebook/new"
            className="block relative h-full items-start justify-start"
          >
            <CreateNoteButton className="flex flex-col ">
              <p className="text-gray-500 text-lg px-6 py-3 bg-gray-200 rounded-lg">
                Create a New Note
              </p>
              <div className="flex flex-col">
                <div className="absolute bottom-0 right-0">
                  <svg
                    width="323"
                    height="114"
                    viewBox="0 0 323 114"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <mask
                      id="mask0_204_12103"
                      className="mask-type:alpha"
                      maskUnits="userSpaceOnUse"
                      x="0"
                      y="0"
                      width="323"
                      height="114"
                    >
                      <rect width="323" height="114" rx="18" fill="#F1F5F9" />
                    </mask>
                    <g mask="url(#mask0_204_12103)">
                      <path
                        d="M303.557 58.6173C303.557 52.9705 298.979 48.3928 293.332 48.3928H228.577C222.93 48.3928 218.352 52.9705 218.352 58.6173V114H303.557V58.6173Z"
                        fill="#4A77FD"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M54.9273 40C58.6705 40 62.1145 42.0455 63.9055 45.3325L65.2416 47.7846C66.9932 50.9994 70.3616 53 74.0227 53H131.775C137.422 53 142 57.5777 142 63.2245V106C142 111.523 137.523 116 132 116H103.549C103.036 116 102.71 116.549 102.955 117C103.201 117.451 102.874 118 102.361 118H27C25.8954 118 25 117.105 25 116V63.2245V50.2245C25 44.5777 29.5777 40 35.2245 40H54.9273Z"
                        fill="#638AFF"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M112.073 36C108.329 36 104.885 38.0455 103.094 41.3325L92.4956 60.7846C90.7439 63.9994 87.3755 66 83.7145 66H35.2245C29.5777 66 25 70.5777 25 76.2245V119C25 124.523 29.4771 129 35 129H212C217.523 129 222 124.523 222 119V114V76.2245V46.2245C222 40.5777 217.422 36 211.775 36H112.073Z"
                        fill="#4A77FD"
                      />
                      <path
                        d="M138 10.903C138 5.25614 142.578 0.678467 148.225 0.678467H261.546C267.193 0.678467 271.771 5.25613 271.771 10.903V114H138V10.903Z"
                        fill="#638AFF"
                      />
                      <rect
                        x="155.041"
                        y="49.2449"
                        width="99.6889"
                        height="6.81634"
                        rx="3.40817"
                        fill="#8EAAFA"
                      />
                      <rect
                        x="155.041"
                        y="66.2856"
                        width="99.6889"
                        height="6.81634"
                        rx="3.40817"
                        fill="#8EAAFA"
                      />
                      <rect
                        x="155.041"
                        y="83.3267"
                        width="45.1582"
                        height="6.81634"
                        rx="3.40817"
                        fill="#8EAAFA"
                      />
                      <rect
                        x="75"
                        y="95.3267"
                        width="45.1582"
                        height="6.81634"
                        rx="3.40817"
                        fill="#8EAAFA"
                      />
                      <rect
                        x="36"
                        y="50"
                        width="18"
                        height="7"
                        rx="3.5"
                        fill="white"
                      />
                      <rect
                        x="155"
                        y="21"
                        width="67"
                        height="11"
                        rx="2"
                        fill="#8EAAFA"
                      />
                    </g>
                  </svg>
                </div>
              </div>
            </CreateNoteButton>
          </Link>
        </div>
      </div>

      {/* Experiment cards with notes - new layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {filteredExperiments.length > 0 ? (
          filteredExperiments.map((exp) => (
            <Link
              to={`/notebook/${exp.id}`}
              key={exp.id}
              className="block h-full"
            >
              <NotebookCard>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">
                    {exp.name}
                  </h3>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-xs">
                      {exp.notes.length}{" "}
                      {exp.notes.length === 1 ? "note" : "notes"}
                    </span>
                    <Icon
                      icon="mdi:arrow-right"
                      className="ml-1 text-md text-gray-500"
                    />
                  </div>
                  {/* Preview of sticky notes */}
                  <div className="flex align-center justify-center gap-2 mt-6">
                    {exp.notes.slice(0, 3).map((note: any) => {
                      const randomColor = getRandomColor();
                      return (
                        <div
                          key={note.id}
                          className={`p-4 h-24 w-24 text-gray-500 text-sm ${randomColor} shadow-sm`}
                          style={{ transform: "rotate(-0.5deg)" }}
                        >
                          <p className="text-gray-700 line-clamp-2">
                            {note.text.substring(0, 120)}
                            {note.text.length > 120 && "..."}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-auto p-5  border-t border-gray-100">
                  {/* <LabBadge>{getLabName(exp.labId)}</LabBadge> */}
                  <p className="p-4 text-center text-gray-800 bg-blue-100 w-full rounded-xl ">
                    {getLabName(exp.labId)}
                  </p>
                </div>
              </NotebookCard>
            </Link>
          ))
        ) : (
          <div className="col-span-full bg-white rounded-lg p-10 text-center shadow-sm border border-gray-100">
            <div className="flex flex-col items-center justify-center">
              <svg
                width="323"
                height="114"
                viewBox="0 0 323 114"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-64 h-32 mb-4 opacity-80"
              >
                <mask
                  id="mask0_204_12103"
                  style={{ maskType: "alpha" }}
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width="323"
                  height="114"
                >
                  <rect width="323" height="114" rx="18" fill="#F1F5F9" />
                </mask>
                <g mask="url(#mask0_204_12103)">
                  <path
                    d="M303.557 58.6173C303.557 52.9705 298.979 48.3928 293.332 48.3928H228.577C222.93 48.3928 218.352 52.9705 218.352 58.6173V114H303.557V58.6173Z"
                    fill="#4A77FD"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M54.9273 40C58.6705 40 62.1145 42.0455 63.9055 45.3325L65.2416 47.7846C66.9932 50.9994 70.3616 53 74.0227 53H131.775C137.422 53 142 57.5777 142 63.2245V106C142 111.523 137.523 116 132 116H103.549C103.036 116 102.71 116.549 102.955 117C103.201 117.451 102.874 118 102.361 118H27C25.8954 118 25 117.105 25 116V63.2245V50.2245C25 44.5777 29.5777 40 35.2245 40H54.9273Z"
                    fill="#638AFF"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M112.073 36C108.329 36 104.885 38.0455 103.094 41.3325L92.4956 60.7846C90.7439 63.9994 87.3755 66 83.7145 66H35.2245C29.5777 66 25 70.5777 25 76.2245V119C25 124.523 29.4771 129 35 129H212C217.523 129 222 124.523 222 119V114V76.2245V46.2245C222 40.5777 217.422 36 211.775 36H112.073Z"
                    fill="#4A77FD"
                  />
                  <path
                    d="M138 10.903C138 5.25614 142.578 0.678467 148.225 0.678467H261.546C267.193 0.678467 271.771 5.25613 271.771 10.903V114H138V10.903Z"
                    fill="#638AFF"
                  />
                  <rect
                    x="155.041"
                    y="49.2449"
                    width="99.6889"
                    height="6.81634"
                    rx="3.40817"
                    fill="#8EAAFA"
                  />
                  <rect
                    x="155.041"
                    y="66.2856"
                    width="99.6889"
                    height="6.81634"
                    rx="3.40817"
                    fill="#8EAAFA"
                  />
                  <rect
                    x="155.041"
                    y="83.3267"
                    width="45.1582"
                    height="6.81634"
                    rx="3.40817"
                    fill="#8EAAFA"
                  />
                  <rect
                    x="75"
                    y="95.3267"
                    width="45.1582"
                    height="6.81634"
                    rx="3.40817"
                    fill="#8EAAFA"
                  />
                  <rect
                    x="36"
                    y="50"
                    width="18"
                    height="7"
                    rx="3.5"
                    fill="white"
                  />
                  <rect
                    x="155"
                    y="21"
                    width="67"
                    height="11"
                    rx="2"
                    fill="#8EAAFA"
                  />
                </g>
              </svg>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                No notes found
              </h3>
              <p className="text-gray-500 max-w-md">
                Add sticky notes to your experiments to see them here.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LabNotebookPage;

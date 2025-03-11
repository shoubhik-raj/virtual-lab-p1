import { useParams, Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useEffect, useState, useRef } from "react";
import { createLabSlug } from "../utils/routes";
import {
  labsByDepartment,
  getDepartmentById,
  Department,
  Lab,
} from "../data/mockData";

const DepartmentPage = () => {
  const { departmentSlug } = useParams<{ departmentSlug: string }>();
  const [department, setDepartment] = useState<Department | null>(null);
  const [labs, setLabs] = useState<Lab[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("B.tech");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Available courses
  const courses = ["B.tech", "M.tech", "BSc", "MSc", "PhD"];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    // In a real app, you would fetch department data based on the slug
    // For now, use the first department as a placeholder
    const dept = getDepartmentById(1);
    if (dept) {
      setDepartment(dept);
      // Get labs for this department
      setLabs(labsByDepartment[dept.id] || []);
    }
  }, [departmentSlug]);

  const filteredLabs = labs.filter(
    (lab) =>
      lab.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lab.institution.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!department) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header with department name, centered search, and course selector */}
      <div className="flex justify-between items-center mb-6">
        {/* Department name on left */}
        <h1 className="text-2xl font-medium text-gray-800 dark:text-white">
          {department.name}
        </h1>

        {/* Search bar in center */}
        <div className="relative flex-1 max-w-2xl mx-12">
          <input
            type="text"
            placeholder="Search for experiments, laboratories etc"
            className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Icon
            icon="mdi:magnify"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
        </div>

        {/* Course selector on right */}
        <div className="flex items-center gap-2" ref={dropdownRef}>
          <span className="text-gray-600 dark:text-gray-300">Course</span>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md px-3 py-1.5"
            >
              <span className="text-gray-800 dark:text-white font-medium">
                {selectedCourse}
              </span>
              <Icon
                icon={isDropdownOpen ? "mdi:chevron-up" : "mdi:chevron-down"}
                className="ml-2 text-gray-500"
              />
            </button>

            {/* Dropdown menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10">
                {courses.map((course) => (
                  <button
                    key={course}
                    onClick={() => {
                      setSelectedCourse(course);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700
                      ${
                        course === selectedCourse
                          ? "bg-gray-50 dark:bg-gray-700"
                          : ""
                      }`}
                  >
                    <span className="text-gray-800 dark:text-white">
                      {course}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Labs list */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {filteredLabs.map((lab, index) => (
          <Link
            key={lab.id}
            to={`/labs/${createLabSlug(lab.name)}`}
            className="block border-b border-gray-200 dark:border-gray-700 last:border-b-0"
          >
            <div className="flex items-center justify-between px-6 py-5 hover:bg-gray-50 dark:hover:bg-gray-700">
              <div className="text-lg font-medium text-gray-800 dark:text-white">
                {lab.name}
              </div>
              <div className="flex items-center">
                <div className="flex items-center mr-8">
                  <img
                    src={lab.institutionLogo}
                    alt={lab.institution}
                    className="w-8 h-8 rounded-full"
                    onError={(e) => {
                      // Fallback to icon if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.style.display = "none";
                      // Logic to show a fallback icon could be added here
                    }}
                  />
                  <span className="ml-3 text-gray-600 dark:text-gray-400">
                    {lab.institution}
                  </span>
                </div>
                <span className="text-gray-500 dark:text-gray-400 mr-6">
                  {lab.experimentCount.toString().padStart(2, "0")} Experiments
                </span>
                <Icon
                  icon="mdi:arrow-right"
                  className="text-xl text-gray-400"
                />
              </div>
            </div>
          </Link>
        ))}

        {filteredLabs.length === 0 && (
          <div className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
            No labs found matching your search criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentPage;

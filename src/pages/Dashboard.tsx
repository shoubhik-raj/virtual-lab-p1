import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useData } from "../contexts/DataContext";
import { createDepartmentSlug } from "../utils/routes";
import styled from "styled-components";
import * as mockData from "../data/newMockData";

// Add this styled component (or a regular class if not using styled-components)
const ScrollingAnnouncements = styled.div`
  height: 300px;
  overflow: hidden;
  position: relative;

  .announcement-container {
    position: absolute;
    width: 100%;
    animation: scrollAnnouncements 30s linear infinite;
  }

  .announcement-item {
    padding-bottom: 16px;
    margin-bottom: 16px;
    border-bottom: 1px solid #e5e7eb;

    &:last-child {
      border-bottom: none;
    }
  }

  @keyframes scrollAnnouncements {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(-50%);
    }
  }

  &:hover .announcement-container {
    animation-play-state: paused;
  }
`;

const Dashboard = () => {
  const {
    departments,
    labs,
    experiments,
    userProgress,
    userBookmarks,
    collections,
  } = useData();

  const [departmentSearch, setDepartmentSearch] = useState("");
  const [course, setCourse] = useState("B.tech");
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);
  const courseDropdownRef = useRef<HTMLDivElement>(null);

  // Available courses
  const courses = ["B.tech", "M.tech", "BSc", "MSc", "Engineering", "Sciences"];

  // Add this useEffect for closing dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        courseDropdownRef.current &&
        !courseDropdownRef.current.contains(event.target as Node)
      ) {
        setShowCourseDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  console.log(experiments);

  // Filter departments based on search
  const filteredDepartments = departments.filter((dept) =>
    dept.name.toLowerCase().includes(departmentSearch.toLowerCase())
  );

  // Get experiments that have progress
  const inProgressExperiments =
    experiments && experiments.length > 0
      ? experiments
          .filter((exp) => {
            const progress = userProgress[exp.id]?.overall || 0;
            return progress > 0 && progress < 100;
          })
          .map((exp) => {
            // Find the lab for this experiment
            const lab = labs.find((lab) => lab.id === exp.labId);

            // Find the department that contains this lab
            const department = departments.find((dept) =>
              dept.labs.some((deptLab) => deptLab.id === lab?.id)
            );

            return {
              ...exp,
              progress: userProgress[exp.id]?.overall || 0,
              department: department?.name || "Unknown",
              departmentId: department?.id, // Store the department ID for routing
            };
          })
          .sort((a, b) => (b.progress || 0) - (a.progress || 0))
          .slice(0, 3) // Show top 3
      : [];

  // Get announcements from mock data
  const announcements = mockData.announcements || [];

  // Update the formatting function for announcements
  const formattedAnnouncements = announcements.map((announcement) => ({
    ...announcement,
    // Provide default values for any missing properties
    icon: announcement.icon || "mdi:bell",
    title: announcement.title || "Announcement",
    // We'll keep the original content for HTML rendering
    content: announcement.content || "",
    // Extract plain text description for fallback
    description:
      announcement.description ||
      (announcement.content
        ? announcement.content.replace(/<[^>]*>/g, "")
        : ""),
    date: announcement.date || "Recent",
  }));

  // Create experiment collections based on bookmarks
  const sortedCollections = collections
    .slice()
    .sort((a, b) => b.lastModified - a.lastModified)
    .slice(0, 2); // Only show 2 most recent collections

  const experimentCollectionsWithImages = sortedCollections.map(
    (collection) => {
      // Get experiment thumbnails for this collection
      const experimentThumbnails = collection.experimentIds
        .map((id) => experiments.find((exp) => exp.id === id)?.thumbnail)
        .filter(Boolean) as string[];

      return {
        ...collection,
        images: experimentThumbnails.slice(0, 4), // Only show up to 4 images
      };
    }
  );

  return (
    <div className="space-y-6 p-6 pt-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 px-8">
        <h1 className="text-xl font-medium text-gray-800 dark:text-white">
          Virtual Labs Learning Portal
        </h1>
        {/* <div className="flex items-center gap-4"> */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search for experiments, labs, etc"
            className="pl-10 pr-4 py-2 w-72 bg-white dark:bg-gray-800 border-none focus:ring-0 focus:outline-none"
          />
          <Icon
            icon="mdi:magnify"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800 outline-none ring-0"
          />
        </div>
        <div
          className="flex items-center gap-2 relative"
          ref={courseDropdownRef}
        >
          <span className="text-gray-500 dark:text-gray-300">Course</span>
          <div
            className="flex items-center dark:bg-gray-800 border-gray-200 dark:border-gray-700 px-3 py-1.5 cursor-pointer"
            onClick={() => setShowCourseDropdown(!showCourseDropdown)}
          >
            <span className="text-gray-800 dark:text-white font-medium">
              {course}
            </span>
            <Icon icon="mdi:chevron-down" className="ml-2 text-blue-500" />
          </div>

          {/* Course Dropdown */}
          {showCourseDropdown && (
            <div className="absolute top-full right-0 mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50 w-40">
              {courses.map((c) => (
                <button
                  key={c}
                  className={`w-full text-left px-4 py-2 ${
                    c === course
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                      : "hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
                  }`}
                  onClick={() => {
                    setCourse(c);
                    setShowCourseDropdown(false);
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>
        {/* </div> */}
      </div>

      {/* Announcements and Experiment Collections side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Announcements */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b-2 border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-800 dark:text-white">
              Announcements
            </h2>
          </div>
          <ScrollingAnnouncements>
            <div className="announcement-container">
              {/* First set of announcements */}
              {formattedAnnouncements.map((announcement) => (
                <div
                  key={`first-${announcement.id}`}
                  className="announcement-item px-6 py-4"
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-4">
                      <Icon
                        icon={announcement.icon}
                        className="text-2xl text-blue-500"
                      />
                    </div>
                    <div>
                      <h3 className="text-gray-800 dark:text-white font-medium">
                        {announcement.title}
                      </h3>
                      {announcement.content ? (
                        <div
                          className="text-gray-500 dark:text-gray-400 mt-1"
                          dangerouslySetInnerHTML={{
                            __html: announcement.content,
                          }}
                        />
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                          {announcement.description}
                        </p>
                      )}
                      <div className="mt-2 text-xs text-gray-400">
                        {announcement.date}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Duplicate announcements to create infinite scroll effect */}
              {formattedAnnouncements.map((announcement) => (
                <div
                  key={`second-${announcement.id}`}
                  className="announcement-item px-6 py-4"
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-4">
                      <Icon
                        icon={announcement.icon}
                        className="text-2xl text-blue-500"
                      />
                    </div>
                    <div>
                      <h3 className="text-gray-800 dark:text-white font-medium">
                        {announcement.title}
                      </h3>
                      {announcement.content ? (
                        <div
                          className="text-gray-500 dark:text-gray-400 mt-1"
                          dangerouslySetInnerHTML={{
                            __html: announcement.content,
                          }}
                        />
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                          {announcement.description}
                        </p>
                      )}
                      <div className="mt-2 text-xs text-gray-400">
                        {announcement.date}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollingAnnouncements>
        </div>

        {/* Experiment Collections */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="flex justify-between items-center px-6 py-4 border-b-2 border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-medium text-gray-800 dark:text-white">
              Experiment Collections
            </h2>
            <Link
              to="/collections"
              className="text-blue-500 flex items-center font-medium text-base"
            >
              SEE ALL <Icon icon="mdi:arrow-right" className="ml-1" />
            </Link>
          </div>

          <div className="p-6 grid grid-cols-2 gap-4">
            {experimentCollectionsWithImages.length > 0 ? (
              experimentCollectionsWithImages.map((collection) => (
                <div key={collection.id} className="group">
                  <Link
                    to={`/collections/${collection.id}`}
                    className="block bg-gray-50 dark:bg-gray-750 rounded-xl p-5 h-full"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                          {collection.title}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                          {collection.experimentIds.length} experiments
                        </p>
                      </div>
                      <Icon
                        icon="mdi:arrow-right"
                        className="text-2xl text-gray-400"
                      />
                    </div>

                    {collection.images.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        {collection.images.map((img, index) => (
                          <img
                            key={index}
                            src={img}
                            alt=""
                            className="rounded-md w-full h-20 object-cover"
                          />
                        ))}
                      </div>
                    )}
                  </Link>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-8">
                <Icon
                  icon="mdi:folder-open-outline"
                  className="text-4xl text-gray-400 mx-auto mb-2"
                />
                <p className="text-gray-500 dark:text-gray-400">
                  No collections yet. Bookmark experiments to create
                  collections.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Two column layout for Departments and Continue Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Departments */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="flex justify-between items-center px-6 py-4 border-b-2 border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-800 dark:text-white">
              Departments
            </h2>
            <div className="relative flex items-center justify-end">
              <div className="absolute -left-2 flex items-center justify-center h-full pl-3">
                <div className="p-2 rounded-xl border-2 border-gray-300 dark:border-gray-600">
                  <Icon icon="mdi:magnify" className="text-gray-900" />
                </div>
              </div>
              <input
                type="text"
                placeholder="Search"
                value={departmentSearch}
                onChange={(e) => setDepartmentSearch(e.target.value)}
                className="pl-12 pr-4 py-2 bg-white dark:bg-gray-800 border-none focus:border-b-2 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            {filteredDepartments.map((dept) => (
              <Link
                key={dept.id}
                to={`/departments/${dept.id}`}
                className="flex items-center justify-between px-6 py-5 hover:bg-gray-50 dark:hover:bg-gray-700 border-b-2 border-gray-200 dark:border-gray-700 last:border-b-0"
              >
                <div className="text-gray-800 dark:text-white">{dept.name}</div>
                <div className="flex items-center">
                  <span className="text-gray-500 dark:text-gray-400 mr-6">
                    {dept.labCount} Labs
                  </span>
                  <Icon
                    icon="mdi:arrow-right"
                    className="text-xl text-gray-400"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Continue Progress */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b-2 border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-800 dark:text-white">
              Continue Progress
            </h2>
          </div>
          <div className="p-6 space-y-6">
            {inProgressExperiments.length > 0 ? (
              inProgressExperiments.map((experiment) => (
                <div key={experiment.id} className="space-y-2">
                  <h3 className="font-medium text-gray-800 dark:text-white">
                    {experiment.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {experiment.department}
                  </p>
                  <div className="mt-2">
                    <div className="flex justify-between items-center">
                      <div className="w-full max-w-md bg-gray-200 dark:bg-gray-700 h-10 rounded-md overflow-hidden flex items-center">
                        <div
                          className={`h-full flex items-center pl-3 ${
                            experiment.progress >= 50
                              ? "bg-blue-500"
                              : "bg-red-400"
                          }`}
                          style={{ width: `${experiment.progress}%` }}
                        >
                          {experiment.progress > 30 && (
                            <div className="text-white text-sm font-medium pr-2">
                              {experiment.progress}% COMPLETED
                            </div>
                          )}
                        </div>

                        {experiment.progress <= 30 && (
                          <div className="text-gray-700 dark:text-gray-200 text-sm font-medium pl-2">
                            {experiment.progress}% COMPLETED
                          </div>
                        )}
                      </div>
                      <Link
                        to={`/departments/${
                          experiment.departmentId || 0
                        }/labs/${experiment.labId}/experiments/${
                          experiment.id
                        }`}
                        className={`ml-4 p-2 rounded-full ${
                          experiment.progress >= 70
                            ? "bg-blue-100 text-blue-500"
                            : "bg-red-100 text-red-500"
                        }`}
                      >
                        <Icon icon="mdi:arrow-right" className="text-xl" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Icon
                  icon="mdi:flask-empty-outline"
                  className="text-5xl text-gray-400 mx-auto mb-3"
                />
                <p className="text-gray-600 dark:text-gray-400">
                  You don't have any experiments in progress.
                </p>
                <Link
                  to="/departments/1"
                  className="mt-4 inline-block text-blue-500 hover:underline"
                >
                  Start exploring experiments
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

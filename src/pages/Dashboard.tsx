import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { createDepartmentSlug } from "../utils/routes";
import {
  announcements,
  experimentCollections,
  departments,
  inProgressExperiments,
} from "../data/mockData";

const Dashboard = () => {
  const [departmentSearch, setDepartmentSearch] = useState("");

  const filteredDepartments = departments.filter((dept) =>
    dept.name.toLowerCase().includes(departmentSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-medium text-gray-800 dark:text-white">
          Virtual Labs Learning Portal
        </h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for experiments, laboratories etc"
              className="pl-10 pr-4 py-2 w-72 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            />
            <Icon
              icon="mdi:magnify"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-600 dark:text-gray-300">Course</span>
            <div className="flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md px-3 py-1.5">
              <span className="text-gray-800 dark:text-white font-medium">
                B.tech
              </span>
              <Icon icon="mdi:chevron-down" className="ml-2 text-gray-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Announcements and Experiment Collections side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Announcements */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="flex justify-between items-center px-6 py-4 border-b-2 border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-800 dark:text-white">
              Announcements
            </h2>
            <Link
              to="#"
              className="text-blue-500 flex items-center font-semibold text-sm"
            >
              SEE ALL <Icon icon="mdi:arrow-right" className="ml-1" />
            </Link>
          </div>
          <div className="px-6 py-0">
            {announcements.map((announcement) => (
              <div
                key={announcement.id}
                className="py-6 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
              >
                <div
                  className="text-gray-900 dark:text-gray-300"
                  dangerouslySetInnerHTML={{ __html: announcement.content }}
                ></div>
              </div>
            ))}
          </div>
        </div>

        {/* Experiment Collections */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="flex justify-between items-center px-6 py-4 border-b-2 border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-medium text-gray-800 dark:text-white">
              Experiment Collections
            </h2>
            <Link
              to="#"
              className="text-blue-500 flex items-center font-medium text-base"
            >
              SEE ALL <Icon icon="mdi:arrow-right" className="ml-1" />
            </Link>
          </div>

          <div className="p-6 space-y-6">
            {experimentCollections.map((collection) => (
              <div key={collection.id} className="group">
                <Link
                  to={`/collections/${collection.id}`}
                  className="block bg-gray-50 dark:bg-gray-750 rounded-xl p-5"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h3 className="text-xl font-medium text-gray-800 dark:text-white">
                        {collection.title}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mt-1">
                        {collection.department}
                      </p>
                    </div>
                    <Icon
                      icon="mdi:arrow-right"
                      className="text-2xl text-gray-400"
                    />
                  </div>

                  {collection.images.length > 0 && (
                    <div className="mt-4 grid grid-cols-4 gap-3">
                      {collection.images.map((img, index) => (
                        <img
                          key={index}
                          src={img}
                          alt=""
                          className="rounded-md w-full h-24 object-cover"
                        />
                      ))}
                    </div>
                  )}
                </Link>
              </div>
            ))}
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
                className="pl-12 pr-4 py-2 rounded-lg bg-white dark:bg-gray-800 border-none focus:border-b-2 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            {departments.map((dept, index) => (
              <Link
                key={dept.id}
                to={`/departments/${createDepartmentSlug(
                  dept.name,
                  dept.institution
                )}`}
                className="flex items-center justify-between px-6 py-5 hover:bg-gray-50 dark:hover:bg-gray-700 border-b-2 border-gray-200 dark:border-gray-700 last:border-b-0"
              >
                <div className=" text-gray-800 dark:text-white">
                  {dept.name}
                </div>
                <div className="flex items-center">
                  <span className="text-gray-500 dark:text-gray-400 mr-6">
                    {dept.labCount.toString().padStart(2, "0")} Labs
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
            {inProgressExperiments.map((experiment) => (
              <div key={experiment.id} className="space-y-2">
                <h3 className="font-medium text-gray-800 dark:text-white">
                  {experiment.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {experiment.department}
                </p>
                <div className="mt-2">
                  <div className="flex justify-between items-center">
                    <div className="w-full max-w-md bg-gray-200 dark:bg-gray-700 h-10 rounded-md overflow-hidden flex items-center">
                      <div
                        className={`h-full flex items-center justify-end pr-2 ${
                          experiment.progress >= 70
                            ? "bg-blue-500"
                            : "bg-red-400"
                        }`}
                        style={{ width: `${experiment.progress}%` }}
                      >
                        <div className="text-white text-sm font-medium">
                          {experiment.progress}% COMPLETED
                        </div>
                      </div>
                    </div>
                    <Link
                      to={`/experiments/${experiment.id}`}
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

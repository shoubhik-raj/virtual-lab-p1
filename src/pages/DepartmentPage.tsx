import { useParams, Link } from "react-router-dom";
import { useData } from "../contexts/DataContext";
import { Icon } from "@iconify/react";
import { useState } from "react";

const DepartmentPage = () => {
  const { departmentId } = useParams<{ departmentId: string }>();
  const deptId = parseInt(departmentId || "0", 10);

  const { getDepartmentById, getLabsByDepartment } = useData();
  const [searchQuery, setSearchQuery] = useState("");

  const department = getDepartmentById(deptId);
  const labs = getLabsByDepartment(deptId);

  const filteredLabs = labs.filter((lab) =>
    lab.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!department) {
    return <div>Department not found</div>;
  }

  return (
    <div className="min-h-screen bg-white p-4 px-6">
      {/* Header */}
      <div className="py-6 px-8 flex items-center justify-between border-b border-gray-200">
        <h1 className="text-xl font-medium text-gray-800">{department.name}</h1>

        <div className="relative mx-auto">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Icon icon="mdi:magnify" className="text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Search for experiments, laboratories etc"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-[500px] rounded-md bg-gray-100 border-none focus:outline-none"
          />
        </div>

        <div className="flex items-center">
          <span className="mr-2 text-gray-700">Course</span>
          <div className="flex items-center font-medium">
            B.tech
            <Icon icon="mdi:chevron-down" className="ml-1 text-gray-700" />
          </div>
        </div>
      </div>

      {/* Lab List */}
      <div className="mx-auto">
        <div className="rounded-lg overflow-hidden border border-gray-200">
          {filteredLabs.map((lab) => (
            <Link
              key={lab.id}
              to={`/departments/${deptId}/labs/${lab.id}`}
              className="block border-b border-gray-200 last:border-b-0"
            >
              <div className="flex justify-between items-center p-6 hover:bg-gray-50 transition duration-150">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-800">
                    {lab.name}
                  </h3>
                </div>

                <div className="flex items-center justify-center flex-1">
                  <img
                    src={lab.institutionLogo}
                    alt={lab.institution}
                    className="w-10 h-10 rounded-full object-contain"
                  />
                  <span className="ml-3 text-gray-700">{lab.institution}</span>
                </div>

                <div className="flex items-center justify-end flex-1">
                  <span className="text-gray-700 mr-2">
                    {String(lab.experimentCount).padStart(2, "0")} Experiments
                  </span>
                  <span className="text-gray-400">——→</span>
                </div>
              </div>
            </Link>
          ))}

          {filteredLabs.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              No labs found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepartmentPage;

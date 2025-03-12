import React, { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useData } from "../contexts/DataContext";
import { Icon } from "@iconify/react";

// Star Rating Component
const StarRating = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex">
      {[...Array(fullStars)].map((_, i) => (
        <Icon
          key={`full-${i}`}
          icon="mdi:star"
          className="w-6 h-6 text-amber-400"
        />
      ))}

      {hasHalfStar && (
        <Icon icon="mdi:star-half-full" className="w-6 h-6 text-amber-400" />
      )}

      {[...Array(emptyStars)].map((_, i) => (
        <Icon
          key={`empty-${i}`}
          icon="mdi:star-outline"
          className="w-6 h-6 text-amber-400"
        />
      ))}
    </div>
  );
};

const LabPage = () => {
  const { departmentId, labId } = useParams<{
    departmentId: string;
    labId: string;
  }>();

  const deptId = parseInt(departmentId || "0", 10);
  const labIdString = labId || "";

  const { getLabById, getDepartmentById, getExperimentsByLab, userProgress } =
    useData();
  const [activeSection, setActiveSection] = useState("overview");
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isDescriptionLong, setIsDescriptionLong] = useState(false);

  const lab = getLabById(labIdString);
  const department = getDepartmentById(deptId);
  const experiments = getExperimentsByLab(labIdString);

  // Create refs for each section
  const descriptionRef = useRef<HTMLDivElement>(null);
  const overviewRef = useRef<HTMLDivElement>(null);
  const experimentsRef = useRef<HTMLDivElement>(null);
  const audienceRef = useRef<HTMLDivElement>(null);
  const alignmentRef = useRef<HTMLDivElement>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (descriptionRef.current) {
      setIsDescriptionLong(descriptionRef.current.scrollHeight > 200);
    }
  }, [lab?.description]);

  // Function to scroll to a section
  const scrollToSection = (
    ref: React.RefObject<HTMLDivElement>,
    section: string
  ) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
      setActiveSection(section);
    }
  };

  // Set up intersection observer to detect which section is in view
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "-100px 0px -70% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          setActiveSection(id);
        }
      });
    }, options);

    // Observe all section refs
    if (overviewRef.current) {
      overviewRef.current.id = "overview";
      observer.observe(overviewRef.current);
    }
    if (experimentsRef.current) {
      experimentsRef.current.id = "experiments";
      observer.observe(experimentsRef.current);
    }
    if (audienceRef.current) {
      audienceRef.current.id = "audience";
      observer.observe(audienceRef.current);
    }
    if (alignmentRef.current) {
      alignmentRef.current.id = "alignment";
      observer.observe(alignmentRef.current);
    }
    if (feedbackRef.current) {
      feedbackRef.current.id = "feedback";
      observer.observe(feedbackRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  if (!lab || !department) {
    return <div>Lab or Department not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto pb-12 p-12">
      {/* Header Section */}
      <div className="mb-8">
        <div className="text-sm text-gray-700 mb-2">
          <Link
            to={`/departments/${deptId}`}
            className="hover:underline flex items-center"
          >
            <Icon icon="mdi:arrow-left" className="mr-1" />
            {department.name}
          </Link>
        </div>
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline">
            <h1 className="text-3xl font-bold text-gray-900 mb-6 mr-6">
              {lab.name}
            </h1>

            <div className="flex items-center mb-8 p-4 px-5 border-2 border-gray-300 rounded-2xl">
              <Icon
                icon="mdi:building"
                className="h-5 w-5 text-blue-400 mr-2"
              />
              <span className="text-gray-700 font-medium">
                {lab.institution}
              </span>
            </div>
          </div>

          {/* Star Rating */}
          <StarRating rating={lab.rating || 3.5} />
        </div>
      </div>

      {/* Navigation Bar - Fixed at the top when scrolling */}
      <div className="sticky top-0 z-50 bg-white border-b-2 border-gray-200 mb-8">
        <div className="flex overflow-x-auto items-center">
          <button
            onClick={() => scrollToSection(overviewRef, "overview")}
            className={`py-4 px-6 font-medium whitespace-nowrap ${
              activeSection === "overview"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => scrollToSection(experimentsRef, "experiments")}
            className={`py-4 px-6 font-medium whitespace-nowrap ${
              activeSection === "experiments"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            List of Experiments
          </button>
          <button
            onClick={() => scrollToSection(audienceRef, "audience")}
            className={`py-4 px-6 font-medium whitespace-nowrap ${
              activeSection === "audience"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Target Audience
          </button>
          <button
            onClick={() => scrollToSection(alignmentRef, "alignment")}
            className={`py-4 px-6 font-medium whitespace-nowrap ${
              activeSection === "alignment"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Course Alignment
          </button>
          <button
            onClick={() => scrollToSection(feedbackRef, "feedback")}
            className={`py-4 px-6 font-medium whitespace-nowrap ${
              activeSection === "feedback"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Feedback
          </button>

          {/* Search Box */}
          <div className="ml-auto relative">
            <div className="h-[40px] absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon icon="mdi:magnify" className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 focus:outline-none focus:border-b-2 focus:border-blue-300"
              style={{ height: "40px" }}
            />
          </div>
        </div>
      </div>

      {/* Overview Section */}
      <div ref={overviewRef} className="mb-12 scroll-mt-16">
        <div className="mb-6">
          <div className="inline-flex items-center bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
            <div className="p-5 flex items-center justify-center border-r-2 border-gray-200">
              <Icon icon="mdi:flask" className="h-5 w-5 text-gray-700" />
            </div>
            <div className="px-6 py-5 pr-24">
              <h2 className="text-md font-medium text-gray-800">
                Lab Overview
              </h2>
            </div>
          </div>
        </div>

        <div className="bg-white py-4">
          <div
            ref={descriptionRef}
            className={`prose max-w-none text-gray-600 ${
              !showFullDescription && isDescriptionLong
                ? "max-h-[200px] overflow-hidden relative"
                : ""
            }`}
            dangerouslySetInnerHTML={{ __html: lab.description || "" }}
          />

          {isDescriptionLong && (
            <div className={!showFullDescription ? "mt-4 relative" : "mt-4"}>
              {!showFullDescription && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"
                  style={{ bottom: "20px" }}
                ></div>
              )}
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="text-blue-500 hover:text-blue-700 font-medium flex items-center relative z-10"
              >
                {showFullDescription ? "Show Less" : "Read More"}
                <Icon
                  icon="mdi:chevron-down"
                  className={`ml-1 transition-transform ${
                    showFullDescription ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Experiments Section */}
      <div ref={experimentsRef} className="mb-16 scroll-mt-16">
        <div className="mb-6">
          <div className="inline-flex items-center bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
            <div className="p-5 flex items-center justify-center border-r-2 border-gray-200">
              <Icon icon="mdi:flask" className="h-5 w-5 text-gray-700" />
            </div>
            <div className="px-6 py-5 pr-24">
              <h2 className="text-md font-medium text-gray-800">
                List of Experiments
              </h2>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {experiments && experiments.length > 0 ? (
            experiments.map((experiment) => (
              <Link
                key={experiment.id}
                to={`/departments/${deptId}/labs/${labIdString}/experiments/${experiment.id}`}
                className="p-3 bg-white rounded-xl overflow-hidden border-2 border-gray-200 hover:scale-[99%] transition-transform"
              >
                {experiment.thumbnail && (
                  <img
                    src={experiment.thumbnail}
                    alt={experiment.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                )}
                <div className="py-4 px-2">
                  <h3 className="font-medium text-gray-900 text-lg">
                    {experiment.name}
                  </h3>
                  <p
                    className="text-sm text-gray-600 mt-2 line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: experiment.aim }}
                  ></p>

                  {userProgress[experiment.id] > 0 && (
                    <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full"
                        style={{ width: `${userProgress[experiment.id]}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-3 text-center py-12 text-gray-500">
              No experiments found for this lab.
            </div>
          )}
        </div>
      </div>

      {/* Target Audience Section */}
      <div ref={audienceRef} className="mb-16 scroll-mt-16">
        <div className="mb-0">
          <div className="inline-flex items-center bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
            <div className="p-5 flex items-center justify-center border-r-2 border-gray-200">
              <Icon
                icon="mdi:account-group"
                className="h-5 w-5 text-gray-700"
              />
            </div>
            <div className="px-6 py-5 pr-24">
              <h2 className="text-md font-medium text-gray-800">
                Target Audience
              </h2>
            </div>
          </div>
        </div>

        <div className="bg-white py-4">
          <div className="prose max-w-none text-gray-500">
            {lab.targetAudience ||
              "Information about target audience not available."}
          </div>
        </div>
      </div>

      {/* Course Alignment Section */}
      <div ref={alignmentRef} className="mb-16 scroll-mt-16">
        <div className="mb-0">
          <div className="inline-flex items-center bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
            <div className="p-5 flex items-center justify-center border-r-2 border-gray-200">
              <Icon
                icon="mdi:book-open-variant"
                className="h-5 w-5 text-gray-700"
              />
            </div>
            <div className="px-6 py-5 pr-24">
              <h2 className="text-md font-medium text-gray-800">
                Course Alignment
              </h2>
            </div>
          </div>
        </div>

        <div className="bg-white py-4">
          <div className="prose max-w-none text-gray-500">
            {lab.courseAlignment ||
              "Information about course alignment not available."}
          </div>
        </div>
      </div>

      {/* Feedback Section */}
      <div ref={feedbackRef} className="scroll-mt-16">
        <div className="mb-0">
          <div className="inline-flex items-center bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
            <div className="p-5 flex items-center justify-center border-r-2 border-gray-200">
              <Icon icon="mdi:flask" className="h-5 w-5 text-gray-700" />
            </div>
            <div className="px-6 py-5 pr-24">
              <h2 className="text-md font-medium text-gray-800">Feedback</h2>
            </div>
          </div>
        </div>

        <div className="bg-white py-4">
          <p className="text-gray-600 mb-4">
            Dear User, Thanks for using Virtual Labs. Your opinion is valuable
            to us. To help us improve, we'd like to ask you a few questions
            about your experience. It will only take 3 minutes and your answers
            will help us make Virtual Labs better for you and other users.
          </p>

          <Link
            to={`/departments/${deptId}/labs/${labIdString}/feedback`}
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            <Icon icon="mdi:message-square" className="h-4 w-4 mr-2" />
            Provide Feedback
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LabPage;

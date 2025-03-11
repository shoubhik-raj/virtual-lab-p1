import { Icon } from "@iconify/react";

interface Partner {
  id: number;
  name: string;
  logo: string;
  description: string;
  website: string;
  category: "institution" | "industry" | "government";
}

const PartnersPage = () => {
  const partners: Partner[] = [
    {
      id: 1,
      name: "Indian Institute of Technology, Delhi",
      logo: "iit-delhi",
      description:
        "A premier engineering institution contributing to the development of cutting-edge virtual labs.",
      website: "https://www.iitd.ac.in",
      category: "institution",
    },
    {
      id: 2,
      name: "Indian Institute of Technology, Bombay",
      logo: "iit-bombay",
      description:
        "Provides expertise in designing and implementing virtual lab simulations for engineering education.",
      website: "https://www.iitb.ac.in",
      category: "institution",
    },
    {
      id: 3,
      name: "Ministry of Education, Government of India",
      logo: "ministry-of-education",
      description:
        "Supports the development of virtual labs as part of the National Mission on Education through ICT.",
      website: "https://www.education.gov.in",
      category: "government",
    },
    {
      id: 4,
      name: "Tata Consultancy Services",
      logo: "tcs",
      description:
        "Industry partner providing technical expertise and infrastructure support for virtual lab platforms.",
      website: "https://www.tcs.com",
      category: "industry",
    },
    {
      id: 5,
      name: "National Institute of Technology, Surathkal",
      logo: "nit-surathkal",
      description:
        "Contributes to the development of virtual labs in mechanical and civil engineering domains.",
      website: "https://www.nitk.ac.in",
      category: "institution",
    },
    {
      id: 6,
      name: "Siemens India",
      logo: "siemens",
      description:
        "Industry partner providing simulation tools and expertise for industrial automation virtual labs.",
      website: "https://www.siemens.com/in",
      category: "industry",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
        Our Partners
      </h1>
      <p className="text-gray-600 dark:text-gray-300 max-w-3xl">
        The Virtual Lab Portal is a collaborative initiative between academic
        institutions, industry partners, and government organizations. Together,
        we aim to provide high-quality virtual laboratory experiences for
        students across the country.
      </p>

      {/* Filter tabs */}
      <div className="flex flex-wrap space-x-2 mb-6">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg mb-2">
          All Partners
        </button>
        <button className="px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 mb-2">
          Institutions
        </button>
        <button className="px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 mb-2">
          Industry
        </button>
        <button className="px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 mb-2">
          Government
        </button>
      </div>

      {/* Partners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {partners.map((partner) => (
          <div
            key={partner.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
          >
            <div className="h-32 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              {/* In a real app, you'd use actual logo images */}
              <Icon
                icon={`mdi:${
                  partner.category === "institution"
                    ? "school"
                    : partner.category === "industry"
                    ? "office-building"
                    : "government"
                }`}
                className="text-6xl text-gray-400"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                {partner.name}
              </h3>
              <p className="text-sm text-blue-600 dark:text-blue-400 mb-4">
                {partner.category === "institution"
                  ? "Academic Institution"
                  : partner.category === "industry"
                  ? "Industry Partner"
                  : "Government Organization"}
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {partner.description}
              </p>
              <a
                href={partner.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline flex items-center"
              >
                Visit Website <Icon icon="mdi:open-in-new" className="ml-1" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-6 mt-8">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          Interested in Partnering with Us?
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          We're always looking for new partners to help expand our virtual lab
          offerings. If your institution or organization is interested in
          contributing, please get in touch!
        </p>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Contact Us About Partnership
        </button>
      </div>
    </div>
  );
};

export default PartnersPage;

import React from 'react';
import { ExternalLink, MapPin, Award, Users } from 'lucide-react';

interface Partner {
  id: number;
  name: string;
  type: string;
  location: string;
  description: string;
  image: string;
  website: string;
}

const partners: Partner[] = [
  {
    id: 1,
    name: "Indian Institute of Technology Delhi",
    type: "Nodal Center",
    location: "New Delhi, India",
    description: "Leading research institution focusing on engineering education and technological innovation.",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=400&h=300",
    website: "https://iitd.ac.in"
  },
  {
    id: 2,
    name: "Indian Institute of Technology Bombay",
    type: "Research Partner",
    location: "Mumbai, India",
    description: "Premier engineering institution known for cutting-edge research and development.",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=400&h=300",
    website: "https://iitb.ac.in"
  },
  {
    id: 3,
    name: "National Institute of Technology Tiruchirappalli",
    type: "Outreach Center",
    location: "Tiruchirappalli, India",
    description: "Leading institution in technical education, research, and innovation.",
    image: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&q=80&w=400&h=300",
    website: "https://nitt.edu"
  }
];

export default function Partners() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Our Partners</h1>
        <p className="mt-2 text-gray-600">
          Collaborating with leading institutions across India to provide quality virtual laboratory education.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8">
        {partners.map((partner) => (
          <div
            key={partner.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="md:flex">
              <div className="md:flex-shrink-0">
                <img
                  className="h-48 w-full md:w-64 object-cover"
                  src={partner.image}
                  alt={partner.name}
                />
              </div>
              <div className="p-8 flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{partner.name}</h2>
                    <div className="mt-2 flex items-center text-sm text-gray-600">
                      <Award className="h-4 w-4 mr-2" />
                      <span>{partner.type}</span>
                    </div>
                    <div className="mt-1 flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{partner.location}</span>
                    </div>
                  </div>
                  <a
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <ExternalLink className="h-5 w-5 mr-1" />
                    <span>Visit Website</span>
                  </a>
                </div>
                <p className="mt-4 text-gray-600">{partner.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-blue-50 rounded-xl p-8">
        <div className="flex items-center space-x-4 mb-6">
          <Users className="h-8 w-8 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Become a Partner</h2>
        </div>
        <p className="text-gray-600 mb-6">
          Join our network of educational institutions and contribute to the advancement of virtual laboratory education in India.
          We welcome partnerships with institutions that share our vision of quality technical education.
        </p>
        <a
          href="/contact"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Contact Us for Partnership
        </a>
      </div>
    </div>
  );
}
import { useState } from "react";
import { Icon } from "@iconify/react";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this data to a backend
    console.log("Form submitted:", formData);
    alert("Your message has been sent! We'll get back to you soon.");
    // Reset form
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
        Contact Us
      </h1>
      <p className="text-gray-600 dark:text-gray-300 max-w-3xl">
        Have questions about our Virtual Lab Portal? Get in touch with our team
        and we'll be happy to help!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Information */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Contact Information
            </h2>

            <div className="space-y-4">
              <div className="flex items-start">
                <Icon
                  icon="mdi:email"
                  className="text-blue-600 text-xl mt-1 mr-3"
                />
                <div>
                  <h3 className="text-sm font-medium text-gray-800 dark:text-white">
                    Email
                  </h3>
                  <a
                    href="mailto:support@virtuallabs.edu"
                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600"
                  >
                    support@virtuallabs.edu
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <Icon
                  icon="mdi:phone"
                  className="text-blue-600 text-xl mt-1 mr-3"
                />
                <div>
                  <h3 className="text-sm font-medium text-gray-800 dark:text-white">
                    Phone
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    +91-1234567890
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Icon
                  icon="mdi:map-marker"
                  className="text-blue-600 text-xl mt-1 mr-3"
                />
                <div>
                  <h3 className="text-sm font-medium text-gray-800 dark:text-white">
                    Address
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Virtual Labs Project,
                    <br />
                    Department of Computer Science,
                    <br />
                    IIT Delhi, Hauz Khas,
                    <br />
                    New Delhi - 110016
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Follow Us
            </h2>
            <div className="flex space-x-4">
              <a
                href="#"
                className="bg-gray-100 dark:bg-gray-700 rounded-full p-3 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition"
              >
                <Icon icon="mdi:twitter" className="text-blue-600 text-xl" />
              </a>
              <a
                href="#"
                className="bg-gray-100 dark:bg-gray-700 rounded-full p-3 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition"
              >
                <Icon icon="mdi:facebook" className="text-blue-600 text-xl" />
              </a>
              <a
                href="#"
                className="bg-gray-100 dark:bg-gray-700 rounded-full p-3 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition"
              >
                <Icon icon="mdi:linkedin" className="text-blue-600 text-xl" />
              </a>
              <a
                href="#"
                className="bg-gray-100 dark:bg-gray-700 rounded-full p-3 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition"
              >
                <Icon icon="mdi:youtube" className="text-blue-600 text-xl" />
              </a>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Send Us a Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="john.doe@example.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a subject</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="Feedback">Feedback</option>
                  <option value="Partnership">Partnership</option>
                  <option value="General Inquiry">General Inquiry</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your message here..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center"
              >
                <Icon icon="mdi:send" className="mr-2" />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
              Do I need to create an account to use the Virtual Lab Portal?
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              No, you can access and use most of the virtual labs without
              creating an account. However, creating an account allows you to
              save your progress, bookmark experiments, and create lab notes.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
              Are the virtual labs accessible on mobile devices?
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Yes, our Virtual Lab Portal is designed to be responsive and works
              on desktops, tablets, and mobile phones. However, for the best
              experience, we recommend using a desktop or laptop computer for
              complex simulations.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
              How can my institution partner with the Virtual Lab Portal?
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              If your institution is interested in contributing to the Virtual
              Lab Portal or becoming a partner, please use the contact form
              above or email us directly at partnerships@virtuallabs.edu for
              more information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

import { useEffect, useRef } from "react";

import { useNavigation } from "react-router";

const ContactPage = () => {
  const navigation = useNavigation();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (navigation.state === "idle") {
      formRef.current?.reset();
    }
  }, [navigation]);

  return (
    <div className="max-w-3xl mx-auto mt-12 px-6 py-8 bg-gray-900">
      <h2 className="text-3xl font-bold text-white mb-8 text-center">
        📫 Contact Me
      </h2>

      <form
        action="https://formspree.io/f/mojvppgn"
        method="post"
        className="space-y-6"
        ref={formRef}
      >
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-300"
          >
            Full Name
            <input
              id="name"
              name="name"
              type="text"
              className="w-full mt-1 px-4 py-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-100"
            />
          </label>
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-300"
          >
            Email
            <input
              id="email"
              name="email"
              type="text"
              className="w-full mt-1 px-4 py-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-100"
            />
          </label>
        </div>
        <div>
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-gray-300"
          >
            Subject
            <input
              id="subject"
              name="subject"
              type="text"
              className="w-full mt-1 px-4 py-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-100"
            />
          </label>
        </div>
        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-300"
          >
            Message
            <textarea
              id="message"
              name="message"
              className="w-full mt-1 px-4 py-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-100"
            />
          </label>
        </div>
        <button className="px-4 transition  bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg coursor-pointer ml-auto block">
          Send message
        </button>
      </form>
    </div>
  );
};

export default ContactPage;

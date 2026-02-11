import React from "react";

const AboutPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16 bg-gray-900">
      {/* Intro */}
      <div className="flex flex-col md:flex-row md:items-start items-center gap-10 mb-12">
        <img
          src="/images/profile.jpg"
          alt="profile"
          className="w-40 h-40 rounded-full object-cover border-4 border-blue-500 shadow-md object-[0%+30%]"
        />
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Hey, I'm Jarek 👋
          </h1>
          <p className="text-gray-300 text-lg">
            I'm a passionate web developer who loves building user-friendly
            digital experiences.
          </p>
        </div>
      </div>

      {/* Tech Stack */}
      <h2 className="text-2xl font-semibold text-white mb-4">🚀 Tech I Use</h2>
      <ul className="flex flex-wrap gap-4 text-sm text-gray-300">
        {[
          "HTML",
          "CSS",
          "JavaScript",
          "TypeScript",
          "React.js",
          "Next.js",
          "Tanstack Query",
          "React Router (Framework, Data and Declarative Modes)",
          "Tailwind CSS",
          "Shadcn",
          "Sass",
          "Bootstrap",
          "React Bootstrap",
          "GSAP",
          "Formik",
          "React Hook Form",
          "Node.js",
          "Express.js",
          "Postman",
          "Strapi",
          "Supertest",
          "JEST",
          "React Testing Library",
          "Cypress",
          "MongoDB",
          "Mongoose",
          "MySQL",
          "PostgreSQL",
          "Sequelize",
          "Prisma",
          "Better-sqlite3",
          "Auth.js",
          "Docker",
          "VPS (Ubuntu)",
          "Servers (Caddy, Apache)",
          "AWS",
          "Git",
          "GitHub",
          "GitHub Copilot",
          "Cursor",
          "VS Code",
        ].map((tech) => (
          <li key={tech} className="bg-gray-700 px-3 py-1 rounded-md">
            {tech}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AboutPage;

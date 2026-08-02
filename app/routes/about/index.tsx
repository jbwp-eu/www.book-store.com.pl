import type { Route } from "./+types";
import { pageTitle, SITE_DESCRIPTION } from "~/lib/site";

export function meta({}: Route.MetaArgs) {
  return [
    { title: pageTitle("About") },
    { name: "description", content: SITE_DESCRIPTION },
  ];
}

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
            Hey, I'm Jarek <span aria-hidden="true">👋</span>
          </h1>
          <p className="text-gray-300 text-lg">
            I'm a full-stack developer focused on e-commerce: storefronts,
            REST and GraphQL APIs, Strapi CMS, and deploying shop stacks to the
            cloud.
          </p>
        </div>
      </div>

      {/* Tech Stack */}
      <h2 className="text-2xl font-semibold text-white mb-4">
        <span aria-hidden="true">🚀 </span>Tech I Use
      </h2>
      <ul className="flex flex-wrap gap-4 text-sm text-gray-300">
        {[
          "HTML",
          "CSS",
          "JavaScript",
          "TypeScript",
          "React.js",
          "Next.js",
          "Vite",
          "React Router (Framework, Data and Declarative Modes)",
          "TanStack Query",
          "Tailwind CSS",
          "Material UI",
          "Sass",
          "Shadcn",
          "Bootstrap",
          "React Bootstrap",
          "GSAP",
          "Framer Motion",
          "Google Maps",
          "Recharts",
          "i18n",
          "Formik",
          "Yup",
          "React Hook Form",
          "Zod",
          "Redux Toolkit",
          "Node.js",
          "REST API",
          "GraphQL API",
          "Socket.IO",
          "Postman",
          "Express.js",
          "NestJS",
          "Strapi",
          "Multer",
          "UploadThing",
          "Cloudinary",
          "Nodemailer",
          "Resend",
          "Cypress",
          "React Testing Library",
          "Vitest",
          "Jest",
          "SuperTest",
          "MongoDB",
          "Mongoose",
          "MySQL",
          "PostgreSQL",
          "SQLite",
          "Sequelize",
          "TypeORM",
          "Prisma",
          "JWT",
          "Auth.js",
          "Stripe",
          "PayPal",
          "Docker",
          "AWS (EC2, S3, CloudFront, Lambda + SQS, Route 53)",
          "OVH (VPS)",
          "Caddy, Nginx",
          "Systemd",
          "Git",
          "GitHub",
          "CI/CD (GitHub Actions)",
          "VS Code",
          "Copilot",
          "Cursor",
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

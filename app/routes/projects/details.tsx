import type { Route } from "./+types/details";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import ReactMarkdown from "react-markdown";
import { getProjectById } from "~/lib/strapi";
import { formatDate } from "~/lib/date";
import { pageTitle } from "~/lib/site";

export function meta({ loaderData }: Route.MetaArgs) {
  if (!loaderData?.project) {
    return [{ title: pageTitle("Project") }];
  }
  const { project } = loaderData;
  const description =
    project.description.replace(/[#*_`]/g, "").slice(0, 160) ||
    "Project from My Portfolio.";

  return [
    { title: pageTitle(project.title) },
    { name: "description", content: description },
    { property: "og:title", content: project.title },
    { property: "og:description", content: description },
    { property: "og:image", content: project.image },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  const project = await getProjectById(params.id!);
  return { project };
}

const ProjectDetailsPage = ({ loaderData }: Route.ComponentProps) => {
  const { project } = loaderData;
  return (
    <>
      <Link
        to="/projects"
        className="flex items-center text-blue-400 hover:text-blue-500 mb-6 transition"
      >
        <ArrowLeft className="mr-2" /> Back To Projects
      </Link>
      <div className="grid gap-8 md:grid-cols-2 items-start">
        <div>
          <img
            src={project?.image ? `${project.image}` : "/images/no-image.png"}
            alt={project.title}
            className="w-52 mx-auto rounded-lg"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-blue-400 mb-4">
            {project.title}
          </h1>
          <p className="text-gray-500 text-sm mb-4">
            {formatDate(project.date)} {project.category}
          </p>
          <ReactMarkdown>{project.description}</ReactMarkdown>
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex gap-2 items-center text-white mt-6 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded transition"
          >
            View Live Site <ArrowRight />
          </a>
        </div>
      </div>
    </>
  );
};

export default ProjectDetailsPage;

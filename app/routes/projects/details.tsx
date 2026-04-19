import type { Route } from "./+types/details";
import type { Project, StrapiProject, StrapiResponse } from "~/types";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router";
import ReactMarkdown from "react-markdown";

const { VITE_API_URL } = import.meta.env;

export function meta({}: Route.MetaArgs) {
  return [
    { title: "My Portfolio | Project Details" },
    { name: "description", content: "My website project portfolio" },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  const { id } = params;
  const res = await fetch(
    `${VITE_API_URL}/projects?filters[documentId][$eq]=${id}&populate=*`,
  );

  if (!res.ok) throw new Response("Project not found", { status: 404 });

  const json: StrapiResponse<StrapiProject> = await res.json();

  const item = json.data[0];

  const project: Project = {
    id: item.documentId,
    title: item.title,
    description: item.description,
    image: item.image?.url ? `${item.image.url}` : "/images/no-image.png",
    url: item.url,
    date: item.date,
    category: item.category,
    featured: item.featured,
  };

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
        <FaArrowLeft className="mr-2" /> Back To Projects
      </Link>
      <div className="grid gap-8 md:grid-cols-2 items-start">
        <div>
          <img
            src={project?.image ? `${project.image}` : "/images/no-image.png"}
            alt={project.title}
            className="w-50 mx-auto rounded-lg"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-blue-400 mb-4">
            {project.title}
          </h1>
          <p className="text-gray-500 text-sm mb-4" suppressHydrationWarning>
            {new Date(project.date).toLocaleDateString()} {project.category}
          </p>
          <ReactMarkdown>{project.description}</ReactMarkdown>
          <a
            href={project.url}
            className="inline-flex gap-2 items-center text-white mt-6 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded transition"
          >
            View Live Site <FaArrowRight />
          </a>
        </div>
      </div>
    </>
  );
};

export default ProjectDetailsPage;

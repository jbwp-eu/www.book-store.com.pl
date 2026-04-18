import { Link } from "react-router";
import type { Project } from "~/types";

const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <Link
      className="block transform transition duration-300 hover:scale-[1.02]"
      to={`/projects/${project.id}`}
    >
      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-sm transition hover:shadow-md">
        <img
          src={project?.image ? `${project.image}` : "/images/no-image.png"}
          alt={project.title}
          className="w-full h-50 object-contain py-4 bg-white"
        />
        <div className="p-5">
          <h3 className="text-3xl font-semibold text-blue-400">
            {project.title}
          </h3>
          <div className="flex justify-between items-center text-sm text-gray-400">
            <span>{project.category}</span>
            <span suppressHydrationWarning>
              {new Date(project.date).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;

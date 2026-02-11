import type { Route } from "./+types/index";
import type { Project, StrapiProject, StrapiResponse } from "~/types";
import ProjectCard from "~/components/ProjectCard";
import { useState } from "react";
import Pagination from "~/components/Pagination";
import { AnimatePresence, motion } from "framer-motion";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "My Portfolio | Projects" },
    { name: "description", content: "My website project portfolio" },
  ];
}

const { VITE_API_URL } = import.meta.env;

export async function loader({
  request,
}: Route.LoaderArgs): Promise<{ projects: Project[] }> {
  const res = await fetch(`${VITE_API_URL}/projects?populate=*`);
  const json: StrapiResponse<StrapiProject> = await res.json();

  const projects = json.data.map((item) => ({
    id: item.documentId,
    title: item.title,
    description: item.description,
    image: item.image?.url ? `${item.image.url}` : "/images/no-image.png",
    url: item.url,
    date: item.date,
    category: item.category,
    featured: item.featured,
  }));

  return { projects };
}

const ProjectsPage = ({ loaderData }: Route.ComponentProps) => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);

  const projectsPerPage = 2;

  const { projects } = loaderData as { projects: Project[] };

  // Get unique categories
  const categories = [
    "All",
    ...new Set(projects.map((project) => project.category)),
  ];

  // Filter project based on the category

  const filteredProjects =
    selectedCategory === "All"
      ? projects
      : projects.filter((project) => project.category === selectedCategory);

  // Calculate total pages
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  const indexOfLast = currentPage * projectsPerPage;

  const indexOfFirst = indexOfLast - projectsPerPage;

  const currentProjects = filteredProjects.slice(indexOfFirst, indexOfLast);

  return (
    <>
      <h2 className="text-3xl text-black font-bold mb-6">🚀 Projects</h2>

      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            className={`py-1 px-3 bg-blue-400 text-sm cursor-pointer ${selectedCategory === category ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-200"} border rounded hover:scale-105 transition`}
            onClick={() => {
              setSelectedCategory(category);
              setCurrentPage(1);
            }}
          >
            {category}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div layout className="grid gap-6 sm:grid-cols-2">
          {currentProjects.map((project) => (
            <motion.div key={project.id} layout>
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      <Pagination
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        currentPage={currentPage}
      />
    </>
  );
};

export default ProjectsPage;

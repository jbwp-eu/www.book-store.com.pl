import type { Route } from "./+types/index";
import ProjectCard from "~/components/ProjectCard";
import Pagination from "~/components/Pagination";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router";
import { getProjectCategories, getProjectsPage } from "~/lib/strapi";
import { pageTitle } from "~/lib/site";

export function meta({}: Route.MetaArgs) {
  const description =
    "Selected projects — online stores, APIs, and full-stack commerce work.";
  return [
    { title: pageTitle("Projects") },
    { name: "description", content: description },
    { property: "og:title", content: pageTitle("Projects") },
    { property: "og:description", content: description },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const page = Math.max(1, Number(url.searchParams.get("page") ?? 1) || 1);
  const category = url.searchParams.get("category") ?? "All";

  const [categories, { projects, pageCount }] = await Promise.all([
    getProjectCategories(),
    getProjectsPage(page, 2, category),
  ]);

  return { projects, page, pageCount, category, categories };
}

const ProjectsPage = ({ loaderData }: Route.ComponentProps) => {
  const { projects, page, pageCount, category, categories } = loaderData;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  function updateParams(next: { page?: number; category?: string }) {
    const params = new URLSearchParams(searchParams);
    if (next.category !== undefined) {
      if (next.category === "All") params.delete("category");
      else params.set("category", next.category);
      params.delete("page");
    }
    if (next.page !== undefined) {
      params.set("page", String(next.page));
    }
    navigate(`?${params.toString()}`);
  }

  return (
    <>
      <h2 className="text-3xl text-white font-bold mb-6">
        <span aria-hidden="true">🚀 </span>Projects
      </h2>

      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`py-1 px-3 bg-blue-400 text-sm cursor-pointer ${category === cat ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-200"} border rounded hover:scale-105 transition`}
            onClick={() => updateParams({ category: cat })}
          >
            {cat}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div layout className="grid gap-6 sm:grid-cols-2">
          {projects.map((project) => (
            <motion.div key={project.id} layout>
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      <Pagination
        totalPages={pageCount}
        onPageChange={(next) => updateParams({ page: next })}
        currentPage={page}
      />
    </>
  );
};

export default ProjectsPage;

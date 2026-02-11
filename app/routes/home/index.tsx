import type {
  Project,
  StrapiPost,
  StrapiProject,
  StrapiResponse,
} from "~/types";
import type { Route } from "./+types/index";
import FeaturedProjects from "~/components/FeaturedProjects";
import AboutPreview from "~/components/AboutPreview";
import { type Post } from "~/types";
import LatestsPosts from "~/components/LatestsPosts";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "My Portfolio | Welcome" },
    { name: "description", content: "Custom website development" },
  ];
}

const { VITE_API_URL } = import.meta.env;

export async function loader({
  request,
}: Route.LoaderArgs): Promise<{ projects: Project[]; posts: Post[] }> {
  const url = new URL(request.url);

  const [projectRes, postRes] = await Promise.all([
    fetch(`${VITE_API_URL}/projects?filters[featured][$eq]=true&populate=*`),
    fetch(`${VITE_API_URL}/posts?sort[0]=date:desc&populate=*`),
  ]);

  if (!projectRes.ok || !postRes.ok) {
    throw new Error("Failed to fetch projects or posts");
  }

  const postJson: StrapiResponse<StrapiPost> = await postRes.json();

  const projectJson: StrapiResponse<StrapiProject> = await projectRes.json();

  const posts = postJson.data.map((item: StrapiPost) => ({
    id: item.documentId,
    title: item.title,
    slug: item.slug,
    excerpt: item.excerpt,
    date: item.date,
    body: item.body,
    image: item.image?.url ? `${item.image.url}` : "/images/no-image.png",
  }));

  const projects = projectJson.data.map((item: StrapiProject) => ({
    id: item.documentId,
    title: item.title,
    description: item.description,
    image: item.image?.url ? `${item.image.url}` : "/images/no-image.png",
    url: item.url,
    date: item.date,
    category: item.category,
    featured: item.featured,
  }));

  return { projects, posts };
}

export default function HomePage({ loaderData }: Route.ComponentProps) {
  const now = new Date().toISOString();

  const { projects, posts } = loaderData as {
    projects: Project[];
    posts: Post[];
  };

  return (
    <>
      <FeaturedProjects projects={projects} count={2} />
      <AboutPreview />
      <LatestsPosts posts={posts} limit={5} />
    </>
  );
}

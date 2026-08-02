import type { Route } from "./+types/index";
import FeaturedProjects from "~/components/FeaturedProjects";
import AboutPreview from "~/components/AboutPreview";
import LatestPosts from "~/components/LatestPosts";
import { getFeaturedProjects, getLatestPosts } from "~/lib/strapi";
import { pageTitle, SITE_DESCRIPTION } from "~/lib/site";

export function meta({}: Route.MetaArgs) {
  return [
    { title: pageTitle("Welcome") },
    { name: "description", content: SITE_DESCRIPTION },
  ];
}

export async function loader() {
  const [projects, posts] = await Promise.all([
    getFeaturedProjects(),
    getLatestPosts(5),
  ]);
  return { projects, posts };
}

export default function HomePage({ loaderData }: Route.ComponentProps) {
  const { projects, posts } = loaderData;

  return (
    <>
      <FeaturedProjects projects={projects} count={2} />
      <AboutPreview />
      <LatestPosts posts={posts} limit={5} />
    </>
  );
}

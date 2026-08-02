import type { Route } from "./+types";
import PostCard from "~/components/PostCard";
import Pagination from "~/components/Pagination";
import { useEffect, useState } from "react";
import PostFilter from "~/components/PostFilter";
import { useNavigate, useSearchParams } from "react-router";
import { getPostsPage } from "~/lib/strapi";
import { pageTitle } from "~/lib/site";

export function meta({}: Route.MetaArgs) {
  const description =
    "Notes on full-stack development, stores, APIs, and CMS.";
  return [
    { title: pageTitle("Blog") },
    { name: "description", content: description },
    { property: "og:title", content: pageTitle("Blog") },
    { property: "og:description", content: description },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const page = Math.max(1, Number(url.searchParams.get("page") ?? 1) || 1);
  const q = url.searchParams.get("q")?.trim() ?? "";
  const { posts, pageCount } = await getPostsPage(page, 2, q);
  return { posts, page, pageCount, q };
}

const BlogPage = ({ loaderData }: Route.ComponentProps) => {
  const { posts, page, pageCount, q } = loaderData;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(q);

  useEffect(() => {
    setSearchQuery(q);
  }, [q]);

  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (trimmed === q) return;

    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (trimmed) params.set("q", trimmed);
      else params.delete("q");
      params.delete("page");
      navigate(`?${params.toString()}`);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, q, navigate, searchParams]);

  return (
    <>
      <div className="max-w-3xl mx-auto mt-10 px-6 py-6 bg-gray-900">
        <h2 className="text-3xl text-white font-bold mb-4">
          <span aria-hidden="true">✏️ </span>Blog
        </h2>
        <PostFilter searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <div className="space-y-8">
          {posts.length === 0 ? (
            <p className="text-gray-400 text-center">No posts found</p>
          ) : (
            posts.map((post) => <PostCard key={post.slug} post={post} />)
          )}
        </div>
      </div>
      {pageCount > 1 && (
        <Pagination
          totalPages={pageCount}
          onPageChange={(next) => {
            const params = new URLSearchParams(searchParams);
            params.set("page", String(next));
            navigate(`?${params.toString()}`);
          }}
          currentPage={page}
        />
      )}
    </>
  );
};

export default BlogPage;

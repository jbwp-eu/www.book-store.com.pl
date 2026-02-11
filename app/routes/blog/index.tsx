import type { Route } from "./+types";
import { type Post, type StrapiPost, type StrapiResponse } from "~/types";
import PostCard from "~/components/PostCard";
import Pagination from "~/components/Pagination";
import { useState } from "react";
import PostFilter from "~/components/PostFilter";

const { VITE_API_URL } = import.meta.env;

export async function loader({
  request,
}: Route.LoaderArgs): Promise<{ posts: Post[] }> {
  const res = await fetch(
    `${VITE_API_URL}/posts?populate=image&sort=date:desc`,
  );
  if (!res.ok) throw new Error("Failed to fetch data");
  const json: StrapiResponse<StrapiPost> = await res.json();
  const posts = json.data.map((item: StrapiPost) => ({
    id: item.documentId,
    title: item.title,
    slug: item.slug,
    excerpt: item.excerpt,
    date: item.date,
    body: item.body,
    image: item.image?.url ? `${item.image.url}` : "/images/no-image.png",
  }));

  return { posts };
}

const BlogPage = ({ loaderData }: Route.ComponentProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const postsPerPage = 2;

  const { posts } = loaderData;

  const filteredPosts = posts.filter((post) => {
    const query = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(query) ||
      post.excerpt.toLowerCase().includes(query)
    );
  });

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const indexOfLast = currentPage * postsPerPage;

  const indexOfFirst = indexOfLast - postsPerPage;

  const currentPosts = filteredPosts.slice(indexOfFirst, indexOfLast);

  return (
    <>
      <div className="max-w-3xl mx-auto mt-10 px-6 py-6 bg-gray-900">
        <h2 className="text-3xl text-white font-bold mb-4">✏️ Blog</h2>
        <PostFilter
          searchQuery={searchQuery}
          onSearchChange={(query) => {
            setSearchQuery(query);
            setCurrentPage(1);
          }}
        />
        <div className="space-y-8">
          {currentPosts.length === 0 ? (
            <p className="text-gray-400 text-center">No posts found</p>
          ) : (
            currentPosts.map((post) => <PostCard key={post.slug} post={post} />)
          )}
        </div>
      </div>
      {totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          currentPage={currentPage}
        />
      )}
    </>
  );
};

export default BlogPage;

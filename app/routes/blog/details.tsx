import ReactMarkdown from "react-markdown";
import type { Route } from "./+types/details";
import type { Post, StrapiPost, StrapiResponse } from "~/types";
import { Link } from "react-router";
import { MoveLeft } from "lucide-react";

const { VITE_API_URL } = import.meta.env;

export async function loader({ request, params }: Route.LoaderArgs) {
  const { slug } = params;
  const res = await fetch(
    `${VITE_API_URL}/posts?filters[slug][$eq]=${slug}&populate=image`,
  );
  if (!res.ok) throw new Error("Failed to fetch data");

  const json: StrapiResponse<StrapiPost> = await res.json();

  if (!json.data.length) throw new Response("Not Found", { status: 404 });

  const item = json.data[0];

  const post: Post = {
    id: item.documentId,
    slug: item.slug,
    title: item.title,
    excerpt: item.excerpt,
    date: item.date,
    image: item.image?.url ? `${item.image.url}` : "/images/no-image.png",
    body: item.body,
  };

  return { post };
}

type BlogPostDetailsPageProps = {
  loaderData: {
    post: Post;
  };
};

const BlogPostDetailsPage = ({ loaderData }: BlogPostDetailsPageProps) => {
  const { post } = loaderData;

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 bg-gray-900">
      <h1 className="text-3xl font-bold text-blue-400 mb-2">{post.title}</h1>
      <p className="text sm text-gray-400 mb-6" suppressHydrationWarning>
        {new Date(post.date).toDateString()}
      </p>

      <img
        src={post.image}
        alt={post.title}
        className="w-full h-64 object-cover mb-4"
      />

      <div className="prose prose-invert max-w-none mb-12 text-white">
        <ReactMarkdown>{post.body}</ReactMarkdown>
      </div>
      <Link
        to="/blog"
        className="text-white hover:bg-blue-700 inline-block bg-blue-600 px-6 py-2 rounded-lg transition"
      >
        <MoveLeft className="inline-block" /> Back To Posts
      </Link>
    </div>
  );
};

export default BlogPostDetailsPage;

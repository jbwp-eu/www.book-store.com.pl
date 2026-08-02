import ReactMarkdown from "react-markdown";
import type { Route } from "./+types/details";
import { Link } from "react-router";
import { MoveLeft } from "lucide-react";
import { getPostBySlug } from "~/lib/strapi";
import { formatDate } from "~/lib/date";
import { pageTitle } from "~/lib/site";

export function meta({ loaderData }: Route.MetaArgs) {
  if (!loaderData?.post) {
    return [{ title: pageTitle("Post") }];
  }
  const { post } = loaderData;
  return [
    { title: pageTitle(post.title) },
    { name: "description", content: post.excerpt },
    { property: "og:title", content: post.title },
    { property: "og:description", content: post.excerpt },
    { property: "og:image", content: post.image },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  const post = await getPostBySlug(params.slug!);
  return { post };
}

const BlogPostDetailsPage = ({ loaderData }: Route.ComponentProps) => {
  const { post } = loaderData;

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 bg-gray-900">
      <h1 className="text-3xl font-bold text-blue-400 mb-2">{post.title}</h1>
      <p className="text-sm text-gray-400 mb-6">{formatDate(post.date)}</p>

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

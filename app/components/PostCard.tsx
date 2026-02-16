import { MoveRight } from "lucide-react";
import { Link } from "react-router";
import type { Post } from "~/types";

const PostCard = ({ post }: { post: Post }) => {
  return (
    <article className="bg-gray-800 p-6 rounded-lg shadow mb-4">
      <h3 className="text-2xl font-semibold text-blue-400">{post.title}</h3>
      <p className="text-sm text-gray-400 mb-2" suppressHydrationWarning>
        {new Date(post.date).toDateString()}
      </p>
      {post.image && (
        <img
          src={post?.image ? `${post.image}` : "/images/no-image.png"}
          alt={post.title}
          className="mx-auto h-48 object-content rounded mb-4"
        />
      )}
      <p className="text-gray-300 mb-4">{post.excerpt}</p>

      <Link
        to={`/blog/${post.slug}`}
        className="text-blue-300 text-sm hover:underline"
      >
        Read More <MoveRight className="inline-block" />{" "}
      </Link>
    </article>
  );
};

export default PostCard;

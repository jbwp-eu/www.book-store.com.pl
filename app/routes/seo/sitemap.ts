import { SITE_URL } from "~/lib/site.server";
import {
  getAllPostsForSitemap,
  getAllProjectsForSitemap,
} from "~/lib/strapi";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function urlEntry(loc: string, lastmod?: string) {
  const lastmodTag = lastmod
    ? `\n    <lastmod>${escapeXml(lastmod.slice(0, 10))}</lastmod>`
    : "";
  return `  <url>\n    <loc>${escapeXml(loc)}</loc>${lastmodTag}\n  </url>`;
}

export async function loader() {
  const staticPaths = ["", "/about", "/contact", "/blog", "/projects"];

  let posts: { slug: string; date: string }[] = [];
  let projects: { id: string; date: string }[] = [];

  try {
    [posts, projects] = await Promise.all([
      getAllPostsForSitemap(),
      getAllProjectsForSitemap(),
    ]);
  } catch {
    // Still return static URLs if Strapi is unreachable
  }

  const urls = [
    ...staticPaths.map((path) => urlEntry(`${SITE_URL}${path}`)),
    ...posts.map((post) =>
      urlEntry(`${SITE_URL}/blog/${post.slug}`, post.date),
    ),
    ...projects.map((project) =>
      urlEntry(`${SITE_URL}/projects/${project.id}`, project.date),
    ),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

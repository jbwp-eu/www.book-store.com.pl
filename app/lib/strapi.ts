import type {
  Post,
  Project,
  StrapiPost,
  StrapiProject,
  StrapiResponse,
} from "~/types";

const API_URL = import.meta.env.VITE_API_URL;

function buildUrl(
  path: string,
  params: Record<string, string | number | boolean | undefined> = {},
) {
  const url = new URL(`${API_URL}${path}`);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) url.searchParams.set(key, String(value));
  }
  return url;
}

export async function strapiFetch<T>(
  path: string,
  params?: Record<string, string | number | boolean | undefined>,
): Promise<StrapiResponse<T>> {
  const res = await fetch(buildUrl(path, params));

  if (!res.ok) {
    throw new Response("Failed to fetch from Strapi", { status: res.status });
  }

  return res.json();
}

export function mapPost(item: StrapiPost): Post {
  return {
    id: item.documentId,
    title: item.title,
    slug: item.slug,
    excerpt: item.excerpt,
    date: item.date,
    body: item.body,
    image: item.image?.url ?? "/images/no-image.png",
  };
}

export function mapProject(item: StrapiProject): Project {
  return {
    id: item.documentId,
    title: item.title,
    description: item.description,
    image: item.image?.url ?? "/images/no-image.png",
    url: item.url,
    date: item.date,
    category: item.category,
    featured: item.featured,
  };
}

export async function getFeaturedProjects() {
  const json = await strapiFetch<StrapiProject>("/projects", {
    "filters[featured][$eq]": true,
    populate: "*",
  });
  return json.data.map(mapProject);
}

export async function getLatestPosts(limit = 5) {
  const json = await strapiFetch<StrapiPost>("/posts", {
    "sort[0]": "date:desc",
    "pagination[pageSize]": limit,
    populate: "*",
  });
  return json.data.map(mapPost);
}

export async function getPostsPage(
  page: number,
  pageSize = 2,
  query?: string,
) {
  const params: Record<string, string | number | boolean> = {
    populate: "image",
    sort: "date:desc",
    "pagination[page]": page,
    "pagination[pageSize]": pageSize,
  };

  const q = query?.trim();
  if (q) {
    params["filters[$or][0][title][$containsi]"] = q;
    params["filters[$or][1][excerpt][$containsi]"] = q;
  }

  const json = await strapiFetch<StrapiPost>("/posts", params);

  return {
    posts: json.data.map(mapPost),
    pageCount: json.meta?.pagination?.pageCount ?? 1,
  };
}

export async function getPostBySlug(slug: string) {
  const json = await strapiFetch<StrapiPost>("/posts", {
    "filters[slug][$eq]": slug,
    populate: "image",
  });

  const item = json.data[0];
  if (!item) throw new Response("Not Found", { status: 404 });

  return mapPost(item);
}

export async function getProjectCategories() {
  const json = await strapiFetch<StrapiProject>("/projects", {
    "fields[0]": "category",
    "pagination[pageSize]": 100,
  });

  return [
    "All",
    ...new Set(json.data.map((item) => item.category).filter(Boolean)),
  ];
}

export async function getProjectsPage(
  page: number,
  pageSize = 2,
  category?: string,
) {
  const params: Record<string, string | number | boolean> = {
    populate: "*",
    "pagination[page]": page,
    "pagination[pageSize]": pageSize,
  };

  if (category && category !== "All") {
    params["filters[category][$eq]"] = category;
  }

  const json = await strapiFetch<StrapiProject>("/projects", params);

  return {
    projects: json.data.map(mapProject),
    pageCount: json.meta?.pagination?.pageCount ?? 1,
  };
}

export async function getProjectById(id: string) {
  const json = await strapiFetch<StrapiProject>("/projects", {
    "filters[documentId][$eq]": id,
    populate: "*",
  });

  const item = json.data[0];
  if (!item) throw new Response("Not Found", { status: 404 });

  return mapProject(item);
}

export async function getAllPostsForSitemap() {
  const json = await strapiFetch<StrapiPost>("/posts", {
    "fields[0]": "slug",
    "fields[1]": "date",
    "pagination[pageSize]": 100,
    sort: "date:desc",
  });

  return json.data.map((item) => ({
    slug: item.slug,
    date: item.date,
  }));
}

export async function getAllProjectsForSitemap() {
  const json = await strapiFetch<StrapiProject>("/projects", {
    "fields[0]": "documentId",
    "fields[1]": "date",
    "pagination[pageSize]": 100,
  });

  return json.data.map((item) => ({
    id: item.documentId,
    date: item.date,
  }));
}

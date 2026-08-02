import { describe, expect, it } from "vitest";
import { mapPost, mapProject } from "~/lib/strapi";
import type { StrapiPost, StrapiProject } from "~/types";

describe("mapPost", () => {
  it("maps Strapi post fields and falls back image", () => {
    const item = {
      id: "1",
      documentId: "doc-post-1",
      title: "Hello",
      slug: "hello",
      excerpt: "Excerpt",
      date: "2026-01-15",
      body: "Body",
    } satisfies StrapiPost;

    expect(mapPost(item)).toEqual({
      id: "doc-post-1",
      title: "Hello",
      slug: "hello",
      excerpt: "Excerpt",
      date: "2026-01-15",
      body: "Body",
      image: "/images/no-image.png",
    });
  });

  it("uses image url when present", () => {
    const item = {
      id: "1",
      documentId: "doc-post-2",
      title: "With image",
      slug: "with-image",
      excerpt: "Excerpt",
      date: "2026-01-15",
      body: "Body",
      image: {
        url: "https://cdn.example/post.jpg",
        formats: {
          large: { url: "" },
          small: { url: "" },
          medium: { url: "" },
          thumbnail: { url: "" },
        },
      },
    } satisfies StrapiPost;

    expect(mapPost(item).image).toBe("https://cdn.example/post.jpg");
  });
});

describe("mapProject", () => {
  it("maps Strapi project fields", () => {
    const item = {
      id: "1",
      documentId: "doc-proj-1",
      title: "Shop",
      description: "Desc",
      url: "https://example.com",
      date: "2026-02-01",
      category: "React",
      featured: true,
    } satisfies StrapiProject;

    expect(mapProject(item)).toEqual({
      id: "doc-proj-1",
      title: "Shop",
      description: "Desc",
      image: "/images/no-image.png",
      url: "https://example.com",
      date: "2026-02-01",
      category: "React",
      featured: true,
    });
  });
});

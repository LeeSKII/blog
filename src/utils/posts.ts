import { getCollection } from "astro:content";
// import type { PostCollection } from "@/types/posts";

export async function getAllPublishedPosts() {
  const allPosts = await getCollection("blog");
  return allPosts.filter((post) => post.data.isPublished);
}

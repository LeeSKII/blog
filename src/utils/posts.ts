import { getCollection } from "astro:content";
import type { PostCollection } from "@/types/posts";

export async function getAllPublishedPosts() {
  const allPosts: PostCollection[] = await getCollection("posts");
  console.log("allPosts", allPosts);
  return allPosts.filter((post) => post.data.isPublished);
}

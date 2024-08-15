import { getCollection } from "astro:content";

export async function getAllPublishedPosts() {
  const allPosts = await getCollection("posts");
  return allPosts.filter((post) => post.data.isPublished);
}

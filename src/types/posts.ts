export type PostCollection = {
  id: string; //filename
  slug: string; //url slug
  body: string; //markdown content
  collection: "posts";
  data: {
    title: string; //post title
    pubDate: Date;
    isPublished: boolean;
    description: string;
    author: string;
    image: object;
    tags: string[];
  };
};

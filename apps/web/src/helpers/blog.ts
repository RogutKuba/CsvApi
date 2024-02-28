import matter from 'gray-matter';
import path from 'path';
import fs from 'fs/promises';
import { cache } from 'react';

export type Post = {
  title: string;
  slug: string;
  date: string;
  tags: string[];
  description: string;
  body: string;
  lastModified?: number;
  views?: number;
  // Third party only
  isThirdParty?: boolean;
  href?: string;
};

// `cache` is a React 18 feature that allows you to cache a function for the lifetime of a request.
// this means getPosts() will only be called once per page build, even though we may call it multiple times
// when rendering the page.
export const getPosts = cache(async () => {
  const posts = await fs.readdir('./content/');

  const parsedPosts = await Promise.all(
    posts
      .filter((file) => path.extname(file) === '.mdx')
      .map(async (file) => {
        const filePath = `./content/${file}`;
        const postContent = await fs.readFile(filePath, 'utf8');
        const { data, content } = matter(postContent);

        if (data.published === false) {
          return null;
        }

        return { ...data, body: content } as Post;
      })
  );

  return parsedPosts.filter((p): p is Post => !!p);
});

export async function getPost(slug: string) {
  const posts = await getPosts();
  return posts.find((post) => post.slug === slug);
}

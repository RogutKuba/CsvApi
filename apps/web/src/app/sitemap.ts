// app/sitemap.ts

import { getPosts } from '../helpers/blog';
import { env } from '../env.mjs';

export default async function sitemap() {
  const posts = await getPosts();
  const blogs = posts.map((post) => ({
    url: `${env.NEXT_PUBLIC_URL}/blog/${post.slug}`,
    lastModified: new Date(post.lastModified ?? post.date)
      .toISOString()
      .split('T')[0],
  }));

  const routes = ['', '/about', '/blog', '/projects'].map((route) => ({
    url: `${env.NEXT_PUBLIC_URL}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }));

  return [...routes, ...blogs];
}

import { notFound } from 'next/navigation';
import { PostBody } from './components/PostBody';
import { getPost, getPosts } from '@billing/web/helpers/blog';

export default async function BlogPostPage({
  params,
}: {
  params: {
    slug: string;
  };
}) {
  const post = await getPost(params.slug);
  // notFound is a Next.js utility
  if (!post) return notFound();
  // Pass the post contents to MDX
  return <PostBody>{post?.body}</PostBody>;
}

export async function generateStaticParams() {
  const posts = await getPosts();
  // The params to pre-render the page with.
  // Without this, the page will be rendered at runtime
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);

  if (!post) {
    return undefined;
  }

  return {
    title: post.title,
    description: post.description,
    generator: 'Next.js',
    applicationName: 'CSVAPI',
    referrer: 'origin-when-cross-origin',
    keywords: ['CSV', 'API', 'CSV to API', 'CSV API', 'API from CSV'],
    authors: [{ name: 'Kuba' }],
    creator: 'Kuba Rogut',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
  };
}

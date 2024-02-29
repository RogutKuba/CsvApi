import { Separator } from '@billing/ui/src/components/separator';
import { Typography } from '@billing/ui/src/components/typography';
import { getPosts } from '@billing/web/helpers/blog';
import Link from 'next/link';

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <>
      <div className='flex flex-col items-center space-y-2 mb-2'>
        <Typography.h1>Blog</Typography.h1>
        <Typography.muted className='text-center'>
          The latest posts and updates from the CSVAPI team.
        </Typography.muted>
      </div>

      <ul className='flex flex-col space-y-8'>
        <Separator />
        {posts.map((post) => (
          <Link href={`/blog/${post.slug}`}>
            <li key={post.slug} className='space-y-2'>
              <Typography.large className='text-2xl'>
                {post.title}
              </Typography.large>
              <Typography.muted className='font-18 text-md'>
                {post.description}
              </Typography.muted>
              <Typography.muted className='opacity-[0.5]'>
                {post.date}
              </Typography.muted>
            </li>
          </Link>
        ))}
      </ul>
    </>
  );
}

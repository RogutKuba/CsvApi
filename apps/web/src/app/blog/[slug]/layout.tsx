import { Button } from '@billing/ui/src/components/button';
import { Typography } from '@billing/ui/src/components/typography';
import { getPosts } from '@billing/web/helpers/blog';
import Link from 'next/link';

async function getData({ slug }: { slug: string }) {
  const posts = await getPosts();
  const postIndex = posts.findIndex((p) => p?.slug === slug);

  if (postIndex === -1) {
    throw new Error(
      `${slug} not found in posts. Did you forget to rename the file?`
    );
  }

  const post = posts[postIndex];

  const { ...rest } = post;

  return {
    previous: posts[postIndex + 1] || null,
    next: posts[postIndex - 1] || null,
    ...rest,
  };
}

export default async function PostLayout({
  children,
  params,
}: {
  children: JSX.Element;
  params: {
    slug: string;
  };
}) {
  const { previous, next, title, date } = await getData(params);

  return (
    <>
      <div className='my-8 flex justify-between items-center'>
        <span>{date}</span>
        <Link href='/blog'>
          <Button variant='link' className='py-0 text-black'>
            Back
          </Button>
        </Link>
      </div>
      <article>
        <Typography.h1 className='mb-8'>{title}</Typography.h1>
        {children}
      </article>
    </>
  );
}

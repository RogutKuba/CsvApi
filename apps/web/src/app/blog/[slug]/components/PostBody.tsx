import { MDXRemote } from 'next-mdx-remote/rsc';

import remarkGfm from 'remark-gfm';
import remarkFrontmatter from 'remark-frontmatter';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkToc from 'remark-toc';
import { mdxComponents, useMDXComponents } from 'mdx-components';

export function PostBody({ children }: { children: string }) {
  return (
    <div className='prose'>
      <MDXRemote
        source={children}
        options={{
          mdxOptions: {
            remarkPlugins: [
              remarkGfm,
              remarkFrontmatter,
              [
                remarkToc,
                {
                  tight: true,
                  maxDepth: 5,
                },
              ],
            ],
            rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
          },
        }}
        components={useMDXComponents}
      />
    </div>
  );
}

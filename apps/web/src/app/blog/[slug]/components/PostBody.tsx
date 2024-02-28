import { useMDXComponents } from 'mdx-components';
import { MDXRemote } from 'next-mdx-remote/rsc';

export function PostBody({ children }: { children: string }) {
  return (
    <div className='prose'>
      <MDXRemote
        source={children}
        options={{
          mdxOptions: {
            remarkPlugins: [],
            // These work together to add IDs and linkify headings
            rehypePlugins: [],
          },
        }}
        components={useMDXComponents}
      />
    </div>
  );
}

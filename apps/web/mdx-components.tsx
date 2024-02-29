import { Typography } from '@billing/ui/src/components/typography';
import type { MDXComponents } from 'mdx/types';
import Image, { ImageProps } from 'next/image';
import Link from 'next/link';

// This file is required to use MDX in `app` directory.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    a: ({ children, ...props }) => {
      return (
        <Link {...props} href={props.href || ''} ref={undefined}>
          {children}
        </Link>
      );
    },
    img: (props) => (
      <Image
        style={{ width: '100%', height: 'auto' }}
        {...(props as ImageProps)}
      />
    ),
    ...components,
  };
}

// This file is required to use MDX in `app` directory.
export const mdxComponents: MDXComponents = {
  a: ({ children, ...props }) => {
    return (
      <Link {...props} href={props.href || ''} ref={undefined}>
        {children}
      </Link>
    );
  },
  img: (props) => (
    <Image
      style={{ width: '100%', height: 'auto' }}
      {...(props as ImageProps)}
    />
  ),
};

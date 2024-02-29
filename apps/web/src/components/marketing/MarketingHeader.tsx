'use client';
import { Typography } from '@billing/ui/src/components/typography';
import { ContentHeader } from '../ContentHeader';
import { SignupButton } from './SignupButton';
import { Button } from '@billing/ui/src/components/button';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@billing/ui/src/components/dropdown-menu';
import { SignupLink } from './SignupLink';
import Link from 'next/link';

export const MarketingHeader = () => {
  const scrollToFeatures = () => {
    const features = document.getElementById('features');
    features?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <ContentHeader>
      <Link href='/' className='flex items-center gap-2'>
        <img src='/csv.svg' alt='CSVAPI' height={30} width={30} />
        <Typography.h1>CSVAPI</Typography.h1>
      </Link>

      <div className='flex items-center space-x-2 hidden sm:block'>
        <Button variant='ghost' onClick={scrollToFeatures}>
          Pricing
        </Button>
        <Link href='/blog'>
          <Button variant='ghost'>Blog</Button>
        </Link>
        <SignupButton text='Get Started' />
      </div>

      <div className='block sm:hidden'>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <HamburgerMenuIcon className='h-6 w-6 mr-2' />
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <SignupLink />
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={scrollToFeatures}>
              Pricing
            </DropdownMenuItem>
            <Link href='/blog'>
              <DropdownMenuItem>Blog</DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </ContentHeader>
  );
};

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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@billing/ui/src/components/dropdown-menu';
import { SignupLink } from './SignupLink';

export const MarketingHeader = () => {
  const scrollToFeatures = () => {
    const features = document.getElementById('features');
    features?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <ContentHeader>
      <div className='flex items-center gap-2'>
        <img src='/csv.svg' alt='CSVAPI' height={30} width={30} />
        <Typography.h1>CSVAPI</Typography.h1>
      </div>

      <div className='flex items-center gap-4 hidden sm:block'>
        <Button variant='ghost' onClick={scrollToFeatures}>
          Pricing
        </Button>
        {/* <Button variant='ghost'>Blog</Button> */}
        <SignupButton text='Get Started' />
      </div>

      <div className='block sm:hidden'>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant='ghost' size='icon'>
              <HamburgerMenuIcon className='h-6 w-6' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            {/* <DropdownMenuLabel>Get Started</DropdownMenuLabel> */}
            <SignupLink />
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={scrollToFeatures}>
              Pricing
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </ContentHeader>
  );
};

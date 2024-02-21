'use client';
import { Typography } from '@billing/ui/src/components/typography';
import { ContentHeader } from '../ContentHeader';
import { SignupButton } from './SignupButton';
import { Button } from '@billing/ui/src/components/button';

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

      <div className='flex items-center gap-4'>
        <Button variant='ghost' onClick={scrollToFeatures}>
          Pricing
        </Button>
        {/* <Button variant='ghost'>Blog</Button> */}
        <SignupButton text='Get Started' />
      </div>
    </ContentHeader>
  );
};

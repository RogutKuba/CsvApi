'use client';
import { Typography } from '@billing/ui/src/components/typography';
import { ContentHeader } from '../ContentHeader';
import { SignupButton } from './SignupButton';

export const MarketingHeader = () => {
  return (
    <ContentHeader>
      <Typography.h1>CSV2API</Typography.h1>
      <SignupButton text='Get Started' />
    </ContentHeader>
  );
};

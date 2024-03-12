import { MarketingHeader } from '@billing/web/components/marketing/MarketingHeader';
import GridPattern from '@billing/web/components/patterns/gridPattern';

export default function PricingPage() {
  return (
    <div className='relative w-screen'>
      <MarketingHeader />
      <div className='mx-auto flex w-full flex-col md:max-w-[58rem] gap-6 py-4 md:py-6 lg:py-12'>
        <h2 className='font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl'>
          Simple, transparent pricing
        </h2>
        <p className='max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7'>
          We offer a generous free tier to get you started with 15 free APIs and
          1000 requests per month.
        </p>
      </div>
      <GridPattern
        strokeDasharray={5}
        className='h-screen -z-10 stroke-gray-200 [mask-image:linear-gradient(to_bottom_right,white 50%, transparent 10% ,transparent 10%)]'
      />
    </div>
  );
}

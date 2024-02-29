import { MarketingHeader } from '@billing/web/components/marketing/MarketingHeader';

export default function BlogLayout({ children }) {
  return (
    <div>
      <MarketingHeader />
      <div className='mx-2 md:mx-32 lg:mx-72 my-4 px-2 flex justify-center'>
        <div className='flex flex-col w-[75vw] lg:w-[50vw]'>{children}</div>
      </div>
    </div>
  );
}

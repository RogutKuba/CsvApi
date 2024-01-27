import { Button } from '@billing/ui/src/components/button';
import Image from 'next/image';

export const Hero = () => {
  return (
    <div className='px-4'>
      <div className='py-12'>
        <div className='grid grid-cols-2 gap-16'>
          <div className='flex flex-col justify-center'>
            {/* <div className="text-sm uppercase tracking-wide text-gray-500">
              Your next fintech startup
            </div> */}
            <h1 className='mt-2 text-6xl font-bold leading-tight'>
              Innovating financial solutions for tomorrow
            </h1>
            <p className='mt-4 text-lg text-gray-700'>
              Revolutionizing the financial landscape with cutting-edge
              technology and expertise
            </p>
            <div className='mt-6 flex gap-4'>
              <Button className='text-white'>Buy Alfred</Button>
              <Button variant='outline'>See all pages</Button>
            </div>
          </div>
          <img className='shadow-xl rounded-xl' alt='Hero' src='/hero.png' />
        </div>
      </div>
    </div>
  );
};

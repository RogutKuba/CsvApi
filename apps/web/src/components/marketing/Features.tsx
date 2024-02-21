import {
  LightningBoltIcon,
  MagnifyingGlassIcon,
  RocketIcon,
} from '@radix-ui/react-icons';

export const Features = () => {
  return (
    <section id='features' className='container space-y-6 pt-8 pb-24'>
      <div className='mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center'>
        <h2 className='font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl'>
          Features
        </h2>
      </div>
      <div className='mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3'>
        <div className='relative overflow-hidden rounded-lg border bg-background p-2'>
          <div className='flex h-[180px] flex-col justify-between rounded-md p-6'>
            <RocketIcon className='w-12 h-12' />
            <div className='space-y-2'>
              <h3 className='font-bold'>Generous free tier</h3>
              <p className='text-sm text-muted-foreground'>
                Get started with 15 free APIS and 1000 requests per month
              </p>
            </div>
          </div>
        </div>
        <div className='relative overflow-hidden rounded-lg border bg-background p-2'>
          <div className='flex h-[180px] flex-col justify-between rounded-md p-6'>
            <LightningBoltIcon className='w-12 h-12' />
            <div className='space-y-2'>
              <h3 className='font-bold'>Data Parsing</h3>
              <p className='text-sm text-muted-foreground'>
                CSVAPI will automatically parse your CSV file to return JSON
                formatted data
              </p>
            </div>
          </div>
        </div>
        <div className='relative overflow-hidden rounded-lg border bg-background p-2'>
          <div className='flex h-[180px] flex-col justify-between rounded-md p-6'>
            <MagnifyingGlassIcon className='w-12 h-12' />
            <div className='space-y-2'>
              <h3 className='font-bold'>Filtering</h3>
              <p className='text-sm text-muted-foreground'>
                Add filters to your request to filter through your CSV data
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

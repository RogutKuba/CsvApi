import { SignupButton } from './SignupButton';

export const Hero = () => {
  return (
    <section className='space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32'>
      <div className='container flex max-w-[64rem] flex-col items-center gap-4 text-center'>
        <h1 className='font-heading font-semibold text-3xl sm:text-5xl md:text-6xl lg:text-7xl'>
          Instantly Create An API From Your CSV Files
        </h1>
        <p className='max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8'>
          Upload your CSV files and instantly create an API to share with your
          team or the world.
        </p>

        <SignupButton size='lg' text='Get started for free now' />
      </div>
    </section>
  );
};

import { Button } from '@billing/ui/src/components/button';

interface Props {
  className?: string;
}

export const Header = ({ className }: Props) => {
  return (
    <header className={`flex items-center justify-between ${className}`}>
      <div className='flex items-center'>
        <img
          className='h-8 w-8'
          src='https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg'
          alt='Workflow'
        />
        <h1 className='text-2xl font-semibold ml-2'>Workflow</h1>
      </div>
      <div className='flex gap-6'>
        <Button variant='link' className='text-muted-foreground'>
          Docs
        </Button>
        <Button variant='link' className='text-muted-foreground'>
          Pricing
        </Button>
        <Button variant='link' className='text-muted-foreground'>
          Docs
        </Button>
        <Button variant='link' className='text-muted-foreground'>
          FAQ
        </Button>
      </div>
      <div className='flex items-center gap-2'>
        <Button variant='outline'>Log in</Button>
        <Button>Sign up</Button>
      </div>
    </header>
  );
};

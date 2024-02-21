'use client';
import { ApisView } from '../../components/apis/ApisView';
import { AppContainer } from '../../components/AppContainer';
import { UsageView } from '../../components/usage/UsageView';
import { AppHeader } from '../../components/AppHeader';

export default function Home() {
  return (
    <>
      <AppHeader />
      <AppContainer>
        <ApisView />
        <div className='w-full flex justify-between items-center gap-8'>
          <UsageView />
        </div>
      </AppContainer>
    </>
  );
}

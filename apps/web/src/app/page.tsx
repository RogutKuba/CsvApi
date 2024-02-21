import { Hero } from '../components/marketing/Hero';
import { MarketingHeader } from '../components/marketing/MarketingHeader';
import GridPattern from '../components/patterns/gridPattern';

export default function LandingPage() {
  return (
    <div>
      <MarketingHeader />
      <Hero />
      <GridPattern
        strokeDasharray={5}
        className='-z-10 stroke-gray-200 [mask-image:linear-gradient(to_bottom_right,white 50%, transparent 10% ,transparent 10%)]'
      />
    </div>
  );
}

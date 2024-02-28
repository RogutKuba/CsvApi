import { MarketingHeader } from '@billing/web/components/marketing/MarketingHeader';

export default function BlogLayout({ children }) {
  return (
    <div>
      <MarketingHeader />
      {children}
    </div>
  );
}

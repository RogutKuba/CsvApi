import { Label } from '@billing/ui/src/components/label';
import { Typography } from '@billing/ui/src/components/typography';

interface Props {
  data: string | null;
  loading: boolean;
}

export const QueryResult = ({ data, loading }: Props) => {
  return (
    <div>
      <Label>Result</Label>
      {loading ? (
        <>
          <Typography.p>Loading...</Typography.p>
        </>
      ) : null}
      {data ? (
        <pre className='max-h-[30vh] overflow-y-scroll'>{data}</pre>
      ) : null}
    </div>
  );
};

import type { TgnSubject } from '@/types';

import { cn } from '@/lib/utils';

export function TgnSubjectDetails({ tgnSubject }: { tgnSubject: TgnSubject }) {
  return (
    <>
      <pre>{JSON.stringify(tgnSubject, null, 2)}</pre>
    </>
  );
}

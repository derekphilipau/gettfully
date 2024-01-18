import type { UlanTerm } from '@/types';

import { Button } from '@/components/ui/button';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

export function TermHistoricFlagBadge({ term }: { term: UlanTerm }) {
  if (!term?.historicFlag || term?.historicFlag === 'NA') return null;

  return (
    <HoverCard>
      <HoverCardTrigger>
        <Button
          variant="secondary"
          size="sm"
          className="h-auto rounded-full px-2.5 text-xs font-semibold"
        >
          {term.historicFlag}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="font-normal">
          <h4 className="font-bold">Historical Flag</h4>
          <p>
            Indicates if the name is current or historical. If it is flagged
            &quot;N/A&quot; for Not Applicable in the database, it will be
            suppressed in the online display.
          </p>
          <ul>
            <li>C = Current</li>
            <li>H = Historical</li>
            <li>B = Both current and historical</li>
            <li>U = Unknown</li>
            <li>NA = Not Applicable</li>
            <li>LU = Local Use</li>
          </ul>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

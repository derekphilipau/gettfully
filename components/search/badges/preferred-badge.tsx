import type { GettyTerm } from '@/types';

import { Button } from '@/components/ui/button';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

export function PreferredBadge({ term }: { term: GettyTerm }) {
  if (!(term?.preferred === 'P')) return null;

  return (
    <HoverCard>
      <HoverCardTrigger>
        <Button
          variant="default"
          size="sm"
          className="h-auto rounded-full px-2.5 text-xs font-semibold"
        >
          {term.preferred}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="font-normal">
          <h4 className="font-bold">Preferred Name</h4>
          <p>
            &quot;preferred&quot; following a name indicates that the name is
            the so-called &quot;preferred name&quot; for the record. It is
            typically the first in a list of names in the record.
          </p>
          <p>
            A preferred name or &quot;descriptor&quot; is flagged in order to
            provide a default term for displays. It may also be used by
            cataloguers who wish to apply ULAN as an &quot;authority,&quot; and
            consistently use a single name to refer to an artist. In ULAN, the
            &quot;preferred&quot; name is the commonly used name in American
            English. Other languages may also be flagged. For example, the
            preferred Italian spelling could be marked with a &quot;P,&quot; as
            in &quot;Italian-P.&quot;
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

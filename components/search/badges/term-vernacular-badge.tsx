import type { UlanTerm } from '@/types';

import { Button } from '@/components/ui/button';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

export function TermVernacularBadge({ term }: { term: UlanTerm }) {
  if (!term?.vernacular) return null;

  return (
    <HoverCard>
      <HoverCardTrigger>
        <Button
          variant="outline"
          size="sm"
          className="h-auto rounded-full px-2.5 text-xs font-semibold"
        >
          {term.vernacular}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="font-normal">
          <h4 className="font-bold">Vernacular Flag</h4>
          <p>
            Indicates if the name is in the vernacular (local) language or some
            other language. Currently in the ULAN, most names are flagged
            &quot;V&quot;.
          </p>
          <ul>
            <li>V = Vernacular</li>
            <li>O = Other</li>
            <li>U = Undetermined</li>
          </ul>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

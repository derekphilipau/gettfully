import type { UlanBiography } from '@/types';

import { Button } from '@/components/ui/button';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

export function ContributorBadge({ item }: { item: UlanBiography }) {
  if (!item?.contributor) return null;

  return (
    <HoverCard>
      <HoverCardTrigger>
        <Button
          variant="outline"
          size="sm"
          className="h-auto rounded-full px-2.5 text-xs font-semibold"
        >
          {item.contributor}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="font-normal">
          <h4 className="font-bold">Sources and Contributors</h4>
          <p>
            Initials, abbreviations, or acronyms for the contributing projects
            or institutions (in square brackets), combined with bibliographic
            sources. Sources and Contributors may be associated with the record
            in three ways: with the names, with the record as a whole (subject),
            and with the note (descriptive note). For the names, when the
            contributor is followed by the word Preferred (e.g., BHA Preferred),
            it means that this name is preferred by that institution.
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

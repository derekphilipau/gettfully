import type { UlanBiography } from '@/types';

import { Button } from '@/components/ui/button';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

export function BiographyGenderBadge({
  biography,
}: {
  biography: UlanBiography;
}) {
  if (!biography?.sex || (biography.sex !== 'M' && biography.sex !== 'F'))
    return null;

  return (
    <HoverCard>
      <HoverCardTrigger>
        <Button
          variant="secondary"
          size="sm"
          className="h-auto rounded-full px-2.5 text-xs font-semibold"
        >
          {biography.sex === 'M' ? 'Male' : 'Female'}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="font-normal">
          <h4 className="font-bold">Gender</h4>
          <p>
            The sex of the artist, male, female, or unknown. For corporate
            bodies, the gender is not applicable.
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

import type { GettyTerm } from '@/types';

import { Button } from '@/components/ui/button';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

interface LanguageCodeItem {
  languageName?: string;
}

export function LanguageBadge({ item }: { item: LanguageCodeItem }) {
  if (!item?.languageName) return null;

  return (
    <HoverCard>
      <HoverCardTrigger>
        <Button
          variant="secondary"
          size="sm"
          className="h-auto rounded-full px-2.5 text-xs font-semibold"
        >
          {item.languageName}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="font-normal">
          <h4 className="font-bold">Language</h4>
          <p>The language of the descriptive note</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

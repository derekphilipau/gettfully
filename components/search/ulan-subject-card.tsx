import { useState } from 'react';
import { ChevronsUpDownIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { UlanSubjectDetails } from './ulan-subject-details';
import { UlanSubjectHeader } from './ulan-subject-header';

export function UlanSubjectCard({ ulanSubject }: { ulanSubject: any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-lg border p-3">
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="w-full space-y-2"
      >
        <div className="flex items-start justify-between gap-x-2">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon" className="h-12 w-12">
              <ChevronsUpDownIcon className="h-6 w-6" />
              <span className="sr-only">Expand Subject</span>
            </Button>
          </CollapsibleTrigger>
          <UlanSubjectHeader ulanSubject={ulanSubject} />
        </div>
        <CollapsibleContent className="border-t pt-3">
          <UlanSubjectDetails ulanSubject={ulanSubject} />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

'use client';

import { useState } from 'react';
import type { AatSubject, UlanSubject } from '@/types';
import { ChevronsUpDownIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { GettySubjectDetails } from './getty-subject-details';
import { UlanSubjectHeader } from './ulan-subject-header';

export function GettySubjectCard({
  gettySubject,
}: {
  gettySubject: UlanSubject | AatSubject;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-lg border p-2 sm:p-3">
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="w-full space-y-2"
      >
        <div className="flex items-start justify-between gap-x-2">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon" className="size-12">
              <ChevronsUpDownIcon className="size-6" />
              <span className="sr-only">Expand Subject</span>
            </Button>
          </CollapsibleTrigger>
          <UlanSubjectHeader ulanSubject={gettySubject} />
        </div>
        <CollapsibleContent className="border-t pt-3">
          <GettySubjectDetails gettySubject={gettySubject} />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

import Link from 'next/link';
import type { AatSubject, UlanBiography, UlanSubject } from '@/types';
import { ExternalLinkIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { CopyButton } from '@/components/copy-button';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';

function getPreferredBiography(gettySubject: UlanSubject) {
  if (!gettySubject?.biographies || !(gettySubject.biographies?.length > 0))
    return;
  const preferredBiography = gettySubject.biographies?.find(
    (biography: UlanBiography) => biography?.preferred === 'P'
  );
  if (preferredBiography) {
    return preferredBiography;
  }
  return gettySubject.biographies[0];
}

export function GettySubjectHeader({
  gettySubject,
}: {
  gettySubject: UlanSubject | AatSubject;
}) {
  const preferredBiography = getPreferredBiography(gettySubject as UlanSubject);

  const vocabulary = gettySubject?.type;

  if (!gettySubject?.terms || !(gettySubject.terms?.length > 0)) return null;

  return (
    <div className="w-full flex flex-wrap items-start gap-x-2">
      <div className="w-full flex items-start gap-x-1 text-lg ">
        <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center gap-x-2">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-semibold sm:text-lg md:text-xl">
              {gettySubject.terms?.[0]?.term}
            </h2>
            <Badge variant="outline">
              {gettySubject.subjectId}
              <CopyButton value={gettySubject.subjectId || ''} />
            </Badge>
          </div>
          <div>
            <Link
              className={cn(
                buttonVariants({ size: 'sm', variant: 'ghost' }),
                'rounded-md px-1 py-0.5 text-xs text-foreground visited:text-foreground hover:text-foreground sm:px-2.5'
              )}
              href={`http://vocab.getty.edu/page/${vocabulary}/${gettySubject.subjectId}`}
            >
              <span className="">{vocabulary?.toUpperCase()}</span>
              <ExternalLinkIcon className="size-4 ml-1" />
              <span className="sr-only">Getty Link</span>
            </Link>
          </div>
        </div>
      </div>
      {preferredBiography && (
        <div className="text-sm text-muted-foreground sm:text-base">
          {preferredBiography.biographyText}
        </div>
      )}
    </div>
  );
}

import Link from 'next/link';
import type {
  AatSubject,
  GettySubject,
  TgnSubject,
  UlanBiography,
  UlanSubject,
} from '@/types';
import { ExternalLinkIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { CopyButton } from '@/components/copy-button';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';

function getPreferredBiography(ulanSubject: UlanSubject) {
  if (!ulanSubject?.biographies || !(ulanSubject.biographies?.length > 0))
    return;
  const preferredBiography = ulanSubject.biographies?.find(
    (biography: UlanBiography) => biography?.preferred === 'P'
  );
  if (preferredBiography) {
    return preferredBiography;
  }
  return ulanSubject.biographies[0];
}

export function UlanSubjectHeader({
  ulanSubject,
}: {
  ulanSubject: UlanSubject | AatSubject | TgnSubject;
}) {
  const preferredBiography = getPreferredBiography(ulanSubject as UlanSubject);

  const vocabulary = ulanSubject?.type;

  if (!ulanSubject?.terms || !(ulanSubject.terms?.length > 0)) return null;

  return (
    <div className="flex w-full flex-col items-start">
      <div className="flex flex-wrap items-start gap-x-2">
        <div className="flex items-start gap-x-1 text-lg ">
          <div>
            <div className="flex flex-wrap items-center gap-x-2">
              <h2 className="text-base font-semibold sm:text-lg md:text-xl">
                {ulanSubject.terms?.[0]?.term}
              </h2>
              <Badge variant="outline">
                {ulanSubject.subjectId}
                <CopyButton value={ulanSubject.subjectId || ''} />
              </Badge>
              <Link
                className={cn(
                  buttonVariants({ size: 'sm', variant: 'link' }),
                  'h-9 rounded-md px-1'
                )}
                href={`http://vocab.getty.edu/page/${vocabulary}/${ulanSubject.subjectId}`}
              >
                <span className="hidden sm:inline-block">Getty</span>
                <ExternalLinkIcon className="size-4 sm:ml-2" />
                <span className="sr-only">Getty Link</span>
              </Link>
            </div>
            {preferredBiography && (
              <div className="text-sm text-muted-foreground sm:text-base">
                {preferredBiography.biographyText}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

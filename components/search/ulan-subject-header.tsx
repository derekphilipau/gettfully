import Link from 'next/link';
import { LinkIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { CopyButton } from '@/components/copy-button';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';

function getPreferredBiography(ulanSubject: any) {
  if (!ulanSubject.biographies) return;
  const preferredBiography = ulanSubject.biographies?.find(
    (biography: any) => biography?.preferred === 'P'
  );
  if (preferredBiography) {
    return preferredBiography;
  }
  if (ulanSubject.biographies?.length > 0) {
    return ulanSubject.biographies[0];
  }
}

export function UlanSubjectHeader({ ulanSubject }: { ulanSubject: any }) {
  const preferredBiography = getPreferredBiography(ulanSubject);

  return (
    <div className="flex w-full flex-col items-start">
      <div className="flex flex-wrap items-start gap-x-2">
        <div className="flex items-start gap-x-1 text-lg font-semibold sm:text-xl">
          <Link
            className={cn(
              buttonVariants({ size: 'icon', variant: 'ghost' }),
              'h-auto w-auto p-2'
            )}
            href={`http://vocab.getty.edu/page/ulan/${ulanSubject.subjectId}`}
          >
            <LinkIcon className="h-5 w-5" />
            <span className="sr-only">Getty Link</span>
          </Link>
          <div>
            <h2 className="flex flex-wrap items-center gap-x-2">
              {ulanSubject.terms?.[0]?.termEntry}
              <Badge variant="outline">
                {ulanSubject.subjectId}
                <CopyButton className="" value={ulanSubject.subjectId} />
              </Badge>
            </h2>
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

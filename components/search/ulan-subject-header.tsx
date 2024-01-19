import Link from 'next/link';
import { ExternalLinkIcon } from 'lucide-react';

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
          <div>
            <h2 className="flex flex-wrap items-center gap-x-2">
              {ulanSubject.terms?.[0]?.termEntry}
              <Badge variant="outline">
                {ulanSubject.subjectId}
                <CopyButton className="" value={ulanSubject.subjectId} />
              </Badge>
              <Link
                className={cn(
                  buttonVariants({ size: 'sm', variant: 'link' }),
                  'h-9 rounded-md px-1'
                )}
                href={`http://vocab.getty.edu/page/ulan/${ulanSubject.subjectId}`}
              >
                Getty
                <ExternalLinkIcon className="ml-2 h-4 w-4" />
                <span className="sr-only">Getty Link</span>
              </Link>
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

import { useState } from 'react';
import { getDictionary } from '@/dictionaries/dictionaries';
import { ChevronsUpDown, Plus, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

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

export function UlanSubjectCard({ ulanSubject }: { ulanSubject: any }) {
  const [isOpen, setIsOpen] = useState(false);

  const dict = getDictionary();

  const preferredBiography = getPreferredBiography(ulanSubject);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full space-y-2"
    >
      <div className="flex items-center justify-between space-x-2">
        <div className="flex w-full flex-col">
          <h2 className="text-xl font-semibold">
            {ulanSubject.terms?.[0]?.termEntry}
          </h2>
          {preferredBiography && (
            <div className="text-base font-semibold text-muted-foreground">
              {preferredBiography.biographyText}
            </div>
          )}
        </div>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="lg" className="w-12 p-0">
            <ChevronsUpDown className="h-6 w-6" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="">
        <div class="flex gap-x-4">
          {ulanSubject.terms?.length > 1 && (
            <div>
              <h5 className="mb-1 text-sm font-semibold uppercase text-muted-foreground">
                All Terms
              </h5>
              <div className="text-sm">
                {ulanSubject.terms?.map((term: any) => (
                  <div
                    key={term.termId}
                    className={term.preferred === 'P' ? 'font-bold' : ''}
                  >
                    {term.termEntry}{' '}
                    {term.preferred === 'P' && <span>(preferred)</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
          {ulanSubject.biographies?.length > 0 && (
            <div>
              <h5 className="mb-1 text-sm font-semibold uppercase text-muted-foreground">
                All Biographies
              </h5>
              <div className="text-sm">
                {ulanSubject.biographies?.map((biography: any) => (
                  <div
                    key={biography.biographyId}
                    className={biography.preferred === 'P' ? 'font-bold' : ''}
                  >
                    {biography.biographyText}{' '}
                    {biography.preferred === 'P' && <span>(preferred)</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
          {ulanSubject.nationalities?.length > 0 && (
            <div>
              <h5 className="mb-1 text-sm font-semibold uppercase text-muted-foreground">
                All Nationalities
              </h5>
              <div className="text-sm">
                {ulanSubject.nationalities?.map((nationality: any) => (
                  <div
                    key={nationality.nationalityId}
                    className={nationality.preferred === 'P' ? 'font-bold' : ''}
                  >
                    {nationality.name}{' '}
                    {nationality.preferred === 'P' && <span>(preferred)</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
          {ulanSubject.roles?.length > 0 && (
            <div>
              <h5 className="mb-1 text-sm font-semibold uppercase text-muted-foreground">
                All Roles
              </h5>
              <div className="text-sm">
                {ulanSubject.roles?.map((role: any) => (
                  <div
                    key={role.roleId}
                    className={role.preferred === 'P' ? 'font-bold' : ''}
                  >
                    {role.name}{' '}
                    {role.preferred === 'P' && <span>(preferred)</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

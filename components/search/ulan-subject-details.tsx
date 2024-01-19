import { useState } from 'react';

import { cn } from '@/lib/utils';
import { BiographyGenderBadge } from './badges/biography-gender-badge';
import { ContributorBadge } from './badges/contributor-badge';
import { LanguageBadge } from './badges/language-badge';
import { PreferredBadge } from './badges/preferred-badge';
import { TermHistoricFlagBadge } from './badges/term-historic-flag-badge';
import { TermVernacularBadge } from './badges/term-vernacular-badge';

export function UlanSubjectDetails({ ulanSubject }: { ulanSubject: any }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
      {ulanSubject.scopeNotes?.length > 0 && (
        <div className="w-full">
          <h5 className="mb-1 text-sm font-semibold uppercase text-muted-foreground">
            Scope Notes
          </h5>
          <ul className="text-sm">
            {ulanSubject.scopeNotes?.map((scopeNote: any) => (
              <li
                key={scopeNote.scopeNoteId}
                className="flex flex-wrap items-center gap-x-1"
              >
                {scopeNote.noteText}
                <LanguageBadge item={scopeNote} />
              </li>
            ))}
          </ul>
        </div>
      )}
      {ulanSubject.terms?.length > 1 && (
        <div className="max-w-xs">
          <h5 className="mb-1 text-sm font-semibold uppercase text-muted-foreground">
            Terms
          </h5>
          <ul className="text-sm">
            {ulanSubject.terms?.map((term: any) => (
              <li
                key={term.termId}
                className={cn(
                  'flex flex-wrap items-center gap-x-1',
                  term.preferred === 'P' ? 'font-bold' : ''
                )}
              >
                {term.termEntry}
                <TermHistoricFlagBadge term={term} />
                <PreferredBadge term={term} />
                <TermVernacularBadge term={term} />
              </li>
            ))}
          </ul>
        </div>
      )}
      {ulanSubject.nationalities?.length > 0 && (
        <div className="max-w-xs">
          <h5 className="mb-1 text-sm font-semibold uppercase text-muted-foreground">
            Nationalities
          </h5>
          <ul className="text-sm">
            {ulanSubject.nationalities?.map((nationality: any) => (
              <li
                key={nationality.nationalityId}
                className={cn(
                  'flex flex-wrap items-center gap-x-1',
                  nationality.preferred === 'P' ? 'font-bold' : ''
                )}
              >
                {nationality.name} <PreferredBadge term={nationality} />
              </li>
            ))}
          </ul>
        </div>
      )}
      {ulanSubject.roles?.length > 0 && (
        <div className="max-w-xs">
          <h5 className="mb-1 text-sm font-semibold uppercase text-muted-foreground">
            Roles
          </h5>
          <ul className="text-sm">
            {ulanSubject.roles?.map((role: any) => (
              <li
                key={role.roleId}
                className={cn(
                  'flex flex-wrap items-center gap-x-1',
                  role.preferred === 'P' ? 'font-bold' : ''
                )}
              >
                {role.name} <PreferredBadge term={role} />
              </li>
            ))}
          </ul>
        </div>
      )}
      {ulanSubject.biographies?.length > 0 && (
        <div className="max-w-xl">
          <h5 className="mb-1 text-sm font-semibold uppercase text-muted-foreground">
            Biographies
          </h5>
          <ul className="text-sm">
            {ulanSubject.biographies?.map((biography: any) => (
              <li
                key={biography.biographyId}
                className={cn(
                  'flex flex-wrap items-center gap-x-1',
                  biography.preferred === 'P' ? 'font-bold' : ''
                )}
              >
                {biography.biographyText} <PreferredBadge term={biography} />
                <ContributorBadge item={biography} />
                <BiographyGenderBadge biography={biography} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

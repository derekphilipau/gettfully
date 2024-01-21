import type { AatSubject, TgnSubject, UlanSubject } from '@/types';

import { cn } from '@/lib/utils';
import { LanguageBadge } from './badges/language-badge';
import { PreferredBadge } from './badges/preferred-badge';
import { TermHistoricFlagBadge } from './badges/term-historic-flag-badge';
import { TermVernacularBadge } from './badges/term-vernacular-badge';
import { TgnSubjectDetails } from './tgn-subject-details';
import { UlanSubjectDetails } from './ulan-subject-details';

export function GettySubjectDetails({
  gettySubject,
}: {
  gettySubject: UlanSubject | AatSubject | TgnSubject;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
      {gettySubject.scopeNotes && gettySubject.scopeNotes?.length > 0 && (
        <div className="w-full">
          <h5 className="mb-1 text-sm font-semibold uppercase text-muted-foreground">
            Scope Notes
          </h5>
          <ul className="text-sm">
            {gettySubject.scopeNotes?.map((scopeNote: any) => (
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
      {gettySubject.terms && gettySubject.terms?.length > 1 && (
        <div className="max-w-xs">
          <h5 className="mb-1 text-sm font-semibold uppercase text-muted-foreground">
            Terms
          </h5>
          <ul className="text-sm">
            {gettySubject.terms?.map((term: any) => (
              <li
                key={term.termId}
                className={cn(
                  'flex flex-wrap items-center gap-x-1',
                  term.preferred === 'P' ? 'font-bold' : ''
                )}
              >
                {term.term}
                <TermHistoricFlagBadge term={term} />
                <PreferredBadge term={term} />
                <TermVernacularBadge term={term} />
              </li>
            ))}
          </ul>
        </div>
      )}
      {gettySubject.type === 'ulan' && (
        <UlanSubjectDetails ulanSubject={gettySubject as UlanSubject} />
      )}
      {gettySubject.type === 'tgn' && (
        <TgnSubjectDetails tgnSubject={gettySubject as TgnSubject} />
      )}
    </div>
  );
}

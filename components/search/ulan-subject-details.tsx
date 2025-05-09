import Link from 'next/link';
import type { UlanSubject } from '@/types';

import { cn } from '@/lib/utils';
import { BiographyGenderBadge } from './badges/biography-gender-badge';
import { ContributorBadge } from './badges/contributor-badge';
import { PreferredBadge } from './badges/preferred-badge';

export function UlanSubjectDetails({
  ulanSubject,
}: {
  ulanSubject: UlanSubject;
}) {
  return (
    <>
      {ulanSubject.nationalities && (
        <div className="max-w-xs">
          <h5 className="mb-1 text-sm font-semibold uppercase text-muted-foreground">
            Nationalities
          </h5>
          <ul className="text-sm">
            {ulanSubject.nationalities?.map((nationality: any) => (
              <li
                key={nationality.nationalId}
                className={cn(
                  'flex flex-wrap items-center gap-x-1',
                  nationality.preferred === 'P' ? 'font-bold' : ''
                )}
              >
                <Link
                  href={{
                    pathname: '/',
                    query: { nationality: nationality.name },
                  }}
                >
                  {nationality.name}
                </Link>{' '}
                <PreferredBadge term={nationality} /> {/* Moved outside Link */}
              </li>
            ))}
          </ul>
        </div>
      )}
      {ulanSubject.roles && (
        <div className="max-w-xs">
          <h5 className="mb-1 text-sm font-semibold uppercase text-muted-foreground">
            Roles
          </h5>
          <ul className="text-sm">
            {ulanSubject.roles?.map((role: any) => (
              <li
                key={role.displayOrder}
                className={cn(
                  'flex flex-wrap items-center gap-x-1',
                  role.preferred === 'P' ? 'font-bold' : ''
                )}
              >
                <Link href={{ pathname: '/', query: { role: role.name } }}>
                  {role.name}
                </Link>{' '}
                <PreferredBadge term={role} /> {/* Moved outside Link */}
              </li>
            ))}
          </ul>
        </div>
      )}
      {ulanSubject.biographies && (
        <div className="max-w-xl">
          <h5 className="mb-1 text-sm font-semibold uppercase text-muted-foreground">
            Biographies
          </h5>
          <ul className="text-sm">
            {ulanSubject.biographies?.map((biography: any) => (
              <li
                key={biography.bioId}
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
    </>
  );
}

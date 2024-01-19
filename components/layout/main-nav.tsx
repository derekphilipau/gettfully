'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getDictionary } from '@/dictionaries/dictionaries';

import { cn } from '@/lib/utils';
import { Logo } from '@/components/logo';

interface MainNavProps {}

export function MainNav({}: MainNavProps) {
  const pathname = usePathname();
  const basePath = pathname?.split('/')[1];
  const dict = getDictionary();

  return (
    <div className="flex gap-6 md:gap-10">
      <nav
        className="flex gap-6"
        role="navigation"
        aria-label={dict['nav.mainMenu']}
      >
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-xl font-bold"
        >
          <Logo className="h-10 fill-black object-contain dark:fill-white md:mr-2" />
          <span className="inline-block">
            gett<span className="text-muted-foreground">full</span>y
          </span>
        </Link>
        <Link
          href="/ulan"
          className={cn(
            'flex items-center text-lg font-semibold transition-colors',
            basePath === 'ulan'
              ? 'font-bold text-foreground hover:text-foreground/80'
              : 'text-foreground/60 hover:text-foreground/80'
          )}
        >
          ULAN
        </Link>
        <Link
          href="/aat"
          className={cn(
            'flex items-center text-lg font-semibold transition-colors',
            basePath === 'aat'
              ? 'font-bold text-foreground hover:text-foreground/80'
              : 'text-foreground/60 hover:text-foreground/80'
          )}
        >
          AAT
        </Link>
      </nav>
    </div>
  );
}

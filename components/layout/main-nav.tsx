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
          <span className="inline-block">
            <span className="text-foreground">Gett</span>
            <span className="text-neutral-500 dark:text-neutral-400">full</span>
            <span className="text-foreground">y</span>
          </span>
        </Link>
      </nav>
    </div>
  );
}

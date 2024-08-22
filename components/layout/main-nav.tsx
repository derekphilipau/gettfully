import * as React from 'react';
import Link from 'next/link';
import { getDictionary } from '@/dictionaries/dictionaries';

import { GettfullyLogo } from '@/components/gettfully-logo';

interface MainNavProps {}

export function MainNav({}: MainNavProps) {
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
          className="inline-flex items-center space-x-2 text-2xl font-bold"
        >
          <GettfullyLogo />
        </Link>
      </nav>
    </div>
  );
}

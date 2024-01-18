'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getDictionary } from '@/dictionaries/dictionaries';
import type { NavItem } from '@/typesold/nav';

import { cn } from '@/lib/utils';
import { Logo } from '@/components/logo';

interface MainNavProps {
  items?: NavItem[];
}

export function MainNav({ items }: MainNavProps) {
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
          <span className="">{dict['site.title']}</span>
        </Link>
        {items?.map(
          (item, index) =>
            item.href && (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  'flex items-center text-lg font-semibold transition-colors',
                  item.disabled && 'cursor-not-allowed opacity-80',
                  basePath === item.basePath
                    ? 'text-foreground hover:text-foreground/80'
                    : 'text-foreground/60 hover:text-foreground/80'
                )}
              >
                {dict[item.dict]}
              </Link>
            )
        )}
      </nav>
    </div>
  );
}

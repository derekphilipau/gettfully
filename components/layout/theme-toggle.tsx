'use client';

import * as React from 'react';
import { getDictionary } from '@/dictionaries/dictionaries';
import { LaptopIcon, MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ThemeToggle() {
  const dict = getDictionary();
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          aria-label={dict['button.toggleTheme']}
        >
          <SunIcon className="rotate-0 scale-100 transition-all hover:text-neutral-900 dark:-rotate-90 dark:scale-0 dark:text-neutral-400 dark:hover:text-neutral-100" />
          <MoonIcon className="absolute rotate-90 scale-0 transition-all hover:text-neutral-900 dark:rotate-0 dark:scale-100 dark:text-neutral-400 dark:hover:text-neutral-100" />
          <span className="sr-only">{dict['button.toggleTheme']}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" forceMount>
        <DropdownMenuLabel className="text-xs leading-none text-muted-foreground">
          {dict['nav.theme']}
        </DropdownMenuLabel>
        {theme !== 'light' && (
          <DropdownMenuItem onClick={() => setTheme('light')}>
            <SunIcon className="mr-2 size-4" />
            <span>{dict['nav.theme.light']}</span>
          </DropdownMenuItem>
        )}
        {theme !== 'dark' && (
          <DropdownMenuItem onClick={() => setTheme('dark')}>
            <MoonIcon className="mr-2 size-4" />
            <span>{dict['nav.theme.dark']}</span>
          </DropdownMenuItem>
        )}
        {theme !== 'system' && (
          <DropdownMenuItem onClick={() => setTheme('system')}>
            <LaptopIcon className="mr-2 size-4" />
            <span>{dict['nav.theme.system']}</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

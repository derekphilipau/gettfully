import Link from 'next/link';
import { Github } from 'lucide-react';

import { siteConfig } from '@/config/site';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { buttonVariants } from '@/components/ui/button';
import { Logo } from '../logo';
import { LogoGetty } from '../logo_getty';

export function AltNav() {
  const linkClass =
    'text-neutral-700 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100';
  return (
    <>
      <Link
        href="https://www.getty.edu/research/tools/vocabularies/"
        target="_blank"
        rel="noreferrer"
      >
        <div
          className={buttonVariants({
            size: 'sm',
            variant: 'ghost',
            className: linkClass,
          })}
        >
          <LogoGetty className="size-6" />
          <span className="sr-only">Getty</span>
        </div>
      </Link>
      {siteConfig?.links?.github && (
        <Link href={siteConfig.links.github} target="_blank" rel="noreferrer">
          <div
            className={buttonVariants({
              size: 'sm',
              variant: 'ghost',
              className: linkClass,
            })}
          >
            <Github className="size-6" />
            <span className="sr-only">Github</span>
          </div>
        </Link>
      )}
      <Link
        href="https://www.getty.edu/research/tools/vocabularies/"
        target="_blank"
        rel="noreferrer"
      >
        <div
          className={buttonVariants({
            size: 'sm',
            variant: 'ghost',
            className: linkClass,
          })}
        >
          <Logo className="size-6" />
          <span className="sr-only">Musefully</span>
        </div>
      </Link>
      <ThemeToggle />
    </>
  );
}

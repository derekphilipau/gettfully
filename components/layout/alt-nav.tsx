import Link from 'next/link';
import { GithubIcon, InstagramIcon } from 'lucide-react';

import { siteConfig } from '@/config/site';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { buttonVariants } from '@/components/ui/button';
import { LogoGetty } from '../logo_getty';

export function AltNav() {
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
            className: 'text-neutral-700 dark:text-neutral-400',
          })}
        >
          <LogoGetty className="size-5" />
          <span className="sr-only">Getty</span>
        </div>
      </Link>
      {siteConfig?.links?.github && (
        <Link href={siteConfig.links.github} target="_blank" rel="noreferrer">
          <div
            className={buttonVariants({
              size: 'sm',
              variant: 'ghost',
              className: 'text-neutral-700 dark:text-neutral-400',
            })}
          >
            <GithubIcon className="size-5" />
            <span className="sr-only">Github</span>
          </div>
        </Link>
      )}
      {siteConfig?.links?.instagram && (
        <Link
          href={siteConfig.links.instagram}
          target="_blank"
          rel="noreferrer"
        >
          <div
            className={buttonVariants({
              size: 'sm',
              variant: 'ghost',
              className: 'text-neutral-700 dark:text-neutral-400',
            })}
          >
            <InstagramIcon className="size-5" />
            <span className="sr-only">Instagram</span>
          </div>
        </Link>
      )}
      <ThemeToggle />
    </>
  );
}

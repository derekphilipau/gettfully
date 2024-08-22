import { Github } from 'lucide-react';

import { siteConfig } from '@/config/site';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { Logo } from '../logo';
import { LogoGetty } from '../logo_getty';
import { TooltipButton } from './tooltip-button';

export function AltNav() {
  const linkClass =
    'text-neutral-700 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100';

  return (
    <>
      <TooltipButton
        href="https://www.getty.edu/research/tools/vocabularies/"
        icon={LogoGetty}
        label="Getty"
        tooltip="Getty Vocabularies"
        className={linkClass}
      />
      {siteConfig?.links?.github && (
        <TooltipButton
          href={siteConfig.links.github}
          icon={Github}
          label="Github"
          tooltip="View source code on GitHub"
          className={linkClass}
        />
      )}
      <TooltipButton
        href="https://musefully.org"
        icon={Logo}
        label="Musefully"
        tooltip="Musefully"
        className={linkClass}
      />
      <ThemeToggle />
    </>
  );
}

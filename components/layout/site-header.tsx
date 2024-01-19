import { MainNav } from '@/components/layout/main-nav';
import { AltNav } from './alt-nav';

export function SiteHeader() {
  return (
    <header className="top-0 z-40 w-full bg-white dark:bg-neutral-900">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <AltNav />
          </nav>
        </div>
      </div>
    </header>
  );
}

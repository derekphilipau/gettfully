import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface TooltipButtonProps {
  href: string;
  icon: React.ElementType;
  label: string;
  tooltip?: string;
  className?: string;
}

export function TooltipButton({
  href,
  icon: Icon,
  label,
  tooltip,
  className,
}: TooltipButtonProps) {
  const linkContent = (
    <div
      className={buttonVariants({
        size: 'sm',
        variant: 'ghost',
        className: className,
      })}
    >
      <Icon className="size-6" />
      <span className="sr-only">{label}</span>
    </div>
  );

  return (
    <Link href={href} target="_blank" rel="noreferrer">
      {tooltip ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
            <TooltipContent>
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        linkContent
      )}
    </Link>
  );
}

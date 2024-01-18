export interface NavItem {
  dict: string;
  basePath?: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
}

/**
 * Represents the site configuration.
 */
export interface SiteConfig {
  defaultLocale: string; // Default locale for the site.  Currently only en supported.
  mainNav: NavItem[]; // List of nav items
  links?: {
    // List of secondary/social links
    github?: string;
    twitter?: string;
    instagram?: string;
  };
}

/**
 * The site configuration.  Defines all ingesters, RSS feeds, and nav items.
 */
export const siteConfig: SiteConfig = {
  defaultLocale: 'en',
  mainNav: [],
  links: {
    github: 'https://github.com/derekphilipau/gettfully',
  },
};

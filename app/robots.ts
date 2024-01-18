import { MetadataRoute } from 'next';

const hostname = 'https://getty.musefully.org';
const sitemap = `${hostname}/sitemap.xml`;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // disallow: '/private/',
    },
    sitemap,
  };
}

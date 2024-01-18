import { MetadataRoute } from 'next';

const hostname = 'https://getty.musefully.org';
const now = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${hostname}`,
      lastModified: now,
    },
  ];
}

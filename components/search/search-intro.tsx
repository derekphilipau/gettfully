import Link from 'next/link';

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export function SearchIntro() {
  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Getty ULAN & AAT Search</CardTitle>
      </CardHeader>
      <CardContent>
        Search the Getty{' '}
        <Link href="https://www.getty.edu/research/tools/vocabularies/ulan/">
          Union List of Artist Names (ULAN)
        </Link>{' '}
        and{' '}
        <Link href="https://www.getty.edu/research/tools/vocabularies/aat/">
          Art & Architecture Thesaurus (AAT)
        </Link>
        .
      </CardContent>
    </Card>
  );
}

import Link from 'next/link';

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export function SearchIntro() {
  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Getty ULAN & AAT Search</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>
          Search the Getty{' '}
          <Link href="https://www.getty.edu/research/tools/vocabularies/ulan/">
            Union List of Artist Names (ULAN)
          </Link>{' '}
          and{' '}
          <Link href="https://www.getty.edu/research/tools/vocabularies/aat/">
            Art & Architecture Thesaurus (AAT)
          </Link>
          .
        </p>
        <h3 className="text-xl font-semibold leading-none tracking-tight">
          Search Tips
        </h3>
        <ul className="ml-4 list-disc">
          <li>
            <em>Simple Search:</em> Enter a term like &quot;picasso&quot;,
            &quot;pottery&quot;, etc.
          </li>
          <li>
            <em>Subject ID:</em> Enter an ID like &quot;500009666&quot;.
            Searching for &quot;500009&quot; finds all IDs starting with
            &quot;500009&quot;
          </li>
          <li>
            Check &quot;ULAN&quot; or &quot;AAT&quot; to limit search to
            specific vocabulary.
          </li>
          <li>Click the filter icon to refine search.</li>
        </ul>
      </CardContent>
    </Card>
  );
}

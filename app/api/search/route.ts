import { NextResponse } from 'next/server';

import { search } from '@/lib/elasticsearch/api/search';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const params = Object.fromEntries(searchParams.entries());

  const sanitizedParams = {
    query: searchParams.get('query') || '',
    gender: searchParams.get('gender') || '',
    nationality: searchParams.get('nationality') || '',
  };

  try {
    const result = await search(sanitizedParams);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

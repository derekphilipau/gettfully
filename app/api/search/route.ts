import { NextResponse } from 'next/server';
import type { ApiSearchParams } from '@/types';

import { search } from '@/lib/elasticsearch/api/search';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const params = Object.fromEntries(searchParams.entries());

  const sanitizedParams: ApiSearchParams = {
    query: searchParams.get('query') || '',
    gender: searchParams.get('gender') || '',
    nationality: searchParams.get('nationality') || '',
  };
  const startYear = parseInt(searchParams.get('startYear') || '');
  const endYear = parseInt(searchParams.get('endYear') || '');
  if (!isNaN(startYear)) {
    sanitizedParams.startYear = startYear;
  }
  if (!isNaN(endYear)) {
    sanitizedParams.endYear = endYear;
  }

  try {
    const result = await search(sanitizedParams);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

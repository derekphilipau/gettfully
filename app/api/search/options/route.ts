import { NextResponse } from 'next/server';
import type { ApiSearchResponse } from '@/types';

import { options, OPTIONS_PAGE_SIZE } from '@/lib/elasticsearch/api/options';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const field = searchParams.get('field');
  const query = searchParams.get('query');
  const size = parseInt(searchParams.get('size') || '') || OPTIONS_PAGE_SIZE;

  if (!field)
    return NextResponse.json(
      { error: 'index and field are required' },
      { status: 400 }
    );

  try {
    const result: ApiSearchResponse = await options(field, query, size);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

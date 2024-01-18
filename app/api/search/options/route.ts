import { NextResponse } from 'next/server';
import type { ApiSearchResponse } from '@/types';

import { options } from '@/lib/elasticsearch/api/options';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const field = searchParams.get('field');
  const query = searchParams.get('query');

  if (!field)
    return NextResponse.json(
      { error: 'index and field are required' },
      { status: 400 }
    );

  try {
    const result: ApiSearchResponse = await options(field, query);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

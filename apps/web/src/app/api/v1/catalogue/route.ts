import { NextResponse } from 'next/server';
import { listPublishedProducts } from '@/lib/catalogue/repository';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || undefined;
  const collection = searchParams.get('collection') || undefined;
  const search = searchParams.get('search') || undefined;

  try {
    const products = await listPublishedProducts({ category, collection, search });
    
    return NextResponse.json(
      {
        success: true,
        data: products,
        meta: { count: products.length },
      },
      {
        headers: {
          'Access-Control-Allow-Origin': process.env.ALLOWED_FRONTEND_ORIGIN || '*',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'CATALOGUE_FETCH_FAILED',
          message: error.message || 'Failed to fetch catalogue products',
        },
      },
      { status: 500 }
    );
  }
}

export function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': process.env.ALLOWED_FRONTEND_ORIGIN || '*',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

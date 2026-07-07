import { NextRequest, NextResponse } from 'next/server';

export function checkErpAuth(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  
  const token = authHeader.split(' ')[1];
  const validToken = process.env.ERP_API_KEY;
  
  if (!validToken || token !== validToken) {
    return false;
  }
  
  return true;
}

export function buildErrorResponse(message: string, status: number = 401) {
  return NextResponse.json({
    success: false,
    message
  }, { status });
}

export function buildSuccessResponse(data: any[], totalCount?: number) {
  return NextResponse.json({
    success: true,
    message: "Success",
    count: data.length,
    total: totalCount,
    results: data
  });
}

export function applyPaginationAndFiltering(
  req: NextRequest, 
  data: any[], 
  dateField: string = 'created_at'
) {
  const { searchParams } = new URL(req.url);
  
  // Filtering
  const status = searchParams.get('status');
  if (status) {
    data = data.filter(item => item.status === status);
  }

  const after = searchParams.get('after');
  if (after) {
    const afterDate = new Date(after).getTime();
    data = data.filter(item => {
      const itemDate = new Date(item[dateField]).getTime();
      return itemDate > afterDate;
    });
  }

  // Sort newest first
  data.sort((a, b) => {
    return new Date(b[dateField]).getTime() - new Date(a[dateField]).getTime();
  });

  // Pagination
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '50', 10);
  const skip = (page - 1) * limit;

  const paginatedData = data.slice(skip, skip + limit);

  return {
    results: paginatedData,
    total: data.length
  };
}

export function logIntegrationAccess(req: NextRequest, endpoint: string, status: number) {
  const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown';
  console.log(`[Integration API] ${new Date().toISOString()} | ${ip} | ${req.method} ${endpoint} | ${status}`);
}

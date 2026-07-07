import { NextRequest, NextResponse } from 'next/server';
import { checkErpAuth, buildErrorResponse, logIntegrationAccess } from '../utils';

export async function GET(req: NextRequest) {
  if (!checkErpAuth(req)) {
    logIntegrationAccess(req, '/api/integrations/health', 401);
    return buildErrorResponse('Unauthorized');
  }

  logIntegrationAccess(req, '/api/integrations/health', 200);
  
  return NextResponse.json({
    success: true,
    service: "PREPOC Website Integration API",
    version: "1.0.0",
    status: "healthy"
  });
}

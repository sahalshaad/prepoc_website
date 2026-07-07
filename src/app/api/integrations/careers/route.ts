import { NextRequest } from 'next/server';
import path from 'path';
import { readData } from '@/lib/dataStore';
import { checkErpAuth, buildErrorResponse, buildSuccessResponse, applyPaginationAndFiltering, logIntegrationAccess } from '../utils';
import { JobVacancy } from '@/types/admin';

export async function GET(req: NextRequest) {
  if (!checkErpAuth(req)) {
    logIntegrationAccess(req, '/api/integrations/careers', 401);
    return buildErrorResponse('Unauthorized');
  }

  try {
    const dataPath = path.join(process.cwd(), 'src', 'data', 'careersData.json');
    const dataJson = await readData(dataPath, { VACANCIES: [] });
    const vacancies = (dataJson.VACANCIES || []) as JobVacancy[];

    // Only return active (published) careers
    const publishedVacancies = vacancies.filter(v => v.isActive);

    const { results, total } = applyPaginationAndFiltering(req, publishedVacancies, 'createdAt');

    logIntegrationAccess(req, '/api/integrations/careers', 200);
    return buildSuccessResponse(results, total);
  } catch (err) {
    console.error('Failed to fetch careers for integration API:', err);
    logIntegrationAccess(req, '/api/integrations/careers', 500);
    return buildErrorResponse('Internal Server Error', 500);
  }
}

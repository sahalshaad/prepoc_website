import { NextRequest } from 'next/server';
import path from 'path';
import { readData } from '@/lib/dataStore';
import { checkErpAuth, buildErrorResponse, buildSuccessResponse, applyPaginationAndFiltering, logIntegrationAccess } from '../utils';
import { JobApplication } from '@/types/admin';

export async function GET(req: NextRequest) {
  if (!checkErpAuth(req)) {
    logIntegrationAccess(req, '/api/integrations/job-applications', 401);
    return buildErrorResponse('Unauthorized');
  }

  try {
    const dataPath = path.join(process.cwd(), 'src', 'data', 'jobApplicationsData.json');
    const dataJson = await readData(dataPath, { APPLICATIONS: [] });
    const applications = (dataJson.APPLICATIONS || []) as JobApplication[];

    // Map to API response standard
    const mappedApplications = applications.map(app => ({
      id: app.id,
      applicant_name: app.name,
      email: app.email,
      phone: app.phone || null,
      applied_position: app.jobTitle,
      resume_url: app.resumeUrl || null,
      status: app.status,
      created_at: app.submittedAt,
      updated_at: app.updatedAt
    }));

    const { results, total } = applyPaginationAndFiltering(req, mappedApplications, 'created_at');

    logIntegrationAccess(req, '/api/integrations/job-applications', 200);
    return buildSuccessResponse(results, total);
  } catch (err) {
    console.error('Failed to fetch job applications for integration API:', err);
    logIntegrationAccess(req, '/api/integrations/job-applications', 500);
    return buildErrorResponse('Internal Server Error', 500);
  }
}

import { NextRequest } from 'next/server';
import path from 'path';
import { readData } from '@/lib/dataStore';
import { checkErpAuth, buildErrorResponse, buildSuccessResponse, applyPaginationAndFiltering, logIntegrationAccess } from '../utils';
import { ContactLead } from '@/types/admin';

export async function GET(req: NextRequest) {
  if (!checkErpAuth(req)) {
    logIntegrationAccess(req, '/api/integrations/contact-submissions', 401);
    return buildErrorResponse('Unauthorized');
  }

  try {
    const dataPath = path.join(process.cwd(), 'src', 'data', 'leadsData.json');
    const dataJson = await readData(dataPath, { LEADS: [] });
    const leads = (dataJson.LEADS || []) as ContactLead[];

    // Map to API response standard
    const mappedLeads = leads.map(lead => ({
      id: lead.id,
      full_name: lead.name,
      email: lead.email,
      phone: lead.phone || null,
      company: lead.company || null,
      subject: lead.serviceInterested || null,
      message: lead.message || null,
      status: lead.status,
      created_at: lead.submittedAt
    }));

    const { results, total } = applyPaginationAndFiltering(req, mappedLeads, 'created_at');

    logIntegrationAccess(req, '/api/integrations/contact-submissions', 200);
    return buildSuccessResponse(results, total);
  } catch (err) {
    console.error('Failed to fetch contact submissions for integration API:', err);
    logIntegrationAccess(req, '/api/integrations/contact-submissions', 500);
    return buildErrorResponse('Internal Server Error', 500);
  }
}

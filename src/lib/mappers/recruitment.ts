import { JobVacancy } from '@/types/admin';

export const mapERPJobToWebsiteJob = (erpJob: any): JobVacancy => {
  return {
    id: erpJob.slug, // Map slug to id for frontend reference
    title: erpJob.title || '',
    department: erpJob.department_name || 'General',
    location: erpJob.location || 'Remote',
    type: formatEmploymentType(erpJob.employment_type),
    description: erpJob.description || '',
    requirements: erpJob.requirements || '',
    responsibilities: '', // Not in current ERP model, fallback
    benefits: '', // Not in current ERP model, fallback
    salaryRange: '',
    createdAt: new Date().toISOString(), // Fallback if not provided by ERP
    isActive: true
  };
};

const formatEmploymentType = (type: string) => {
  const map: Record<string, string> = {
    'FULL_TIME': 'Full Time',
    'PART_TIME': 'Part Time',
    'CONTRACT': 'Contract',
    'INTERNSHIP': 'Internship'
  };
  return map[type] || type || 'Full Time';
};

export const parseFullName = (fullName: string) => {
  const parts = fullName.trim().split(' ');
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: '' };
  }
  const firstName = parts[0];
  const lastName = parts.slice(1).join(' ');
  return { firstName, lastName };
};

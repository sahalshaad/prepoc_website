import { JobVacancySchema } from './src/lib/schemas';

const payload = {
  title: 'Software Engineer',
  department: 'Web Development',
  location: 'Remote',
  type: 'Full-time',
  description: 'This is a long enough description to pass validation',
  requirements: 'Must know React\nMust know TypeScript',
  responsibilities: '',
  benefits: '',
  isActive: true
};

const processedPayload = {
  ...payload,
  requirements: typeof payload.requirements === 'string' ? payload.requirements.split('\n').filter(Boolean) : payload.requirements,
  responsibilities: typeof payload.responsibilities === 'string' ? payload.responsibilities.split('\n').filter(Boolean) : payload.responsibilities,
  benefits: typeof payload.benefits === 'string' ? payload.benefits.split('\n').filter(Boolean) : payload.benefits,
};

const result = JobVacancySchema.safeParse(processedPayload);
if (!result.success) {
  console.log(JSON.stringify(result.error.errors, null, 2));
} else {
  console.log("Validation passed!");
}

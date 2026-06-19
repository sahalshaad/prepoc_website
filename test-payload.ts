import { JobVacancySchema } from './src/lib/schemas';

const form = {
  title: 'Test Title',
  department: 'Web Development',
  location: 'Remote',
  type: 'Full-time',
  description: 'Test description goes here',
  requirements: 'Requirement 1\nRequirement 2',
  responsibilities: '',
  benefits: '',
  isActive: true,
};

const payload = {
  ...form,
  requirements: typeof form.requirements === 'string' ? form.requirements.split('\n').filter(Boolean) : form.requirements,
  responsibilities: typeof form.responsibilities === 'string' ? form.responsibilities.split('\n').filter(Boolean) : form.responsibilities,
  benefits: typeof form.benefits === 'string' ? form.benefits.split('\n').filter(Boolean) : form.benefits,
}

const result = JobVacancySchema.safeParse(payload);
if (!result.success) {
  console.log("Validation Failed:", JSON.stringify(result.error.issues, null, 2));
} else {
  console.log("Validation Succeeded!");
}

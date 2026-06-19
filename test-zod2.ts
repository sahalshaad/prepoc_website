import { JobVacancySchema } from './src/lib/schemas';

const result = JobVacancySchema.safeParse({});
if (!result.success) {
  console.log("has errors:", !!result.error.errors);
  console.log("has issues:", !!result.error.issues);
  console.log("keys:", Object.keys(result.error));
}

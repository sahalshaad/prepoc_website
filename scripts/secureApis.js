const fs = require('fs');
const path = require('path');

const files = [
  'src/app/api/upload/route.ts',
  'src/app/api/admin/leads/route.ts',
  'src/app/api/admin/search-index/route.ts',
  'src/app/api/admin/media/route.ts',
  'src/app/api/admin/services/route.ts',
  'src/app/api/admin/portfolio/route.ts',
  'src/app/api/admin/team/route.ts',
  'src/app/api/admin/careers/route.ts',
  'src/app/api/admin/blog/[id]/route.ts',
  'src/app/api/admin/blog/route.ts',
  'src/app/api/admin/job-applications/route.ts',
  'src/app/api/admin/about/route.ts',
  'src/app/api/admin/departments/route.ts'
];

for (const file of files) {
  const filePath = path.join(process.cwd(), file);
  if (!fs.existsSync(filePath)) continue;

  let content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes('requireAdmin')) continue;

  // Add import
  const importStatement = "import { requireAdmin } from '@/lib/admin/auth'\n";
  content = importStatement + content;

  // Replace function declarations to inject requireAdmin()
  content = content.replace(
    /export async function (GET|POST|PUT|DELETE|PATCH)\([^)]*\)\s*\{/g,
    (match) => {
      return match + "\n  try { await requireAdmin(); } catch (e) { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }\n";
    }
  );

  // If NextResponse isn't imported, we need to import it
  if (!content.includes('import { NextResponse }')) {
    if (content.includes('NextResponse')) {
       // it's used somewhere else, likely already imported or next/server is imported
       if (!content.includes('next/server')) {
         content = "import { NextResponse } from 'next/server'\n" + content;
       }
    } else {
       content = "import { NextResponse } from 'next/server'\n" + content;
    }
  }

  fs.writeFileSync(filePath, content);
  console.log(`Secured ${file}`);
}

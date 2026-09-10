import { PrismaClient } from "@prisma/client";
import * as XLSX from "xlsx";
import path from "path";

const db = new PrismaClient();

type CollegeRow = {
  District: string;
  "College Name": string;
  State: string;
};

function readCollegesFromExcel(): {
  name: string;
  city: string | null;
  state: string | null;
}[] {
  const filePath = path.join(process.cwd(), "prisma", "colleges.xlsx");
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<CollegeRow>(sheet);

  return rows
    .filter((row) => row["College Name"]?.toString().trim())
    .map((row) => ({
      name: row["College Name"].toString().trim(),
      city: row["District"]?.toString().trim() || null,
      state: row["State"]?.toString().trim() || null,
    }));
}

async function main() {
  const colleges = readCollegesFromExcel();
  console.log(`Found ${colleges.length} colleges in Excel...`);

  let created = 0;

  for (const college of colleges) {
    await db.college.upsert({
      where: { name: college.name },
      update: { isOther: false },
      create: {
        name: college.name,
        city: college.city,
        state: college.state,
        isActive: true,
        isOther: false,
      },
    });
    created++;
  }

  await db.college.upsert({
    where: { name: "Other / Not Listed" },
    update: { isOther: true },
    create: {
      name: "Other / Not Listed",
      city: null,
      state: null,
      isActive: true,
      isOther: true,
    },
  });

  console.log(`Done — ${created} colleges seeded.`);
  console.log(`"Other / Not Listed" entry ensured.`);

  await db.seoSettings.upsert({
    where: { id: "global" },
    update: {},
    create: {
      id: "global",
      siteTitleSuffix: "— MDSSC",
      metaDescription: "MDSU-CHARGE — Official Learning Platform of MDSSC",
      robotsIndex: true,
    },
  });
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());

CREATE UNIQUE INDEX "one_active_faculty_per_college"
  ON "users" ("collegeId")
  WHERE "role" = 'FACULTY'
    AND "isActive" = true
    AND "collegeId" IS NOT NULL;
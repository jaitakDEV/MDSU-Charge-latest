-- CreateEnum
CREATE TYPE "OpportunityType" AS ENUM ('FULL_TIME_JOB', 'INTERNSHIP', 'APPRENTICESHIP', 'FREELANCE', 'WALK_IN_DRIVE', 'CAMPUS_HIRING', 'PART_TIME');

-- CreateEnum
CREATE TYPE "WorkMode" AS ENUM ('ONSITE', 'REMOTE', 'HYBRID');

-- CreateEnum
CREATE TYPE "DurationType" AS ENUM ('PERMANENT', 'FIXED', 'PROJECT_BASED', 'EVENT');

-- CreateEnum
CREATE TYPE "DurationUnit" AS ENUM ('WEEKS', 'MONTHS', 'YEARS');

-- CreateEnum
CREATE TYPE "EducationLevel" AS ENUM ('ANY', 'DIPLOMA', 'GRADUATE', 'POSTGRADUATE');

-- CreateEnum
CREATE TYPE "CompensationType" AS ENUM ('PAID', 'UNPAID', 'NEGOTIABLE');

-- CreateEnum
CREATE TYPE "ListingStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'PUBLISHED', 'CLOSED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ListingApprovalStatus" AS ENUM ('PENDING_REVIEW', 'APPROVED', 'REJECTED', 'REVISION_NEEDED');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW_SCHEDULED', 'INTERVIEWED', 'OFFERED', 'OFFER_ACCEPTED', 'OFFER_REJECTED', 'REJECTED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "CompanyApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "CompanyType" AS ENUM ('COMPANY', 'STARTUP', 'NGO', 'INSTITUTE', 'FREELANCER', 'RECRUITER');

-- CreateEnum
CREATE TYPE "CompanySize" AS ENUM ('STARTUP_1_10', 'SMALL_11_50', 'MEDIUM_51_200', 'LARGE_201_500', 'ENTERPRISE_500_PLUS');

-- CreateEnum
CREATE TYPE "AlertFrequency" AS ENUM ('INSTANT', 'DAILY', 'WEEKLY');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('TEXT', 'YES_NO', 'MCQ', 'NUMBER');

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'JOB_PROVIDER';

-- CreateTable
CREATE TABLE "company_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "companyType" "CompanyType" NOT NULL,
    "industry" TEXT NOT NULL,
    "website" TEXT,
    "logoUrl" TEXT,
    "description" TEXT,
    "companySize" "CompanySize" NOT NULL,
    "headquarters" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'India',
    "contactPerson" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "contactPhone" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "approvalStatus" "CompanyApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "approvedById" TEXT,
    "approvedAt" TIMESTAMP(3),
    "rejectedReason" TEXT,
    "linkedinUrl" TEXT,
    "glassdoorUrl" TEXT,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_listings" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "opportunityType" "OpportunityType" NOT NULL,
    "description" TEXT NOT NULL,
    "responsibilities" TEXT[],
    "requirements" TEXT[],
    "skills" TEXT[],
    "workMode" "WorkMode" NOT NULL,
    "location" TEXT,
    "state" TEXT,
    "compensationType" "CompensationType" NOT NULL,
    "salaryMin" INTEGER,
    "salaryMax" INTEGER,
    "stipendMin" INTEGER,
    "stipendMax" INTEGER,
    "projectBudget" INTEGER,
    "isSalaryDisclosed" BOOLEAN NOT NULL DEFAULT true,
    "durationType" "DurationType" NOT NULL,
    "durationValue" INTEGER,
    "durationUnit" "DurationUnit",
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "walkInDate" TIMESTAMP(3),
    "walkInTime" TEXT,
    "walkInVenue" TEXT,
    "targetColleges" TEXT[],
    "targetBatchYears" INTEGER[],
    "certificateOffered" BOOLEAN NOT NULL DEFAULT false,
    "ppoOffered" BOOLEAN NOT NULL DEFAULT false,
    "minCgpa" DOUBLE PRECISION,
    "educationLevel" "EducationLevel",
    "educationStream" TEXT,
    "minExperienceYears" INTEGER NOT NULL DEFAULT 0,
    "maxExperienceYears" INTEGER,
    "genderPreference" TEXT NOT NULL DEFAULT 'Any',
    "openings" INTEGER NOT NULL DEFAULT 1,
    "applicationDeadline" TIMESTAMP(3),
    "applicationCount" INTEGER NOT NULL DEFAULT 0,
    "status" "ListingStatus" NOT NULL DEFAULT 'DRAFT',
    "approvalStatus" "ListingApprovalStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "approvedById" TEXT,
    "approvedAt" TIMESTAMP(3),
    "rejectedReason" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_listings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_career_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "headline" TEXT,
    "summary" TEXT,
    "currentCity" TEXT,
    "currentState" TEXT,
    "availableFrom" TIMESTAMP(3),
    "preferredWorkMode" "WorkMode",
    "skills" TEXT[],
    "languages" TEXT[],
    "resumeUrl" TEXT,
    "resumeKey" TEXT,
    "resumeUpdatedAt" TIMESTAMP(3),
    "isProfileVisible" BOOLEAN NOT NULL DEFAULT true,
    "isOpenToWork" BOOLEAN NOT NULL DEFAULT true,
    "completionPercent" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_career_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_education" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "fieldOfStudy" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "collegeId" TEXT,
    "startYear" INTEGER NOT NULL,
    "endYear" INTEGER,
    "isCurrently" BOOLEAN NOT NULL DEFAULT false,
    "cgpa" DOUBLE PRECISION,
    "percentage" DOUBLE PRECISION,
    "achievements" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "student_education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_experience" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "employmentType" TEXT NOT NULL,
    "location" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "isCurrently" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "skills" TEXT[],
    "displayOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "student_experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_projects" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "technologies" TEXT[],
    "liveUrl" TEXT,
    "repoUrl" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "displayOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "student_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_certifications" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "issuingOrg" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL,
    "expiryDate" TIMESTAMP(3),
    "credentialId" TEXT,
    "credentialUrl" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "student_certifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_applications" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "coverLetter" TEXT,
    "resumeUrl" TEXT NOT NULL,
    "resumeKey" TEXT,
    "portfolioUrl" TEXT,
    "expectedSalary" INTEGER,
    "noticePeriod" INTEGER,
    "availableFrom" TIMESTAMP(3),
    "screeningAnswers" JSONB,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'APPLIED',
    "statusUpdatedAt" TIMESTAMP(3),
    "statusNote" TEXT,
    "interviewDate" TIMESTAMP(3),
    "interviewMode" TEXT,
    "interviewLink" TEXT,
    "isShortlisted" BOOLEAN NOT NULL DEFAULT false,
    "isStarred" BOOLEAN NOT NULL DEFAULT false,
    "companyNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_preferences" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "preferredTypes" "OpportunityType"[],
    "preferredRoles" TEXT[],
    "preferredLocations" TEXT[],
    "preferredWorkMode" "WorkMode",
    "minSalary" INTEGER,
    "preferredIndustries" TEXT[],
    "isAlertEnabled" BOOLEAN NOT NULL DEFAULT true,
    "alertFrequency" "AlertFrequency" NOT NULL DEFAULT 'DAILY',

    CONSTRAINT "job_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saved_jobs" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saved_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "screening_questions" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "type" "QuestionType" NOT NULL,
    "options" TEXT[],
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "screening_questions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "company_profiles_userId_key" ON "company_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "company_profiles_slug_key" ON "company_profiles"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "job_listings_slug_key" ON "job_listings"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "student_career_profiles_userId_key" ON "student_career_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "job_applications_listingId_profileId_key" ON "job_applications"("listingId", "profileId");

-- CreateIndex
CREATE UNIQUE INDEX "job_preferences_profileId_key" ON "job_preferences"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "saved_jobs_listingId_profileId_key" ON "saved_jobs"("listingId", "profileId");

-- AddForeignKey
ALTER TABLE "company_profiles" ADD CONSTRAINT "company_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_listings" ADD CONSTRAINT "job_listings_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_career_profiles" ADD CONSTRAINT "student_career_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_education" ADD CONSTRAINT "student_education_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "student_career_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_experience" ADD CONSTRAINT "student_experience_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "student_career_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_projects" ADD CONSTRAINT "student_projects_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "student_career_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_certifications" ADD CONSTRAINT "student_certifications_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "student_career_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "job_listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "student_career_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_preferences" ADD CONSTRAINT "job_preferences_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "student_career_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_jobs" ADD CONSTRAINT "saved_jobs_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "job_listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_jobs" ADD CONSTRAINT "saved_jobs_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "student_career_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "screening_questions" ADD CONSTRAINT "screening_questions_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "job_listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

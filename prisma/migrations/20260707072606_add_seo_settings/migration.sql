-- CreateTable
CREATE TABLE "seo_settings" (
    "id" TEXT NOT NULL DEFAULT 'global',
    "siteTitleSuffix" TEXT NOT NULL DEFAULT '— MDSSC',
    "metaDescription" TEXT NOT NULL DEFAULT '',
    "ogImage" TEXT,
    "googleAnalyticsId" TEXT,
    "searchConsoleVerify" TEXT,
    "robotsIndex" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "seo_settings_pkey" PRIMARY KEY ("id")
);

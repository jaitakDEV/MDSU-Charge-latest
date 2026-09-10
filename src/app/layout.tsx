// import type { Metadata, Viewport } from "next";
// import { AuthSessionProvider } from "@/components/shared/session-provider";
// import { Toaster } from "@/components/ui/sonner";
// import { NetworkStatus } from "@/components/shared/network-status";
// import { LoaderProvider } from "@/components/shared/loader-provider";
// import "./globals.css";
// // layout.tsx ke top pe add karo
// import "@uploadthing/react/styles.css";

// export const metadata: Metadata = {
//   title: "MDSU Charge",
//   description: "The all-in-one platform to manage your business smarter.",
// };

// export const viewport: Viewport = {
//   width: "device-width",
//   initialScale: 1,
//   maximumScale: 1,
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body style={{ margin: 0, padding: 0 }}>
//         <LoaderProvider />
//         <AuthSessionProvider>{children}</AuthSessionProvider>
//         <Toaster richColors position="top-right" />
//         <NetworkStatus />
//       </body>
//     </html>
//   );
// }

import type { Metadata, Viewport } from "next";
import { unstable_cache } from "next/cache";
import { AuthSessionProvider } from "@/components/shared/session-provider";
import { Toaster } from "@/components/ui/sonner";
import { NetworkStatus } from "@/components/shared/network-status";
import { LoaderProvider } from "@/components/shared/loader-provider";
import { db } from "@/server/db";
import "./globals.css";
import "@uploadthing/react/styles.css";

export const metadata: Metadata = {
  title: "MDSU Charge",
  description: "The all-in-one platform to manage your business smarter.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

// Cached fetch — DB ko har request pe hit nahi karega, revalidate har 60 sec mein hoga.
// Isse root layout fast rahega aur DB par load kam padega.
const getSeoSettings = unstable_cache(
  async () => {
    try {
      return await db.seoSettings.findUnique({ where: { id: "global" } });
    } catch (error) {
      console.error("[RootLayout] Failed to fetch SEO settings:", error);
      return null;
    }
  },
  ["global-seo-settings"],
  { revalidate: 60, tags: ["seo-settings"] },
);

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const seo = await getSeoSettings();

  return (
    <html lang="en">
      <head>
        {/* Search Console verification */}
        {seo?.searchConsoleVerify && (
          <meta
            name="google-site-verification"
            content={seo.searchConsoleVerify}
          />
        )}

        {/* Robots */}
        {seo && !seo.robotsIndex && (
          <meta name="robots" content="noindex, nofollow" />
        )}

        {/* Google Analytics (GA4) */}
        {seo?.googleAnalyticsId && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${seo.googleAnalyticsId}`}
            />
            <script
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${seo.googleAnalyticsId}', { anonymize_ip: true });
                `,
              }}
            />
          </>
        )}
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        <LoaderProvider />
        <AuthSessionProvider>{children}</AuthSessionProvider>
        <Toaster richColors position="top-right" />
        <NetworkStatus />
      </body>
    </html>
  );
}

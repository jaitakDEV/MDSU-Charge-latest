export const APP_NAME = "My SaaS App";

export const ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  verifyEmail: "/verify-email",

  // Student
  dashboard: "/dashboard",
  profile: "/dashboard/profile",
  settings: "/dashboard/settings",

  // Faculty
  faculty: "/faculty",
  facultyStudents: "/faculty/students",
  facultyProfile: "/faculty/profile",
  facultySettings: "/faculty/settings",

  // CMS Editor
  cms: "/cms",
  cmsProfile: "/cms/profile",
  cmsSettings: "/cms/settings",

  // Admin
  admin: "/admin",
  adminUsers: "/admin/users",
  adminProfile: "/admin/profile",
  adminSettings: "/admin/settings",
  adminFaculty: "/admin/faculty",
  adminColleges: "/admin/colleges",
  adminCmsEditors: "/admin/cms-editors",
  adminStudents: "/admin/students",

  //V3 Public
  courses: "/courses",
  courseDetail: (slug: string) => `/courses/${slug}`,
  courseCheckout: (slug: string) => `/courses/${slug}/checkout`,
  courseSuccess: (slug: string) => `/courses/${slug}/success`,
  categories: "/categories",
  categoryDetail: (slug: string) => `/categories/${slug}`,

  //V3 Student Dashboard
  myCourses: "/dashboard/my-courses",
  coursePlayer: (slug: string) => `/dashboard/courses/${slug}`,
  certificates: "/dashboard/certificates",
  orders: "/dashboard/orders",

  //V3 CMS
  cmsCourses: "/cms/courses",
  cmsCoursesNew: "/cms/courses/new",
  cmsCourseEdit: (id: string) => `/cms/courses/${id}/edit`,
  cmsCurriculum: (id: string) => `/cms/courses/${id}/curriculum`,
  cmsBanners: "/cms/banners",
  cmsBlog: "/cms/blog",
  cmsAnnouncements: "/cms/announcements",
  cmsSeo: "/cms/seo",

  //V3 Admin
  adminCourses: "/admin/courses",
  adminCourseDetail: (id: string) => `/admin/courses/${id}`,
  adminEnrolments: "/admin/enrolments",
  adminCategories: "/admin/categories",
  adminOrders: "/admin/orders",
  adminRevenue: "/admin/revenue",
  adminRefunds: "/admin/refunds",
  adminCoupons: "/admin/coupons",

  //V4 Public
  events: "/events",
  eventDetail: (slug: string) => `/events/${slug}`,
  eventsPost: "/events/past",
  news: "/news",
  newsDetail: (slug: string) => `/news/${slug}`,

  //V4 Dashboard
  myEvents: "/dashboard/my-events",

  //V4 CMS
  cmsEvents: "/cms/events",
  cmsEventsNew: "/cms/events/new",
  cmsEventEdit: (id: string) => `/cms/events/${id}/edit`,
  cmsEventRegs: (id: string) => `/cms/events/${id}/registrations`,
  cmsNews: "/cms/news",
  cmsNewsNew: "/cms/news/new",
  cmsNewsEdit: (id: string) => `/cms/news/${id}/edit`,

  //V4 Admin
  adminEvents: "/admin/events",
  adminEventRegs: "/admin/event-registrations",
  adminEventRegistrations: (id: string) => `/admin/events/${id}/registrations`,

  //V5 Public
  jobs: "/jobs",
  jobDetail: (slug: string) => `/jobs/${slug}`,
  internships: "/jobs/internships",
  walkInDrives: "/jobs/walk-in",
  campusHiring: "/jobs/campus",
  companies: "/companies",
  companyDetail: (slug: string) => `/companies/${slug}`,
  employerRegister: "/jobs/employer/register",

  //V5 Student Dashboard
  career: "/dashboard/career",
  careerEdit: "/dashboard/career/edit",
  careerResume: "/dashboard/career/resume",
  careerPreferences: "/dashboard/career/preferences",
  applications: "/dashboard/applications",
  applicationDetail: (id: string) => `/dashboard/applications/${id}`,
  savedJobs: "/dashboard/saved-jobs",

  //V5 Job Provider
  provider: "/provider",
  providerCompany: "/provider/company",
  providerListings: "/provider/listings",
  providerListingsNew: "/provider/listings/new",
  providerListingEdit: (id: string) => `/provider/listings/${id}/edit`,
  providerListingApps: (id: string) => `/provider/listings/${id}/applications`,
  providerProfile: "/provider/profile",
  providerSettings: "/provider/settings",
  providerPending: "/provider/pending",

  //V5 CMS
  cmsJobs: "/cms/jobs",
  cmsJobReview: (id: string) => `/cms/jobs/${id}/review`,
  cmsCompanies: "/cms/companies",
  cmsCompanyReview: (id: string) => `/cms/companies/${id}/review`,

  //V5 Admin
  adminJobs: "/admin/jobs",
  adminProviders: "/admin/providers",
  adminApplications: "/admin/applications",
  adminJobAnalytics: "/admin/job-analytics",
} as const;

export const USER_ROLES = {
  STUDENT: "STUDENT",
  FACULTY: "FACULTY",
  CMS_EDITOR: "CMS_EDITOR",
  ADMIN: "ADMIN",
} as const;

export const TOKEN_EXPIRY = {
  passwordReset: 1 * 60 * 60 * 1000,
  emailVerification: 24 * 60 * 60 * 1000,
  session: 30 * 24 * 60 * 60,
} as const;

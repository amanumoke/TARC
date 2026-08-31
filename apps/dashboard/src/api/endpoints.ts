export const endpoints = {
  auth: {
    login: '/auth/login',
    me: '/auth/me',
  },
  dashboard: {
    metrics: '/admin/dashboard/metrics',
  },
  departments: {
    list: '/departments/admin',
    byId: (id: string) => `/departments/admin/${id}`,
  },
  staff: {
    list: '/staff/admin',
    byId: (id: string) => `/staff/admin/${id}`,
  },
  programs: {
    list: '/research/admin/programs',
    byId: (id: string) => `/research/admin/programs/${id}`,
  },
  projects: {
    list: '/research/admin/projects',
    byId: (id: string) => `/research/admin/projects/${id}`,
  },
  publications: {
    list: '/publications/admin',
    byId: (id: string) => `/publications/admin/${id}`,
  },
  news: {
    list: '/communication/admin/news',
    byId: (id: string) => `/communication/admin/news/${id}`,
  },
  events: {
    list: '/communication/admin/events',
    byId: (id: string) => `/communication/admin/events/${id}`,
  },
  gallery: {
    list: '/communication/admin/gallery',
    byId: (id: string) => `/communication/admin/gallery/${id}`,
  },
  vehicles: {
    list: '/operations/admin/vehicles',
    byId: (id: string) => `/operations/admin/vehicles/${id}`,
    status: (id: string) => `/operations/admin/vehicles/${id}/status`,
  },
  assignments: {
    list: '/operations/admin/assignments',
    status: (id: string) => `/operations/admin/assignments/${id}/status`,
  },
  messages: {
    list: '/operations/admin/messages',
    unread: '/operations/admin/messages/unread',
    byId: (id: string) => `/operations/admin/messages/${id}`,
  },
  settings: '/admin/settings',
  profile: '/admin/profile',
  profilePassword: '/admin/profile/password',
} as const;

const API_ENDPOINTS = {
    GET_ALL_PROGRAM_DONATION: "/api/v1/program-donations",
    GET_PROGRAM_DONATION_BY_ID: (id: string) => `/api/v1/program-donations/${id}`,
    UPDATE_PROGRAM_DONATION_BY_ID: (id: string) => `/api/v1/program-donations/${id}`,
    DELETE_PROGRAM_DONATION_BY_ID: (id: string) => `/api/v1/program-donations/${id}`,
    CREATE_PROGRAM_DONATION: "/api/v1/program-donations",

    DASHBOARD: "/api/v1/dashboard-donations",
    DONATUR: "/api/v1/donations-user",
    CHART_DATA: "/api/v1/donations-chart",
    NOTIFIKASI: "/api/v1/donations-notifikasi",


    
    GET_ALL_ACTIVITY: "/api/v1/activities",
    GET_ACTIVITY_BY_ID: (id: string) => `/api/v1/activities/${id}`,
    UPDATE_ACTIVITY_BY_ID: (id: string) => `/api/v1/activities/${id}`,
    DELETE_ACTIVITY_BY_ID: (id: string) => `/api/v1/activities/${id}`,
    CREATE_ACTIVITY: "/api/v1/activities",

    GET_ALL_USER: "/api/v1/users",
    CREATE_USER: "/api/v1/users",
    GET_USER_BY_ID: (id: string) => `/api/v1/users/${id}`,
    UPDATE_USER_BY_ID: (id: string) => `/api/v1/users/${id}`,
    DELETE_USER_BY_ID: (id: string) => `/api/v1/users/${id}`,

    DONASI: "/api/v1/donations",
    GET_DONATION_BY_ID: (id: string) => `/api/v1/program-donations/${id}`, // Perbaikan di sini
    GET_DONATION_BY_PROGRAM_ID: (id: string) => `/api/v1/donations-program/${id}`,
    GET_NOTIFIKASI_BY_ID: (id: string) => `/api/v1/donations-notifikasi-id/${id}`,

    LOGIN: "/api/v1/admin/login",
};

export default API_ENDPOINTS;

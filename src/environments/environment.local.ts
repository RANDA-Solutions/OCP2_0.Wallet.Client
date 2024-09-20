const baseUrl = "http://localhost:44392";
export const environment = {
    name: "[default]",
    siteShortName: "KY LER Wallet",
    production: false,
    debug: true,
    errorMessageLife: 3000,
    httpDelay: 0,
    apiEndPoint: `${baseUrl}/api/`,
    publicEndPoint: `${baseUrl}/public/`,
    baseUrl: baseUrl,
    secureRoutes: [`${baseUrl}/api`],
    allowSelfEmailConfirmation: true,
    logoutTimer: 5, // in minutes
};

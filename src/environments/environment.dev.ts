const baseUrl = "https://teacher-wallet-dev.azurewebsites.net";
export const environment = {
    name: "[default]",
    siteShortName: "KY LER Wallet",
    production: true,
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

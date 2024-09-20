const baseUrl = "https://teacherwallet.local.randasolutions.com";
export const environment = {
    name: "[default]",
    siteShortName: "KY LER Wallet",
    production: true,
    debug: false,
    errorMessageLife: 3000,
    httpDelay: 0,
    apiEndPoint: `${baseUrl}/api/`,
    publicEndPoint: `${baseUrl}/public/`,
    baseUrl: baseUrl,
    secureRoutes: [`${baseUrl}/api`],
    allowSelfEmailConfirmation: true,
    logoutTimer: 1, // in minutes
};

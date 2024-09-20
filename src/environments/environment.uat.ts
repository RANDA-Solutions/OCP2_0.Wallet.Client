const baseUrl = "https://teacher-wallet-uat.azurewebsites.net";
export const environment = {
    name: "[default]",
    siteShortName: "KY LER Wallet",
    production: true,
    cookieDomain: `${baseUrl.replace("https://", "")}`,
    debug: false,
    errorMessageLife: 3000,
    httpDelay: 0,
    apiEndPoint: `${baseUrl}/api/`,
    publicEndPoint: `${baseUrl}/public/`,
    baseUrl: baseUrl,
    secureRoutes: [`${baseUrl}/api`],
    allowSelfEmailConfirmation: true,
    logoutTimer: 10, // in minutes
};

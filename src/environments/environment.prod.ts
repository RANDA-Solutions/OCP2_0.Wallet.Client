export const environment = {
    name: "[default]",
    siteShortName: "KY LER Wallet",
    production: eval("#{production}#"),
    cookieDomain: "#{cookieDomain}#",
    debug: eval("#{debug}#"),
    errorMessageLife: 3000,
    httpDelay: 0,
    apiEndPoint: "https://#{apiHostname}#/api/",
    publicEndPoint: "https://#{apiHostname}#/public/",
    baseUrl: "https://#{apiHostname}#",
    secureRoutes: ["https://#{apiHostname}#/api"],
    allowSelfEmailConfirmation: eval("#{allowSelfEmailConfirmation}#"),
    logoutTimer: 10, // in minutes
    posthogApiKey: "#{posthogApiKey}#",
    posthogApiHost: "https://us.i.posthog.com",
};

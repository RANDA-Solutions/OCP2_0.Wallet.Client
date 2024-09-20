import { APP_BASE_HREF, CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { CoreModule } from "@core/core.module";
import { environment } from "@environment/environment";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgIdleModule } from "@ng-idle/core";
import { NgcCookieConsentConfig, NgcCookieConsentModule } from "ngx-cookieconsent";
import { LoggerModule, NgxLoggerLevel } from "ngx-logger";
import { AppRouterModule } from "./app.router";
import { AppComponent } from "./app.component";
import { LoginLayoutComponent } from "./components/layout/login-layout/login-layout.component";
import { PlainLayoutComponent } from "./components/layout/plain-layout/plain-layout.component";
import { PublicFooterComponent } from "./components/layout/public-layout/public-footer/public-footer.component";
import { PublicLayoutComponent } from "./components/layout/public-layout/public-layout.component";
import { PublicNavComponent } from "./components/layout/public-layout/public-nav/public-nav.component";
import { SecureLayoutComponent } from "./components/layout/secure-layout/secure-layout.component";
import { SiteFooterComponent } from "./components/layout/site-footer/site-footer.component";
import { NavMenuComponent } from "./components/nav-menu/nav-menu.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

export const cookieConfig: NgcCookieConsentConfig = {
    cookie: {
        domain: `${environment.cookieDomain}`, // it is mandatory to set a domain, for cookies to work properly (see https://goo.gl/S2Hy2A) overridden in appcomponent
        secure: true,
    },
    position: "bottom-left",
    palette: {
        popup: {
            background: "#FF9E1B",
            text: "#003B5C",
        },
        button: {
            background: "#003B5C",
            text: "#FFFFFF",
        },
        highlight: {
            background: "#003B5C",
            text: "#FFFFFF",
        },
    },
    revokable: false,
    theme: "classic",
    type: "opt-out",
    elements: {
        allow: '<a aria-label="accept cookies" tabindex="0" class="cc-btn cc-allow" value="yes">Accept</a>',
        deny: '<a aria-label="decline cookies" tabindex="0" class="cc-btn cc-deny" value="no">Decline</a>',
        messagelink: `
  <span id="cookieconsent:desc" class="cc-message">{{message}}
    <a aria-label="learn more about our privacy policy" tabindex="1" class="cc-link" href="{{privacyPolicyHref}}" target="_blank" rel="noopener">{{privacyPolicyLink}}</a>.
  </span>
  `,
    },
    content: {
        message:
            "This website stores cookies on your computer. These cookies are used to collect information about how you interact with our website and allow us to remember you. We use this information to improve and customize your browsing experience and for analytics and metrics about our visitors both on this website and other media. To find out more about the cookies we use, see our ",
        privacyPolicyLink: "Privacy Policy",
        privacyPolicyHref: `${environment.baseUrl}/public/privacy`,
    },
};
@NgModule({
    declarations: [
        AppComponent,
        SiteFooterComponent,
        PlainLayoutComponent,
        SecureLayoutComponent,
        LoginLayoutComponent,
        PublicLayoutComponent,
        NavMenuComponent,
        PublicNavComponent,
        PublicFooterComponent,
    ],
    imports: [
        CommonModule,
        CoreModule,
        BrowserModule,
        FormsModule,
        NgbModule,
        ReactiveFormsModule,
        FontAwesomeModule,
        HttpClientModule,
        LoggerModule.forRoot({
            serverLoggingUrl: "/api/clientlog/ngxlogger",
            level: NgxLoggerLevel.DEBUG,
            serverLogLevel: NgxLoggerLevel.ERROR,
        }),
        NgIdleModule.forRoot(),
        NgcCookieConsentModule.forRoot(cookieConfig),

        AppRouterModule, // Keep me last !!!
    ],
    providers: [{ provide: APP_BASE_HREF, useValue: "/" }],
    bootstrap: [AppComponent],
})
export class AppModule {
    private debug = false;

    constructor() {}
}

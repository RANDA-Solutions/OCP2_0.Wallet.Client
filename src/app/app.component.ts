import { Component, HostListener, OnDestroy, OnInit } from "@angular/core";
import { NavigationEnd, Event as NavigationEvent, NavigationStart, Router } from "@angular/router";
import { AuthService } from "@auth/auth.service";
import { AppService } from "@core/services/app.service";
import { TimeoutService } from "@core/services/timeout.service";
import { environment } from "@environment/environment";
import { AccessService } from "@modules/access/services/access.service";
import { Idle } from "@ng-idle/core";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { NgcCookieConsentConfig, NgcCookieConsentService } from "ngx-cookieconsent";
import posthog from "posthog-js";
import { Subscription } from "rxjs";
import { protectedRoutes } from "./app.router";

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

@UntilDestroy()
@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit, OnDestroy {
    title = "Open Credential Publisher Learning & Employment Wallet";
    envName = environment.name;

    private footerSettingsSubscription: Subscription;
    private navigationEventsSubscription: Subscription;
    private currentUrl: string;
    private debug = false;

    constructor(
        public appService: AppService,
        private ccService: NgcCookieConsentService,
        private idle: Idle,
        private timeoutService: TimeoutService,
        private accessService: AccessService,
        private authService: AuthService,
        private router: Router
    ) {}

    ngOnInit() {
        if (this.debug) console.log("AppComponent Environment: ", environment);

        try
        {
            if (!!environment.posthogApiKey) {
                posthog.init(environment.posthogApiKey, {
                    api_host: environment.posthogApiHost,
                    autocapture: true,
                    person_profiles: "identified_only",
                    capture_pageview: false,
                    capture_pageleave: true,
                });
            }
        }
        catch(e)
        {
            console.error('Error in posthog:init', e);
        }

        this.navigationEventsSubscription = this.router.events.subscribe((event: NavigationEvent) => {
            if (event instanceof NavigationStart) {
                this.currentUrl = event.url;
            } else if (event instanceof NavigationEnd) {
                if (!!environment.posthogApiKey) {
                    posthog.capture("$pageview");
                }
            }
        });

        if (this.debug) console.log(`AppComponent initConsentListeners`);
        this.initConsentListeners(); //does nothing for now...

        this.footerSettingsSubscription = this.appService.footerSettings$.subscribe(settings => {
            let cookieConsentConfig = {
                ...this.ccService.getConfig(),
                cookie: { domain: environment.cookieDomain },
                content: {
                    ...this.ccService.getConfig().content,
                    privacyPolicyHref: settings?.privacyPolicyUrl,
                },
            };

            if (this.debug) console.log("AppComponent set consentcookie", cookieConsentConfig);
            this.ccService.destroy(); // Remove previous cookie bar (if any)
            this.ccService.init(cookieConsentConfig); // Initialize with the updated config
        });

        this.timeoutService.initialize();

        this.idle.onTimeout.pipe(untilDestroyed(this)).subscribe(e => {
            this.accessService.signOut("Your session timed out, please login again.");
        });

        //this.authService.clearStaleStorage();

        this.authService.silentRenewError.pipe(untilDestroyed(this)).subscribe(ev => {
            if (this.debug) {
                console.log(`Current url is ${this.currentUrl} and silent renew error is ${ev}`);
            }
            if (protectedRoutes.test(this.currentUrl)) {
                this.accessService.signOut();
            }
        });
        this.authService.checkLogin();
    }

    @HostListener("login_required")
    onLoginRequired() {
        if (this.debug) console.log("onLoginRequired event caught");
        if (protectedRoutes.test(this.currentUrl)) {
            this.accessService.signOut();
        }
    }

    ngOnDestroy() {
        if (this.navigationEventsSubscription) {
            this.navigationEventsSubscription.unsubscribe();
        }

        if (this.footerSettingsSubscription) {
            this.footerSettingsSubscription.unsubscribe();
        }
    }

    initConsentListeners() {
        // // subscribe to cookieconsent observables to react to main events
        // this.popupOpenSubscription = this.ccService.popupOpen$.subscribe(
        //   () => {
        //     // you can use this.ccService.getConfig() to do stuff...
        //   });
        // this.popupCloseSubscription = this.ccService.popupClose$.subscribe(
        //   () => {
        //     // you can use this.ccService.getConfig() to do stuff...
        //   });
        // this.initializeSubscription = this.ccService.initialize$.subscribe(
        //   (event: NgcInitializeEvent) => {
        //     if (this.debug) console.log(`AppComponent NgcInitializeEvent: `);
        //     // you can use this.ccService.getConfig() to do stuff...
        //   });
        // this.statusChangeSubscription = this.ccService.statusChange$.subscribe(
        //   (event: NgcStatusChangeEvent) => {
        //     // you can use this.ccService.getConfig() to do stuff...
        //   });
        // this.revokeChoiceSubscription = this.ccService.revokeChoice$.subscribe(
        //   () => {
        //     // you can use this.ccService.getConfig() to do stuff...
        //   });
        // this.noCookieLawSubscription = this.ccService.noCookieLaw$.subscribe(
        // (event: NgcNoCookieLawEvent) => {
        //   // you can use this.ccService.getConfig() to do stuff...
        // });
    }
}

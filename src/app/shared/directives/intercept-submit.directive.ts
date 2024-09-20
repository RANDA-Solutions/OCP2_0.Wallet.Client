import { Directive, HostListener } from "@angular/core";

@Directive({
    selector: "form[appInterceptSubmit]",
})
export class InterceptSubmitDirective {
    private debug = false;
    @HostListener("submit", ["$event"])
    onSubmit(event: Event) {
        if (this.debug) console.log("InterceptSubmitDirective Form submitted!");
        //event.preventDefault();
    }
}

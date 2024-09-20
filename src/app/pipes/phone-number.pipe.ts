import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "phoneNumber",
})
export class PhoneNumberPipe implements PipeTransform {
    transform(value: string): string {
        if (!value) {
            return "";
        }

        // Remove all non-numeric characters
        const cleaned = ("" + value).replace(/\D/g, "");

        // Check if the input is of correct length
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

        if (match) {
            return "(" + match[1] + ") " + match[2] + "-" + match[3];
        }

        return value;
    }
}

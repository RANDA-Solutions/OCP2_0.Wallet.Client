import { ValidationErrors, ValidatorFn, AbstractControl } from "@angular/forms";

export class CustomValidators {
    static maxLengthConditionalValidator(maxLength: number): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            if (!control.value) {
                // if control is empty return no error
                return null;
            }

            if (control.value.length > maxLength) {
                // If value is present and length is more than maximum, return an error object.
                return { maxLengthConditional: { requiredLength: maxLength, actualLength: control.value.length } };
            }

            // If value is present and length is valid, return null.
            return null;
        };
    }
    static atLeastOneItemValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const formArray = control as any;
            return formArray && formArray.length > 0 ? null : { atLeastOneItem: true };
        };
    }
}

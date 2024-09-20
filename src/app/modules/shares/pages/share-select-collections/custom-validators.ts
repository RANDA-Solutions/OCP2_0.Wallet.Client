import { ValidationErrors, ValidatorFn, AbstractControl } from "@angular/forms";

export class CustomValidators {
    static atLeastOneItemValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const formArray = control as any;
            return formArray && formArray.length > 0 ? null : { atLeastOneItem: true };
        };
    }
}

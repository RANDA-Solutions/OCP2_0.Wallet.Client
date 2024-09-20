import { ValidationErrors, ValidatorFn, AbstractControl } from "@angular/forms";

export class CustomValidators {
    static patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            if (!control.value) {
                // if control is empty return no error
                return null;
            }

            // test the value of the control against the regexp supplied
            const valid = regex.test(control.value);

            // if true, return no error (no error), else return error passed in the second parameter
            return valid ? null : error;
        };
    }

    static passwordMatchValidator(control: AbstractControl) {
        const currentPassword: string = control.get("currentPassword").value; // get password from our password form control
        const newPassword: string = control.get("newPassword").value; // get password from our password form control
        const confirmPassword: string = control.get("confirmPassword").value; // get password from our confirmPassword form control

        if (!!newPassword && !!confirmPassword && !currentPassword) {
            control.get("currentPassword").setErrors({ CurrentPasswordRequired: true });
        }

        // compare is the password math
        if (newPassword !== confirmPassword) {
            // if they don't match, set an error in our confirmPassword form control
            control.get("confirmPassword").setErrors({ NoPassswordMatch: true });
        }
    }

    static phoneValidator(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            if (!control.value) {
                // if control is empty return no error
                return null;
            }
            const phoneRegex = /^[0-9]{10}$/;

            // test the value of the control against the regexp supplied
            const valid = phoneRegex.test(control.value);

            // if true, return no error (no error), else return error passed in the second parameter
            return valid ? null : { InvalidPhoneNumber: true };
        };
    }

    static minLengthConditionalValidator(minLength: number): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            if (!control.value) {
                // if control is empty return no error
                return null;
            }

            if (control.value.length < minLength) {
                // If value is present and length is less than the minimum, return an error object.
                return { minLengthConditional: { requiredLength: minLength, actualLength: control.value.length } };
            }

            // If value is present and length is valid, return null.
            return null;
        };
    }

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

    static fileTypeValidator(validFileTypes: string[]): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            if (!control.value) {
                // if control is empty return no error
                return null;
            }
            const file = control.value as File;
            if (file) {
                const fileType = file.type.toLowerCase();
                if (!validFileTypes.includes(fileType)) {
                    return { InvalidFileType: true };
                }
            }

            return null;
        };
    }

    static fileSizeValidator(maxSize: number): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            if (!control.value) {
                // if control is empty return no error
                return null;
            }
            const file = control.value as File;
            if (file) {
                const isValidSize = file.size <= maxSize;
                if (!isValidSize) {
                    return { InvalidFileSize: true };
                }
            }

            return null;
        };
    }
}

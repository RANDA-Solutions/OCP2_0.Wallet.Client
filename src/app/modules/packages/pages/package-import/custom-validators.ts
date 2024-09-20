import { ValidationErrors, ValidatorFn, AbstractControl } from "@angular/forms";

export class CustomValidators {
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

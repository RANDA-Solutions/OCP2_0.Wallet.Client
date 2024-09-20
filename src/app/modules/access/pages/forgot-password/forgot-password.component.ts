import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccessService } from '@modules/access/services/access.service';
import { ForgotPasswordModel } from '@shared/interfaces/forgot-password.interface';
import { PostResponseModel } from '@shared/interfaces/post-response.interface';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss', '../../access-styles.scss']
})
export class ForgotPasswordComponent implements OnInit {
	submitted = false;
  forgotPasswordForm:ForgotPasswordModel = { email: '' };
  modelErrors = [];
  buttonSpinner = false;

  constructor(private accessServices: AccessService, private router: Router) { }

  ngOnInit(): void {
  }

  forgot({value, valid} : { value: ForgotPasswordModel; valid: boolean}) {
    if (value.email == null || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value.email)) {
      this.modelErrors = [ 'Please enter a valid email.'];
      return;
    }
    this.submitted = true;
		this.modelErrors = [];
		if (valid) {
      this.buttonSpinner = true;
			this.accessServices.forgotPassword(value.email).subscribe((response: PostResponseModel) => {
              if (response.hasError) {
                this.modelErrors = response.errorMessages;
                this.buttonSpinner = false;
              }
              else {
                this.router.navigate(['/access/forgot-password-confirmation']);
              }
            }, (error) => {
              this.buttonSpinner = false;
            });
		}
  }


}

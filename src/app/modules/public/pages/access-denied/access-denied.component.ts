
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '@core/services/app.service';

@Component({
	selector: 'app-access-denied',
	templateUrl: 'access-denied.component.html',
  styleUrls: ['./access-denied.component.scss']
})
export class AccessDeniedComponent implements OnInit {

	constructor(public appService: AppService, private router: Router) {
	}

	ngOnInit() {
	}

	goback() {
    this.router.navigate(['/credentials']);
    // this.router.navigateByUrl(this.appService.previousUrl);
	}
}


import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-unauthorized',
	styleUrls: ['./unauthorized.component.scss'],
	templateUrl: 'unauthorized.component.html'
})
export class UnauthorizedComponent implements OnInit {

	constructor(private location: Location, private router: Router) {

	}

	ngOnInit() {
	}

	login() {
		this.router.navigate(['/access/login']);
	}

	goback() {
		this.location.back();
	}
}

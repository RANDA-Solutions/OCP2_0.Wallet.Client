import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "@auth/auth.service";
import { AppService } from "@core/services/app.service";
import { environment } from "@environment/environment";
import { AccountService } from "@modules/account/account.service";
import { AccessService } from "./services/access.service";

@Component ({
	selector: 'app-access',
  templateUrl: './access.component.html',
  styleUrls: ['./access.component.scss'],
  host: {
    class:'h-100'
  }
})
export class AccessComponent implements OnInit {
  isMenuCollapsed = true;
  showMe = true;
  debugMe = false;
  environment = environment;
  constructor(private accountService: AccountService,
		private appService: AppService,
		private accessService: AccessService,
		private authService: AuthService,
		private router: Router,
		private route: ActivatedRoute) {
	}

	ngOnInit() {
	}
}

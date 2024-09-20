import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-admin-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class AdminLandingComponent implements OnInit {
  private debug = false
  constructor(private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    if (this.debug) console.log(`AdminLandingComponent ngOnInit`) ;
  }

}

import { Component, OnInit } from '@angular/core';
import { AppService } from '@core/services/app.service';

@Component({
  selector: 'app-admin-index',
  templateUrl: './admin-index.component.html',
  styleUrls: ['./admin-index.component.scss']
})
export class AdminIndexComponent implements OnInit {

  constructor(private appService: AppService) { }

  ngOnInit(): void {
  }

}

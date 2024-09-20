import { Component, OnInit } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
	selector: 'app-screen-size',
	templateUrl: './screen-size.component.html',
	styleUrls: ['./screen-size.component.scss']
  })
export class ScreenSizeComponent implements OnInit {
	constructor(private sanitizer: DomSanitizer) {
	}

	ngOnChanges() {}

	ngOnInit() {

	}

}

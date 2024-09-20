import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PackageDeletePopupComponent } from "./package-delete-popup.component";

describe("PackageDeletePopupComponent", () => {
    let component: PackageDeletePopupComponent;
    let fixture: ComponentFixture<PackageDeletePopupComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PackageDeletePopupComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(PackageDeletePopupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

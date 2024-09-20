import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PackageImportComponent } from "./package-import.component";

describe("ImportComponent", () => {
    let component: PackageImportComponent;
    let fixture: ComponentFixture<PackageImportComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PackageImportComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PackageImportComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

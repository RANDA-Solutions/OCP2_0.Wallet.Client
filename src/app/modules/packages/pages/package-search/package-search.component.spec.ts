import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { PackageSearchComponent } from "./package-search.component";

describe("CredentialListComponent", () => {
    let component: PackageSearchComponent;
    let fixture: ComponentFixture<PackageSearchComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PackageSearchComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PackageSearchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

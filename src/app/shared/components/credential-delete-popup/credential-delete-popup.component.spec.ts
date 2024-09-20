import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CredentialDeletePopupComponent } from "./credential-delete-popup.component";

describe("CollectionDeletePopupComponent", () => {
    let component: CredentialDeletePopupComponent;
    let fixture: ComponentFixture<CredentialDeletePopupComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CredentialDeletePopupComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CredentialDeletePopupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

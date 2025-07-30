import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CredentialAssociationPopupComponent } from "./credential-association-popup.component";

describe("CredentialAssociationPopupComponent", () => {
    let component: CredentialAssociationPopupComponent;
    let fixture: ComponentFixture<CredentialAssociationPopupComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CredentialAssociationPopupComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CredentialAssociationPopupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

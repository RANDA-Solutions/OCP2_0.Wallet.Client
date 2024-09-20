import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PublicCredentialCardComponent } from "./credential-card.component";

describe("CredentialCardComponent", () => {
    let component: PublicCredentialCardComponent;
    let fixture: ComponentFixture<PublicCredentialCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PublicCredentialCardComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(PublicCredentialCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

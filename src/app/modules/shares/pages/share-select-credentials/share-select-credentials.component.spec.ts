import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ShareAddCredentialsComponent } from "./share-select-credentials.component";

describe("ShareAddCredentialsComponent", () => {
    let component: ShareAddCredentialsComponent;
    let fixture: ComponentFixture<ShareAddCredentialsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ShareAddCredentialsComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ShareAddCredentialsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

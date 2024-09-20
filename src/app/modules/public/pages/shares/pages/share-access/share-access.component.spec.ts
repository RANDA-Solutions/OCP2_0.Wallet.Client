import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ShareAccessComponent as ShareAccessComponent } from "./share-access.component";

describe("SharesComponent", () => {
    let component: ShareAccessComponent;
    let fixture: ComponentFixture<ShareAccessComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ShareAccessComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ShareAccessComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

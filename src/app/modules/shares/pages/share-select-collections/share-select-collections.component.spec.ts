import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ShareAddCollectionsComponent } from "./share-select-collections.component";

describe("ShareAddCollectionsComponent", () => {
    let component: ShareAddCollectionsComponent;
    let fixture: ComponentFixture<ShareAddCollectionsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ShareAddCollectionsComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ShareAddCollectionsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SharesRoutingModule } from "./shares-routing.module";
import { ShareHistoryComponent } from "./pages/share-history/share-history.component";
import { ShareSelectCollectionsComponent } from "./pages/share-select-collections/share-select-collections.component";
import { ShareSelectCredentialsComponent } from "./pages/share-select-credentials/share-select-credentials.component";
import { ShareAddComponent } from "./pages/share-add/share-add.component";
import { SharedModule } from "@shared/shared.module";
import { ShareService } from "./services/share.service";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

@NgModule({
    declarations: [
        ShareHistoryComponent,
        ShareSelectCollectionsComponent,
        ShareSelectCredentialsComponent,
        ShareAddComponent,
    ],
    imports: [SharedModule, CommonModule, SharesRoutingModule, FontAwesomeModule],
    providers: [ShareService],
})
export class SharesModule {}

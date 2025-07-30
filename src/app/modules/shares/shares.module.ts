import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { SharedModule } from "@shared/shared.module";
import { ShareAddComponent } from "./pages/share-add/share-add.component";
import { ShareHistoryComponent } from "./pages/share-history/share-history.component";
import { ShareSelectCollectionsComponent } from "./pages/share-select-collections/share-select-collections.component";
import { ShareSelectCredentialsComponent } from "./pages/share-select-credentials/share-select-credentials.component";
import { ShareService } from "./services/share.service";
import { SharesRoutingModule } from "./shares-routing.module";

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

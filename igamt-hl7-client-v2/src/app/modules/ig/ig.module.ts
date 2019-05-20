import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { Store, StoreModule } from '@ngrx/store';
import { ContextMenuModule, RadioButtonModule } from 'primeng/primeng';
import { StepsModule } from 'primeng/steps';
import { TableModule } from 'primeng/table';
import { IgListEffects } from 'src/app/root-store/ig/ig-list/ig-list.effects';
import { CreateIgEffects } from '../../root-store/create-ig/create-ig.effects';
import { OpenIgMetadataEditorNode, OpenNarrativeEditorNode } from '../../root-store/ig/ig-edit/ig-edit.actions';
import * as fromIg from '../../root-store/ig/ig.reducer';
import { EditorID } from '../shared/models/editor.enum';
import { IgEditEffects } from './../../root-store/ig/ig-edit/ig-edit.effects';
import { CoreModule } from './../core/core.module';
import { SharedModule } from './../shared/shared.module';
import { CreateIGComponent } from './components/create-ig/create-ig.component';
import { IgEditActiveTitlebarComponent } from './components/ig-edit-active-titlebar/ig-edit-active-titlebar.component';
import { IgEditContainerComponent } from './components/ig-edit-container/ig-edit-container.component';
import { IgEditSidebarComponent } from './components/ig-edit-sidebar/ig-edit-sidebar.component';
import { IgEditTitlebarComponent } from './components/ig-edit-titlebar/ig-edit-titlebar.component';
import { IgEditToolbarComponent } from './components/ig-edit-toolbar/ig-edit-toolbar.component';
import { IgListContainerComponent } from './components/ig-list-container/ig-list-container.component';
import { IgListItemCardComponent } from './components/ig-list-item-card/ig-list-item-card.component';
import { IgMetadataEditorComponent } from './components/ig-metadata-editor/ig-metadata-editor.component';
import { IgSectionEditorComponent } from './components/ig-section-editor/ig-section-editor.component';
import { IgTocComponent } from './components/ig-toc/ig-toc.component';
import { NarrativeSectionFormComponent } from './components/narrative-section-form/narrative-section-form.component';
import { IgRoutingModule } from './ig-routing.module';
import { EditorActionMapToken } from './ig.token';
import { IgEditResolverService } from './services/ig-edit-resolver.service';
import { IgEditorActivateGuard } from './services/ig-editor-activate.guard.';
import { IgEditSaveDeactivateGuard } from './services/ig-editor-deactivate.service';
import { IgListService } from './services/ig-list.service';
import { IgService } from './services/ig.service';

export const EDITOR_MAP = {
  [EditorID.SECTION_NARRATIVE]: OpenNarrativeEditorNode,
  [EditorID.IG_METADATA]: OpenIgMetadataEditorNode,
};

@NgModule({
  declarations: [
    IgListContainerComponent,
    IgListItemCardComponent,
    IgEditContainerComponent,
    IgEditSidebarComponent,
    IgEditToolbarComponent,
    IgEditTitlebarComponent,
    CreateIGComponent,
    IgTocComponent,
    NarrativeSectionFormComponent,
    IgEditActiveTitlebarComponent,
    IgSectionEditorComponent,
    IgMetadataEditorComponent,
  ],
  imports: [
    IgRoutingModule,
    EffectsModule.forFeature([IgListEffects, CreateIgEffects, IgEditEffects]),
    StoreModule.forFeature(fromIg.featureName, fromIg.reducers),
    CoreModule,
    SharedModule,
    StepsModule,
    RadioButtonModule,
    TableModule,
    ContextMenuModule,
  ],
  providers: [
    IgListService,
    IgService,
    IgEditResolverService,
    IgEditSaveDeactivateGuard,
    IgEditorActivateGuard,
    {
      provide: EditorActionMapToken,
      useValue: EDITOR_MAP,
    },
  ],
  exports: [
    IgListContainerComponent,
    IgListItemCardComponent,
    IgEditContainerComponent,
    IgEditSidebarComponent,
    IgEditToolbarComponent,
    IgEditTitlebarComponent,
    IgEditActiveTitlebarComponent,
    IgSectionEditorComponent,
    IgMetadataEditorComponent,
  ],
})
export class IgModule {
}

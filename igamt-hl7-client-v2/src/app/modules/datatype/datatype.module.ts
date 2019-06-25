import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import * as fromDatatypeEdit from 'src/app/root-store/datatype-edit/datatype-edit.reducer';
import { DatatypeEditEffects } from '../../root-store/datatype-edit/datatype-edit.effects';
import { SharedModule } from '../shared/shared.module';
import { DatatypeCrossRefsComponent } from './components/datatype-cross-refs/datatype-cross-refs.component';
import { MetadataEditComponent } from './components/metadata-edit/metadata-edit.component';
import { PostdefEditorComponent } from './components/postdef-editor/postdef-editor.component';
import { PredefEditorComponent } from './components/predef-editor/predef-editor.component';
import { DatatypeRoutingModule } from './datatype-routing.module';
import { DatatypeService } from './services/datatype.service';

@NgModule({
  declarations: [PredefEditorComponent, PostdefEditorComponent, MetadataEditComponent, DatatypeCrossRefsComponent],
  imports: [
    CommonModule,
    DatatypeRoutingModule,
    SharedModule,
    EffectsModule.forFeature([DatatypeEditEffects]),
    StoreModule.forFeature('datatypeEdit', fromDatatypeEdit.reducer),
  ],
  providers: [
    DatatypeService,
    DatatypeEditEffects,
  ],
  exports: [PredefEditorComponent, PostdefEditorComponent],
})
export class DatatypeModule { }

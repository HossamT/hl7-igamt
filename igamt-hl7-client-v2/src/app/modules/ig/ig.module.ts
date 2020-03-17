import { NgModule } from '@angular/core';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ContextMenuModule, RadioButtonModule } from 'primeng/primeng';
import { StepsModule } from 'primeng/steps';
import { TableModule } from 'primeng/table';
import {DocumentModule} from '../document/document.module';
import { ExportConfigurationModule } from '../export-configuration/export-configuration.module';
import { CoreModule } from './../core/core.module';
import { SharedModule } from './../shared/shared.module';
import {IgRoutingModule} from './ig-routing.module';

@NgModule({
  declarations: [

  ],
  imports: [
    IgRoutingModule,
    CoreModule,
    SharedModule,
    StepsModule,
    RadioButtonModule,
    TableModule,
    ColorPickerModule,
    ContextMenuModule,
    ExportConfigurationModule,
    DocumentModule,
  ],
  providers: [

  ],
  exports: [

  ],
})
export class IgModule {
}

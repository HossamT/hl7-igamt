import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { combineLatest, Observable, of, Subscription, throwError } from 'rxjs';
import { catchError, concatMap, flatMap, take, tap } from 'rxjs/operators';
import { MessageService } from 'src/app/modules/dam-framework/services/message.service';
import * as fromDam from 'src/app/modules/dam-framework/store/index';
import { selectSegmentStructureById } from '../../../../root-store/structure-editor/structure-editor.reducer';
import { Type } from '../../../shared/constants/type.enum';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { EditorID } from '../../../shared/models/editor.enum';
import { StructureEditorComponent } from '../../services/structure-editor-component.abstract';
import { StructureEditorService } from '../../services/structure-editor.service';

export interface ISegmentStructureMetadata {
  name: string;
  identifier: string;
  description: string;
  hl7Version: string;
}

@Component({
  selector: 'app-segment-metadata-editor',
  templateUrl: './segment-metadata-editor.component.html',
  styleUrls: ['./segment-metadata-editor.component.scss'],
})
export class SegmentMetadataEditorComponent extends StructureEditorComponent implements OnInit, OnDestroy {

  s_workspace: Subscription;
  formGroup: FormGroup;

  constructor(
    actions$: Actions,
    protected formBuilder: FormBuilder,
    private structureEditorService: StructureEditorService,
    private messageService: MessageService,
    store: Store<any>,
  ) {
    super({
      id: EditorID.CUSTOM_SEGMENT_STRUC_METADATA,
      title: 'Metadata',
      resourceType: Type.SEGMENT,
    }, actions$, store);

    this.s_workspace = this.currentSynchronized$.pipe(
      tap((metadata: ISegmentStructureMetadata) => {
        this.initFormGroup();
        this.formGroup.patchValue(metadata);
        this.formGroup.valueChanges.subscribe((changed) => {
          this.editorChange(changed, this.formGroup.valid);
        });
      }),
    ).subscribe();
  }

  initFormGroup() {
    this.formGroup = this.formBuilder.group({
      name: [''],
      identifier: [''],
      description: [''],
      hl7Version: [''],
    });
  }

  editorDisplayNode(): Observable<IDisplayElement> {
    return this.elementId$.pipe(
      flatMap((id) => {
        return this.store.select(selectSegmentStructureById, { id });
      }),
    );
  }

  onEditorSave(action: fromDam.EditorSave): Observable<Action> {
    return combineLatest(this.elementId$, this.current$).pipe(
      take(1),
      concatMap(([id, current]) => {
        return this.structureEditorService.saveSegmentMetadata(id, current.data).pipe(
          flatMap((message) => {
            return [this.messageService.messageToAction(message), new fromDam.EditorUpdate({ value: current.data, updateDate: false }), new fromDam.SetValue({ selected: current.data })];
          }),
          catchError((error) => throwError(this.messageService.actionFromError(error))),
        );
      }),
    );
  }

  ngOnDestroy(): void {
    this.s_workspace.unsubscribe();
  }

  onDeactivate(): void {
  }

  ngOnInit() {
  }

}

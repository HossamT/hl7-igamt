import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { ICoConstraintGroup } from '../../modules/shared/models/co-constraint.interface';
import { IEditorMetadata } from '../../modules/shared/models/editor.enum';
import { OpenEditorBase } from '../document/document-edit/ig-edit.actions';

export enum CoConstraintGroupEditActionTypes {
  LoadCoConstraintGroup = '[CoConstraintGroupEdit] Load CoConstraints Group',
  LoadCoConstraintGroupSuccess = '[CoConstraintGroupEdit] Load CoConstraints Group Success',
  LoadCoConstraintGroupFailure = '[CoConstraintGroupEdit] Load CoConstraints Group Failure',
  OpenCoConstraintGroupEditor = '[CoConstraintGroupEdit] Open CoConstraints Group Editor',
}

export class LoadCoConstraintGroup implements Action {
  readonly type = CoConstraintGroupEditActionTypes.LoadCoConstraintGroup;
  constructor(readonly id: string) { }
}

export class LoadCoConstraintGroupSuccess implements Action {
  readonly type = CoConstraintGroupEditActionTypes.LoadCoConstraintGroupSuccess;
  constructor(readonly payload: ICoConstraintGroup) { }
}

export class LoadCoConstraintGroupFailure implements Action {
  readonly type = CoConstraintGroupEditActionTypes.LoadCoConstraintGroupFailure;
  constructor(readonly error: HttpErrorResponse) { }
}

export class OpenCoConstraintGroupEditor extends OpenEditorBase implements Action {
  readonly type = CoConstraintGroupEditActionTypes.OpenCoConstraintGroupEditor;
  constructor(readonly payload: {
    id: string,
    editor: IEditorMetadata,
  }) {
    super();
  }
}

export type CoConstraintGroupEditActions =
  LoadCoConstraintGroup
  | LoadCoConstraintGroupSuccess
  | LoadCoConstraintGroupFailure
  | OpenCoConstraintGroupEditor;

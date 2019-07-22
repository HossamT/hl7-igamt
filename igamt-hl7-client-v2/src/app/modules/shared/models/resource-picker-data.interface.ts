import {Observable} from 'rxjs';
import {Scope} from '../constants/scope.enum';
import {Type} from '../constants/type.enum';
import {IDisplayElement} from './display-element.interface';

export interface IResourcePickerData {
  existing?: IDisplayElement[];
  versionChange: (version: string) => void;
  hl7Versions: string[];
  data: Observable<any[]>;
  type: Type;
  title: string;
  version: string;
  scope: Scope;
}

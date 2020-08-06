export interface IChange<T = any> {
  location: string;
  propertyType: PropertyType;
  propertyValue: T;
  oldPropertyValue?: T;
  position?: number;
  changeReason?: IChangeReason;
  changeType: ChangeType;
}

export interface IChangeReason {
  reason: string;
  date: Date;
}

export interface IChangeLog {
  [type: string]: IChangeReason;
}

export enum ChangeType {
  UPDATE = 'UPDATE',
  ADD = 'ADD',
  DELETE = 'DELETE',
}

export enum PropertyType {
  USAGE = 'USAGE',
  DATATYPE = 'DATATYPE',
  SEGMENTREF = 'SEGMENTREF',
  STRUCTSEGMENT = 'STRUCTSEGMENT',
  CARDINALITYMAX = 'CARDINALITYMAX',
  LENGTHMIN = 'LENGTHMIN',
  LENGTHMAX = 'LENGTHMAX',
  LENGTHTYPE = 'LENGTHTYPE',
  FIELD = 'FIELD',
  CONFLENGTH = 'CONFLENGTH',
  CARDINALITYMIN = 'CARDINALITYMIN',
  PREDEF = 'PREDEF',
  POSTDEF = 'POSTDEF',
  VALUESET = 'VALUESET',
  COMMENT = 'COMMENT',
  DEFINITIONTEXT = 'DEFINITIONTEXT',
  EXT = 'EXT',
  DESCRIPTION = 'DESCRIPTION',
  AUTHORNOTES = 'AUTHORNOTES',
  USAGENOTES = 'USAGENOTES',
  CONSTANTVALUE = 'CONSTANTVALUE',
  PREDICATE = 'PREDICATE',
  CODES = 'CODES',
  CODESYSTEM = 'CODESYSTEM',
  EXTENSIBILITY = 'EXTENSIBILITY',
  CONTENTDEFINITION = 'CONTENTDEFINITION',
  STABILITY = 'STABILITY',
  BINDINGIDENTIFIER = 'BINDINGIDENTIFIER',
  URL = 'URL',
  INTENSIONALCOMMENT = 'INTENSIONALCOMMENT',
  STATEMENT = 'STATEMENT',
  SINGLECODE = 'SINGLECODE',
  NAME = 'NAME',
  AUTHORS = 'AUTHORS',
  PROFILETYPE = 'PROFILETYPE',
  ROLE = 'ROLE',
  PROFILEIDENTIFIER = 'PROFILEIDENTIFIER',
  COCONSTRAINTBINDINGS = 'COCONSTRAINTBINDINGS',
  ORGANISATION = 'ORGANISATION',
  DTMSTRUC = 'DTMSTRUC',
  SHORTDESCRIPTION = 'SHORTDESCRIPTION',
}

import { Component, Inject, OnDestroy, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import * as _ from 'lodash';
import { Observable, of, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Type } from '../../constants/type.enum';
import { ConditionalUsageOptions } from '../../constants/usage.enum';
import { AssertionMode, ConstraintType, IAssertionConformanceStatement, IFreeTextConformanceStatement, INotAssertion, IOperatorAssertion, IPath } from '../../models/cs.interface';
import { IPredicate } from '../../models/predicate.interface';
import { IResource } from '../../models/resource.interface';
import { ConformanceStatementService } from '../../services/conformance-statement.service';
import { Hl7V2TreeService } from '../../services/hl7-v2-tree.service';
import { StoreResourceRepositoryService } from '../../services/resource-repository.service';
import { IHL7v2TreeFilter, RestrictionCombinator, RestrictionType } from '../../services/tree-filter.service';
import { CsPropositionComponent } from '../cs-proposition/cs-proposition.component';
import { IHL7v2TreeNode } from '../hl7-v2-tree/hl7-v2-tree.component';
import { BinaryOperator, Pattern, Statement } from '../pattern-dialog/cs-pattern.domain';
import { PatternDialogComponent } from '../pattern-dialog/pattern-dialog.component';
import { IAssertion, IIfThenAssertion } from './../../models/cs.interface';

export type AssertionContainer = IAssertionConformanceStatement | IFreeTextConformanceStatement | IPredicate;

export enum CsTab {
  SIMPLE = 'Simple',
  CONDITIONAL = 'Conditional',
  FREE = 'Free Text',
  COMPLEX = 'Complex',
}

@Component({
  selector: 'app-cs-dialog',
  templateUrl: './cs-dialog.component.html',
  styleUrls: ['./cs-dialog.component.scss'],
})
export class CsDialogComponent implements OnDestroy {

  pattern: Pattern;
  activeTab: CsTab;
  csType = ConstraintType;
  tabType = CsTab;
  cs: AssertionContainer;
  resource: IResource;
  statementsValidity: boolean[];
  backUp: AssertionContainer;
  resourceType: Type;
  title: string;
  hideAdvanced: boolean;
  ifThenPattern: BinaryOperator;
  structure: IHL7v2TreeNode[];
  context: IHL7v2TreeNode[];
  s_resource: Subscription;
  showContext: boolean;
  contextName: string;
  predicateMode: boolean;
  assertionMode: boolean;
  predicateElementId: string;
  excludePaths: string[];
  options = ConditionalUsageOptions;
  contextFilter: IHL7v2TreeFilter = {
    hide: false,
    restrictions: [
      {
        criterion: RestrictionType.TYPE,
        allow: true,
        value: [Type.CONFORMANCEPROFILE, Type.GROUP],
      },
    ],
  };

  @ViewChildren(CsPropositionComponent) propositions: QueryList<CsPropositionComponent>;
  @ViewChild('csForm', { read: NgForm }) form: NgForm;

  constructor(
    private csService: ConformanceStatementService,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private treeService: Hl7V2TreeService,
    public dialogRef: MatDialogRef<CsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public repository: StoreResourceRepositoryService) {
    this.ifThenPattern = new BinaryOperator('D', 'IF-THEN', null, 0);
    this.ifThenPattern.putOne(new Statement('D', 0, null, 0), 0);
    this.ifThenPattern.putOne(new Statement('D', 0, null, 0), 1);

    this.predicateMode = data.predicateMode || data.assertionMode;
    this.assertionMode = data.assertionMode;
    this.title = data.title;
    this.excludePaths = data.excludePaths || [];

    this.predicateElementId = data.predicateElementId;
    if (this.predicateMode && this.predicateElementId) {
      this.excludePaths = [
        ...this.excludePaths,
        this.predicateElementId,
      ];
      this.contextFilter.restrictions.push({
        criterion: RestrictionType.PATH,
        allow: false,
        combine: RestrictionCombinator.ENFORCE,
        value: this.excludePaths.map((path) => {
          return {
            path,
            excludeChildren: true,
          };
        }),
      });
    }

    this.s_resource = data.resource.subscribe(
      (resource: IResource) => {
        this.resourceType = resource.type;
        this.resource = resource;
        this.treeService.getTree(resource, this.repository, true, true, (value) => {
          this.structure = [
            {
              data: {
                id: resource.id,
                pathId: resource.id,
                name: resource.name,
                type: resource.type,
                position: 0,
              },
              children: [...value],
              parent: undefined,
            },
          ];
          this.context = this.structure;

          if (!this.assertionMode) {
            this.conformanceStatement = data.payload;
          } else {
            this.setAssertion(data.assertion, data.context);
          }

        });
      },
    );
  }

  getName(path: IPath): Observable<string> {
    if (!path) {
      return of('');
    }

    return this.treeService.getPathName(this.resource, this.repository, path.child).pipe(
      take(1),
      map((pathInfo) => {
        return this.treeService.getNameFromPath(pathInfo);
      }),
    );
  }

  selectContext(node: IHL7v2TreeNode, path: IPath) {
    if (node.data.type !== Type.CONFORMANCEPROFILE) {
      this.cs.context = path;
      this.cs.level = Type.GROUP;
      this.structure = [
        node,
      ];
      this.getName(path).pipe(
        take(1),
        map((value) => {
          this.contextName = value;
        }),
      ).subscribe();
    } else if (node.data.type === Type.CONFORMANCEPROFILE) {
      this.cs.context = undefined;
      this.structure = [
        node,
      ];
    }
    this.showContext = false;
  }

  selectContextNode(node) {
    this.selectContext(node.node, node.path);
    this.showContext = false;
  }

  setContext(path: IPath) {
    if (path) {
      const node = this.getNode(this.context, path);
      this.selectContext(node, path);
    } else {
      this.selectContext(this.structure[0], path);
    }
  }

  getNode(tree: IHL7v2TreeNode[], path: IPath): IHL7v2TreeNode {
    if (path) {
      const elm = tree.filter((e: IHL7v2TreeNode) => e.data.id === path.elementId);
      if (!elm || elm.length !== 1) {
        return undefined;
      } else {
        if (path.child) {
          return this.getNode(elm[0].children, path.child);
        } else {
          return elm[0];
        }
      }
    }
    return undefined;
  }

  valid() {
    if (!this.form) {
      return false;
    } else if (this.activeTab === CsTab.FREE && this.form) {
      return this.form.valid;
    } else if (this.activeTab !== CsTab.FREE && this.form && this.propositions && this.propositions.length > 0) {
      let statementsValidity = true;
      this.propositions.forEach((p) => {
        statementsValidity = statementsValidity && p.complete();
      });

      return statementsValidity && this.form.valid;
    } else {
      return false;
    }
  }

  set conformanceStatement(cs: AssertionContainer) {
    if (cs) {
      if (cs.type === ConstraintType.ASSERTION) {
        this.pattern = this.csService.getCsPattern((cs as IAssertionConformanceStatement).assertion);
        this.activeTab = this.getTabForPattern(this.pattern);
      } else {
        this.activeTab = CsTab.FREE;
      }
      this.cs = cs;
      this.backUp = _.cloneDeep(cs);
      this.setContext(cs.context);
    } else {
      this.activeTab = undefined;
    }
  }

  setAssertion(assertion: IAssertion, context: IPath) {
    this.cs = {
      identifier: undefined,
      type: undefined,
      assertion: undefined,
      context,
    };

    if (assertion) {
      this.pattern = this.csService.getCsPattern(assertion);
      this.activeTab = this.getTabForPattern(this.pattern);
      this.cs.assertion = assertion;
      this.cs.type = ConstraintType.ASSERTION;
      this.backUp = _.cloneDeep(this.cs);
    }

    this.setContext(context);
  }

  updateAssertionDescription(assertion: IAssertion) {
    switch (assertion.mode) {
      case AssertionMode.ANDOR:
        this.updateOperatorDescription(assertion as IOperatorAssertion);
        break;
      case AssertionMode.IFTHEN:
        this.updateIfThenDescription(assertion as IIfThenAssertion);
        break;
      case AssertionMode.NOT:
        this.updateNotDescription(assertion as INotAssertion);
        break;
      case AssertionMode.SIMPLE:
        assertion.description = assertion.description ? assertion.description : '_';
        break;
    }

  }

  updateOperatorDescription(assertion: IOperatorAssertion) {
    const descriptions = assertion.assertions.map((a) => {
      this.updateAssertionDescription(a);
      return a.description;
    });
    assertion.description = '( ' + descriptions.join(' ' + assertion.operator + ' ') + ' )';
  }

  updateIfThenDescription(assertion: IIfThenAssertion) {
    this.updateAssertionDescription(assertion.ifAssertion);
    this.updateAssertionDescription(assertion.thenAssertion);
    assertion.description = `If ${assertion.ifAssertion.description ? assertion.ifAssertion.description : '_'} then ${assertion.thenAssertion.description ? assertion.thenAssertion.description : '_'}`;
  }

  updateNotDescription(assertion: INotAssertion) {
    this.updateAssertionDescription(assertion.child);
    assertion.description = `NOT ${assertion.child.description}`;
  }

  change() {
    if (this.cs.type === ConstraintType.ASSERTION) {
      this.updateAssertionDescription((this.cs as IAssertionConformanceStatement).assertion);
      if (this.predicateMode) {
        const desc = (this.cs as IAssertionConformanceStatement).assertion.description;
        const noIf = desc && desc.startsWith('If');
        (this.cs as IAssertionConformanceStatement).assertion.description = !noIf ? 'If ' + (this.cs as IAssertionConformanceStatement).assertion.description : desc;
      }
    }
  }

  // tslint:disable-next-line: cognitive-complexity
  changeTab(item: CsTab) {
    this.statementsValidity = [];
    let payload;
    let csTemp;
    switch (item) {
      case CsTab.FREE:
        payload = this.predicateMode ? this.csService.getFreePredicate() : this.csService.getFreeConformanceStatement();
        csTemp = {
          ...this.cs,
          ...payload,
          assertion: undefined,
          identifier: this.cs ? this.cs.identifier : undefined,
          context: this.cs ? this.cs.context : undefined,
        };
        break;
      case CsTab.SIMPLE:
        payload = this.predicateMode ? this.csService.getAssertionPredicate(new Statement('D', 0, null, 0)) : this.csService.getAssertionConformanceStatement(new Statement('D', 0, null, 0));
        csTemp = {
          ...this.cs,
          ...payload.cs,
          identifier: this.cs ? this.cs.identifier : undefined,
          context: this.cs ? this.cs.context : undefined,
          freeText: undefined,
          assertionScript: undefined,
        };
        break;
      case CsTab.CONDITIONAL:
        payload = this.predicateMode ? this.csService.getAssertionPredicate(this.ifThenPattern) : this.csService.getAssertionConformanceStatement(this.ifThenPattern);
        csTemp = {
          ...this.cs,
          ...payload.cs,
          identifier: this.cs ? this.cs.identifier : undefined,
          context: this.cs ? this.cs.context : undefined,
          freeText: undefined,
          assertionScript: undefined,
        };
        break;
      case CsTab.COMPLEX:
        if (this.cs && this.cs.type === ConstraintType.ASSERTION) {
          (this.cs as IAssertionConformanceStatement).assertion.description = '';
        }

        if (this.pattern && this.pattern.assertion) {
          payload = this.predicateMode ? this.csService.getAssertionPredicate(this.pattern.assertion) : this.csService.getAssertionConformanceStatement(this.pattern.assertion);
        }

        csTemp = {
          ...this.cs,
          ...payload ? payload.cs : undefined,
          identifier: this.cs ? this.cs.identifier : undefined,
          context: this.cs ? this.cs.context : undefined,
          freeText: undefined,
          assertionScript: undefined,
        };
        break;
    }
    this.cs = csTemp;
    this.activeTab = item;
  }

  openPatternDialog() {
    const dialogRef = this.dialog.open(PatternDialogComponent, {
      data: {
        condition: this.predicateMode,
        pattern: this.pattern ? this.pattern.clone() : undefined,
      },
    });
    dialogRef.afterClosed().subscribe(
      (answer) => {
        this.pattern = answer;
        if (this.pattern) {
          this.changeTab(this.activeTab);
        }
      },
    );
  }

  public html(str: string) {
    return this.sanitizer.bypassSecurityTrustHtml(str);
  }

  done() {
    this.dialogRef.close(this.cs);
  }

  cancel() {
    this.dialogRef.close();
  }

  reset() {
    this.conformanceStatement = _.cloneDeep(this.backUp);
  }

  getTabForPattern(pattern: Pattern): CsTab {
    if (!pattern || !pattern.assertion) {
      return CsTab.FREE;
    } else if (pattern.assertion instanceof Statement) {
      return CsTab.SIMPLE;
    } else if (pattern.assertion instanceof BinaryOperator && pattern.assertion.data.type === 'IF-THEN' && pattern.assertion.getLeft() instanceof Statement && pattern.assertion.getRight() instanceof Statement) {
      return CsTab.CONDITIONAL;
    } else {
      return CsTab.COMPLEX;
    }
  }

  ngOnDestroy(): void {
    if (this.s_resource) {
      this.s_resource.unsubscribe();
    }
  }

}

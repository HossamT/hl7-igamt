import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { filter, map, takeWhile } from 'rxjs/operators';
import { PropertyType } from 'src/app/modules/shared/models/save-change';
import { Usage } from '../../../../constants/usage.enum';
import { ChangeType } from '../../../../models/save-change';
import { ICardinalityRange } from '../../hl7-v2-tree.component';
import { HL7v2TreeColumnComponent } from '../hl7-v2-tree-column.component';

@Component({
  selector: 'app-cardinality',
  templateUrl: './cardinality.component.html',
  styleUrls: ['./cardinality.component.scss'],
})
export class CardinalityComponent extends HL7v2TreeColumnComponent<ICardinalityRange> implements OnInit {

  range: ICardinalityRange;
  @ViewChild('cardinalityForm') form;
  alive = true;

  @Input()
  usage: string;

  constructor() {
    super([PropertyType.CARDINALITYMAX, PropertyType.CARDINALITYMIN]);
    this.value$.subscribe(
      (value) => {
        this.range = { ...value };
      },
    );
  }

  onInitValue(value: ICardinalityRange): void {
    this.range = { ...value };
  }

  minChange(value: number) {
    this.onChange<number>(this.getInputValue().min, value, PropertyType.CARDINALITYMIN, ChangeType.UPDATE);
  }

  maxChange(value: string) {
    this.onChange<string>(this.getInputValue().max, value, PropertyType.CARDINALITYMAX, ChangeType.UPDATE);
  }

  ngOnInit() {
    this.changeEvent.pipe(
      takeWhile(() => this.alive),
      filter((change) => change.propertyType === PropertyType.USAGE && change.location === this.location),
      map((change) => {
        if (change.propertyValue === Usage.R && this.range && this.range.min === 0) {
          this.range.min = 1;
          this.minChange(1);
        } else if (change.propertyValue === Usage.O && this.range && this.range.min > 0) {
          this.range.min = 0;
          this.minChange(0);
        }
      }),
    ).subscribe();
  }

  convertErrors(min_errors:any, max_errors:any): string[] {
    console.log(this.usage);
    const errors = [];
    for (const property in min_errors.control.errors) {
      if (property === 'required') {
        errors.push('min is required');
        break;
      } else if (min_errors.control.errors[property]) {
        errors.push(min_errors.control.errors[property]);
        break;
      }
    }
    for (const property in max_errors.control.errors) {
      if (property === 'required') {
        errors.push('max is required');
        break;
      } else if (max_errors.control.errors[property]) {
        errors.push(max_errors.control.errors[property]);
        break;
      }
    }
    return errors;
  }
}

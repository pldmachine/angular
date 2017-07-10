import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormControl } from '@angular/forms';

function skuValidator(control: FormControl): { [s: string]: boolean } {
  if (!control.value.match(/^123/)) {
    return { invalidName: true };
  }
}

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  myForm: FormGroup;
  name: AbstractControl;
  sku : string;

  constructor(fb: FormBuilder) {
    this.myForm = fb.group({
      'name': ['', Validators.compose([Validators.required, skuValidator])],
      'sku': ['', Validators.required]
    });

    this.name = this.myForm.controls['name'];

    this.name.valueChanges.subscribe(
      (value: string) => {
        console.log('name changes to:', value);
      }
    )
    this.myForm.valueChanges.subscribe(
      (form: any) => {
        console.log('form changes to:', form);
      }
    )
  }

  ngOnInit() {
  }

  // onSubmit(form: any): void {
  //   console.log(form);
  // }

  onSubmit(value: string): void {
    console.log(value);
  }



}

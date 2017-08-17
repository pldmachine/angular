import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { Product } from '../model/product.model';


@Component({
  selector: 'app-product-row',
  templateUrl: './product-row.component.html',
  styleUrls: ['./product-row.component.css']
})
export class ProductRowComponent implements OnInit {
  @Input() product: Product;
  @Input() a:string;
  @HostBinding('attr.class') cssClass = 'item';
  constructor() { }

  ngOnInit() {
  }

  test():void{
    alert(this.a);
  }

}

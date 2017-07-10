import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../model/product.model';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  private currentProduct: Product;
  @Input() products: Product[];
  @Output() onProductSelected: EventEmitter<Product>;

  constructor() {
    this.onProductSelected = new EventEmitter();
  }

  clicked(product: Product): void {
    this.currentProduct = product;
    this.onProductSelected.emit(product);
  }

  isSelected(product: Product): boolean {
    if (!product || !this.currentProduct) {
      return false;
    }
    return product.sku === this.currentProduct.sku;
  }

  b():string{
    return "123";
  }

   a():void{
    alert("test");
  }


  ngOnInit() {
  }

}

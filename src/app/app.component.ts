import { Component, Inject } from '@angular/core';
import { Product } from './product/model/product.model';
import { UserService } from './product/services/user.service';
import { Http, Response } from '@angular/http';




let newProduct = new Product(
  "Hat",
  'Nice Hat',
  '/assets/images/products/black-hat.jpg',
  ['Men', 'Accessories', 'Hats'],
  19.77
);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  products: Product[];
  userName: string;
  data: Object;
  loading: boolean;

  constructor(private userService: UserService, @Inject('API_URL') private apiUrl: string, private http: Http) {
    this.products = [
      new Product(
        "Hat",
        'Nice Hat',
        '/assets/images/products/black-hat.jpg',
        ['Men', 'Accessories', 'Hats'],
        19.77
      ),
      new Product(
        "Hat2",
        'Nice Hat2',
        '/assets/images/products/black-hat.jpg',
        ['Men', 'Accessories', 'Hats2'],
        19.77
      ),
    ];
  }

  signIn(): void {
    this.userService.setUser({ name: 'Marek' });

    this.userName = this.userService.getUser().name;
    console.log('Username', this.userName);
  }

  makeRequest(): void {
    this.loading = true;
    this.http.request('http://jsonplaceholder.typicode.com/posts/1').subscribe(
      (res: Response)=>
      {
        this.data = res.json();
        this.loading = false;
      }
    );
  }


  productWasSelected(product: Product): void {
    console.log(product);
  }

}


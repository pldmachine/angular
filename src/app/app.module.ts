import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ProductListComponent } from './product/product-list/product-list.component';
import { ProductRowComponent } from './product/product-row/product-row.component';
import { ProductDepartmentComponent } from './product/product-department/product-department.component';
import { PriceDisplayComponent } from './product/price-display/price-display.component';
import { ProductImageComponent } from './product/product-image/product-image.component';
import { ProductFormComponent } from './product/product-form/product-form.component';
import { UserService } from './product/services/user.service';
import { AnalyticsService } from './product/services/analytics.service';
import { Metric, IAnalytics } from './product/services/metric.interface';
import { youTubeSearchInjectables } from "./youtube/youtube-search.injectables"


@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductRowComponent,
    ProductDepartmentComponent,
    PriceDisplayComponent,
    ProductImageComponent,
    ProductFormComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule
  ],
  providers: [
    UserService,
    { provide: 'API_URL', useValue: 'http://sdfd.com' },
    youTubeSearchInjectables,
    {
      provide: AnalyticsService,
      useFactory() {
        const loggingImplementation: IAnalytics = {
          recordEvent: (metric: Metric): void => {
            console.log(metric);
          }
        };
        return new AnalyticsService(loggingImplementation);
      }

    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

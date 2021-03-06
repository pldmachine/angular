import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';


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
import { youTubeSearchInjectables } from "./youtube/youtube-search.injectables";
import { SearchBoxComponent } from './youtube/search-box/search-box.component';
import { SearchResultComponent } from './youtube/search-result/search-result.component';
import { SearchComponent } from './youtube/search/search.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { ArtistComponent } from './spotify/artist/artist.component';
import { AlbumComponent } from './spotify/album/album.component';
import { TrackComponent } from './spotify/track/track.component'
import { SpotifySearchComponent } from './spotify/search/search.component'
import { SpotifyService } from "./spotify/services/spotify.service";
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { LoggedInGuard } from "app/auth/logged-in-guard";
import { AUTH_PROVIDERS } from "app/services/auth.service";
import { MenuComponent } from './layout/menu/menu.component';
import { LoginLinksComponent } from './layout/login-links/login-links.component';

import { AdminModule, routes as childRoutes } from "./admin/admin.module";
import { AdminComponent } from "app/admin/admin.component";
import { ChatNavBarComponent } from './chat/chat-nav-bar/chat-nav-bar.component';
import { ChatThreadsComponent } from './chat/chat-threads/chat-threads.component';
import { ChatWindowComponent } from './chat/chat-window/chat-window.component';
import { ChatPageComponent } from './chat/chat-page/chat-page.component';

import { MessagesService } from "./chat/services/messages.service";
import { UsersService as ChatUsersService } from "./chat/services/users.service";
import { ThreadService } from "./chat/services/threads.service";
import { ChatThreadComponent } from './chat/chat-thread/chat-thread.component';
import { ChatMessageComponent } from './chat/chat-message/chat-message.component';

import { FromNowPipe } from "./chat/pipes/from-now-pipe";

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'contactus', redirectTo: 'contact' },
  { path: 'login', component: LoginComponent },
  { path: 'search', component: SpotifySearchComponent },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [LoggedInGuard],
    children: childRoutes
  }
]

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductRowComponent,
    ProductDepartmentComponent,
    PriceDisplayComponent,
    ProductImageComponent,
    ProductFormComponent,
    SearchBoxComponent,
    SearchResultComponent,
    SearchComponent,
    HomeComponent,
    AboutComponent,
    ContactComponent,
    ArtistComponent,
    AlbumComponent,
    TrackComponent,
    SpotifySearchComponent,
    LoginComponent,
    MenuComponent,
    LoginLinksComponent,
    ChatNavBarComponent,
    ChatThreadsComponent,
    ChatWindowComponent,
    ChatPageComponent,
    ChatThreadComponent,
    ChatMessageComponent,
    FromNowPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AdminModule,
    RouterModule.forRoot(routes),
    NgbModule.forRoot()
  ],
  providers: [
    AUTH_PROVIDERS,
    LoggedInGuard,
    SpotifyService,
    UserService,
    ChatUsersService,
    ThreadService,
    MessagesService,
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

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule, Router, ActivatedRoute } from "@angular/router";
import { DashboardComponent } from "app/admin/dashboard/dashboard.component";
import { AdminComponent } from './admin.component';
import { UsersComponent } from './users/users.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'users', component: UsersComponent },


];


@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [
    DashboardComponent,
    AdminComponent,
    UsersComponent
  ],
  exports: [DashboardComponent, AdminComponent]
})
export class AdminModule { }

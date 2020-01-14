import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MapViewComponent } from './map-view/map-view.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'chats',
    component: MapViewComponent
  },
  {
    path: 'implicit/callback',
    component: LoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

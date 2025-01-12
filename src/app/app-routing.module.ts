import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainScreenComponent } from './components/payments/main-screen/main-screen.component';
import { AddPaymentComponent } from './components/payments/add-payment/add-payment.component';

export const routes: Routes = [
  { path: 'main', component: MainScreenComponent, title: 'Home - Payment list' },
  {
    path: 'add-payment',
    component: AddPaymentComponent,
    title: 'Create - payment record',
  },
  { path: '', redirectTo: '/main', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
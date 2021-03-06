import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AdminGuard} from '../auth/guard/admin.guard';
import {routingConstants} from './shared/constants';

const routes: Routes =
  [
    { path: routingConstants.products,
      canActivate: [AdminGuard],
      loadChildren: () =>
        import('../products/products.module')
          .then(m => m.ProductsModule) },
    {path: routingConstants.welcome,
      loadChildren: () =>
        import('../welcome/welcome.module')
          .then(m => m.WelcomeModule) },
    {path: routingConstants.auth,
      loadChildren: () =>
        import('../auth/auth.module')
          .then(m => m.AuthModule) },
    { path: 'users', canActivate: [AdminGuard], loadChildren: () => import('../users/users.module').then(m => m.UsersModule) },
    { path: '',
      redirectTo: '/welcome',
      pathMatch: 'full' },
    { path: 'cart', canActivate: [AdminGuard],
      loadChildren: () => import('../shopping-chart/shopping-chart.module').then(m => m.ShoppingChartModule) },
    { path: '**',
      redirectTo: '/welcome',
      pathMatch: 'full'  }
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }

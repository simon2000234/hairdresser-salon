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
    { path: '',
      redirectTo: '/welcome',
      pathMatch: 'full' },
  { path: 'users', loadChildren: () => import('../users/users.module').then(m => m.UsersModule) },
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }

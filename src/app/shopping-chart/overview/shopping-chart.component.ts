import {Component, OnDestroy, OnInit} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {Observable, Subscription} from 'rxjs';
import {CartState} from '../shared/cart.state';
import {Cart} from '../shared/cart';
import {GetCart} from '../shared/cart.action';
import {AuthState} from '../../auth/shared/auth.state';
import {AuthUser} from '../../auth/shared/auth-user';
import {UserState} from '../../users/shared/user.state';
import {User} from '../../users/shared/user';
import {GetCurrentUser, GetUser} from '../../users/shared/user.action';
import {Product} from '../../products/shared/product';
import {ProductState} from '../../products/shared/product.state';

@Component({
  selector: 'app-innotech-shopping-chart',
  templateUrl: './shopping-chart.component.html',
  styleUrls: ['./shopping-chart.component.scss']
})
export class ShoppingChartComponent implements OnInit, OnDestroy {

  cart: Cart;
  user: User;
  product: Product;
  subC: Subscription;

  constructor(private store: Store) { }
  @Select(UserState.currentUser)
  user$: Observable<User>;

  @Select(CartState.userCart)
  cart$: Observable<Cart>;

  ngOnInit(): void {
    this.subC = this.user$.subscribe(u => {
      if (u) {
        this.store.dispatch(new GetCart(u.cartId));
      }
    });
    this.store.dispatch(new GetCurrentUser());
  }

  ngOnDestroy(): void {
    this.subC.unsubscribe();
  }

}

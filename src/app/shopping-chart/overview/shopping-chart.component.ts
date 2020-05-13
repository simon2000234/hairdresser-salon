import {Component, OnDestroy, OnInit} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {Observable, Subscription} from 'rxjs';
import {CartState} from '../shared/cart.state';
import {Cart} from '../shared/cart';
import {GetCart, GetProductsInCart} from '../shared/cart.action';
import {UserState} from '../../users/shared/user.state';
import {User} from '../../users/shared/user';
import {GetCurrentUser} from '../../users/shared/user.action';

@Component({
  selector: 'app-innotech-shopping-chart',
  templateUrl: './shopping-chart.component.html',
  styleUrls: ['./shopping-chart.component.scss']
})
export class ShoppingChartComponent implements OnInit, OnDestroy {

  subU: Subscription;
  subPC: Subscription;

  constructor(private store: Store) { }
  @Select(UserState.currentUser)
  user$: Observable<User>;

  @Select(CartState.userCart)
  cart$: Observable<Cart>;

  ngOnInit(): void {
    this.subU = this.user$.subscribe(u => {
      if (u) {
        this.store.dispatch(new GetCart(u.cartId));
      }
    });
    this.store.dispatch(new GetCurrentUser());
    this.subPC = this.cart$.subscribe(c => {
      if (c) {
        this.store.dispatch(new GetProductsInCart());
      }
    });
  }

  ngOnDestroy(): void {
    this.subU.unsubscribe();
    this.subPC.unsubscribe();
  }

}

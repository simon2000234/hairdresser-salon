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
import {GetUser} from '../../users/shared/user.action';

@Component({
  selector: 'app-innotech-shopping-chart',
  templateUrl: './shopping-chart.component.html',
  styleUrls: ['./shopping-chart.component.scss']
})
export class ShoppingChartComponent implements OnInit, OnDestroy {

  cart: Cart;
  authUser: AuthUser;
  user: User;
  subA: Subscription;
  subC: Subscription;
  subU: Subscription;
  constructor(private store: Store) { }
  @Select(AuthState.loggedInUser)
  userAuth$: Observable<AuthUser>;

  @Select(CartState.userCart)
  cart$: Observable<Cart>;

  @Select(UserState.user2update)
  user$: Observable<User>;
  ngOnInit(): void {
    this.subA = this.userAuth$.subscribe(AUser => this.authUser = AUser);
    this.store.dispatch(new GetUser(this.authUser.uid));
    this.subU = this.user$.subscribe(u => this.user = u);
    this.store.dispatch(new GetCart(this.user.cartId));
    this.subC = this.cart$.subscribe(cart => this.cart = cart);
    console.log(this.cart.productInCart);
  }

  ngOnDestroy(): void {
    this.subC.unsubscribe();
    this.subA.unsubscribe();
  }

}

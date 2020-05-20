import {Component, OnDestroy, OnInit} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {Observable, Subscription} from 'rxjs';
import {CartState} from '../shared/cart.state';
import {Cart} from '../shared/cart';
import {GetCart, GetProductsInCart, RemoveProductFromCart} from '../shared/cart.action';
import {UserState} from '../../users/shared/user.state';
import {User} from '../../users/shared/user';
import {GetCurrentUser} from '../../users/shared/user.action';
import {Product} from '../../products/shared/product';

@Component({
  selector: 'app-innotech-shopping-chart',
  templateUrl: './shopping-chart.component.html',
  styleUrls: ['./shopping-chart.component.scss']
})
export class ShoppingChartComponent implements OnInit, OnDestroy {

  subU: Subscription;
  subPC: Subscription;
  subP: Subscription;
  limit = 4;
  cardWidth = 100 / this.limit;
  productsArray: Product[];
  cart: Cart;
  constructor(private store: Store) { }
  @Select(UserState.currentUser)
  user$: Observable<User>;

  @Select(CartState.userCart)
  cart$: Observable<Cart>;

  @Select(CartState.productsInCart)
  productsInCart$: Observable<Product[]>;

  ngOnInit(): void {
    this.subU = this.user$.subscribe(u => {
      if (u) {
        this.store.dispatch(new GetCart(u.cartId));
      }
    });
    this.subPC = this.cart$.subscribe(c => {
      if (c) {
        this.cart = c;
        this.store.dispatch(new GetProductsInCart());
      }
    });
    this.subP = this.productsInCart$.subscribe(pic => {
      if (pic) {
        this.productsArray = pic;
      }
    });
  }

  getAmount(prod: Product): number {
    const index = this.productsArray.indexOf(prod);
    return this.cart.productInCart[index].amount;
  }

  removeProduct(Id: string) {
    this.store.dispatch(new RemoveProductFromCart(Id));
  }

  ngOnDestroy(): void {
    this.subU.unsubscribe();
    this.subPC.unsubscribe();
  }
}

import {Cart} from './cart';
import {Action, Selector, State, StateContext, Store} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {GetCart, GetProductsInCart} from './cart.action';
import {first, switchAll, switchMap, tap} from 'rxjs/operators';
import {CartService} from './cart.service';
import {Product} from '../../products/shared/product';
import {ProductService} from '../../products/shared/product.service';
import {Observable} from 'rxjs';


export class CartStateModel {
  userCart: Cart;
  productsInCart: Array<Product>;
}


@State<CartStateModel>( {
  name: 'carts',
  defaults: {
    userCart: undefined,
    productsInCart: []
  }
})
@Injectable()
export class CartState {
  constructor(private cartService: CartService,
              private productService: ProductService,
              private store: Store) {}

  @Selector()
  static userCart(state: CartStateModel) {
    return state.userCart;
  }

  @Action(GetCart)
  getCart({getState, setState, dispatch}: StateContext<CartStateModel>, action: GetCart) {
    const state = getState();
    return this.cartService
      .getCart(action.id).pipe(
        first(),
        tap(cart => {
          setState({
            ...state,
            userCart: cart
          });
        })
      );
  }

  @Action(GetProductsInCart)
  getProductsInCart({getState, setState}: StateContext<CartStateModel>) {
    return this.store.select(CartState.userCart)
      .pipe(first(), switchMap(c => {
        for (let i = 0; c.productInCart.length > i; i++) {
          const state = getState();
          const array = state.productsInCart;
          this.productService
            .getProduct(c.productInCart[i].productRef)
            .pipe(
              first(),
              tap(prod => {
                array.push(prod);
                setState({
                  ...state,
                  productsInCart: array
                });
              })
            );
        }
        return new Observable<any>();
      })
      );
  }
}


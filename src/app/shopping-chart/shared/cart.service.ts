import {Observable, Subscription} from 'rxjs';
import {first, map} from 'rxjs/operators';
import {AngularFirestore} from '@angular/fire/firestore';
import {Cart} from './cart';
import {Injectable} from '@angular/core';
import {Store} from '@ngxs/store';
import {GetCart} from './cart.action';


@Injectable({
  providedIn: 'root'
})
export class CartService {
  constructor(private fs: AngularFirestore,
              private store: Store) {
  }
  addProductToCart(prodId: string, cartId: string) {
    const cartFromDBDoc = this.fs.doc<Cart>('shopping-carts/' + cartId);
    let cart: Cart;
    return cartFromDBDoc.snapshotChanges()
      .pipe(
        first(),
        map(returned => {
          cart = returned.payload.data() as Cart;
          let wasInCart = false;
          cart.productInCart.forEach((value) => {
            if (value.productRef === prodId) {
              value.amount++;
              wasInCart = true;
            }
          });
          if (!wasInCart) {
            cart.productInCart.push({amount: 1, productRef: prodId});
          }
          return this.fs.doc<Cart>('shopping-carts/' + cartId).set(cart);
        }));
  }

  removeProductFromCart(prodId: string, cartId: string) {
    const cartFromDBDoc = this.fs.doc<Cart>('shopping-carts/' + cartId);
    let cart: Cart;
    return cartFromDBDoc.snapshotChanges()
      .pipe(
        first(),
        map(returned => {
          cart = returned.payload.data() as Cart;
          cart.productInCart.forEach((value) => {
            if (value.productRef === prodId) {
              value.amount--;
              if (value.amount < 1) {
                const index = cart.productInCart.indexOf(value);
                cart.productInCart.splice(index, 1);
              }
            }
          });
          return this.fs.doc<Cart>('shopping-carts/' + cartId).set(cart).then(() => {
            this.store.dispatch(new GetCart(cartId));
          });
        }));
  }

  getCart(cartId: string): Observable<Cart> {
    const cartFromDBDoc = this.fs.doc<Cart>('shopping-carts/' + cartId);
    return cartFromDBDoc.snapshotChanges()
      .pipe(
        map(returned => {
          const cartFromDB = returned.payload.data();
          const cart2return: Cart = {
            productInCart: cartFromDB.productInCart
          };
          return cart2return;
        }));
  }


}


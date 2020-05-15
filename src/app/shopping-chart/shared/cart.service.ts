import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {AngularFirestore} from '@angular/fire/firestore';
import {Cart} from './cart';
import {Injectable} from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class CartService {
  constructor(private fs: AngularFirestore) {
  }
  addProductToCart(prodId: string, cartId: string): Promise<any> {
    const cartFromDBDoc = this.fs.doc<Cart>('shopping-carts/' + cartId);
    let cart: Cart;
    cartFromDBDoc.snapshotChanges()
      .pipe(
        map(returned => {
          cart = returned.payload.data();
        }));
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


import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {AngularFirestore} from '@angular/fire/firestore';
import {Cart} from './cart';
import {Injectable} from '@angular/core';
import {log} from 'util';


@Injectable({
  providedIn: 'root'
})
export class CartService {
  constructor(private fs: AngularFirestore) {
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


import { Injectable } from '@angular/core';
import {from, Observable} from 'rxjs';
import {Product} from './product';
import {AngularFirestore, DocumentChangeAction} from '@angular/fire/firestore';
import {map} from 'rxjs/operators';
import {firestoreConstants, routingConstants} from '../../public/shared/constants';
import {User} from '../../users/shared/user';
import {firestore} from 'firebase';
import * as firebase from "firebase";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  firstDocResponse: any = [];
  lastDocResponse: any = [];
  prevStartAt: any = [];
  pageClickCount = 0;
  productCount = 0;
  perPageLimit = 5;

  constructor(private fs: AngularFirestore) { }
  createProduct(product: Product): Observable<Product> {
    return from(
      this.fs
        .collection(firestoreConstants.products)
        .add(product)
    ).pipe(
      map(() => {
        return product;
      })
    );
  }
  deleteProduct(product: Product): Observable<Product> {
    return from(
      this.fs
      .doc(firestoreConstants.products + routingConstants.slash + product.uId)
      .delete()
    ).pipe(
      map(() => {
        return product;
      })
    );
  }

  getProductsInCart(productIds: string[]): Observable<Product[]> {
    return this.fs.collection<Product>(firestoreConstants.products, ref => ref
      .where(firebase.firestore.FieldPath.documentId(), 'in', productIds))
      .snapshotChanges()
      .pipe(
        map(documentChangeActions => {
          console.log(documentChangeActions.forEach(value => value.payload.doc.id));
          return this.mapDocChangeAction(documentChangeActions);
        })
      );
  }

  getProduct(id: string): Observable<Product> {
    const productFromDB = this.fs.doc<Product>('products/' + id);
    return productFromDB.snapshotChanges()
      .pipe(
        map(returned => {
          const data = returned.payload.data();
          const product2Return: Product = {
            name: data.name,
            price: data.price,
            url: data.url
          };
          return product2Return;
        }));
  }

  getProducts(): Observable<Product[]> {
    return this.fs
        .collection<Product>(firestoreConstants.products, ref => ref
          .limit(this.perPageLimit)
          .orderBy('name', 'asc'))
        .snapshotChanges()
        .pipe(
          map(documentsChangeActions => {
            this.firstDocResponse = documentsChangeActions[0].payload.doc;
            console.log(documentsChangeActions[0].payload.doc.id);
            this.lastDocResponse = documentsChangeActions[documentsChangeActions.length - 1].payload.doc;
            this.prevStartAt = [];
            this.pageClickCount = 0;

            console.log('started streaming products');

            this.AddPrevStartAt(this.firstDocResponse);
            console.log(this.firstDocResponse.id);
            return this.mapDocChangeAction(documentsChangeActions);
            }
          )
        );
  }

  getProductCount(): Observable<Product[]> {
    console.log('count method called');
    return this.fs.collection<Product>(firestoreConstants.products)
      .snapshotChanges()
      .pipe(map(
        documentCount => {
          this.productCount = documentCount.length;
          console.log(this.productCount);

          return this.mapDocChangeAction(documentCount);
        }
      ));
  }

  getNextProducts(): Observable<Product[]> {
    return this.fs
      .collection<Product>(firestoreConstants.products, ref => ref
        .limit(this.perPageLimit)
        .orderBy('name', 'asc')
        .startAfter(this.lastDocResponse))
      .snapshotChanges()
      .pipe(
        map(documentChangeActions => {
          this.firstDocResponse = documentChangeActions[0].payload.doc;
          this.lastDocResponse = documentChangeActions[documentChangeActions.length - 1].payload.doc;

          if (this.pageClickCount + 1 < (this.productCount / this.perPageLimit)) {
            this.pageClickCount++;
            this.AddPrevStartAt(this.firstDocResponse);
          }
          console.log( this.pageClickCount + 'of' + this.productCount / this.perPageLimit);

          return this.mapDocChangeAction(documentChangeActions);
        })
      );
  }

  getPrevProducts(): Observable<Product[]> {
    return this.fs
      .collection<Product>(firestoreConstants.products, ref => ref
        .limit(this.perPageLimit)
        .orderBy('name', 'asc')
        .startAt(this.getPrevStartAt())
        .endBefore(this.firstDocResponse))
      .snapshotChanges()
      .pipe(
        map( documentChangeActions => {
          this.firstDocResponse = documentChangeActions[0].payload.doc;
          this.lastDocResponse = documentChangeActions[documentChangeActions.length - 1].payload.doc;

          if (this.pageClickCount > 0) {
            this.pageClickCount--;
            this.RemovePrevStartAt(this.firstDocResponse);
          }
          return this.mapDocChangeAction(documentChangeActions);
        })
      );
  }

  getTopProducts(limit: number): Observable<Product[]> {
    return this.fs
      .collection<Product>(firestoreConstants.topProducts,
        ref => ref.limit(limit))
      .snapshotChanges()
      .pipe(
        map(documentsChangeActions => {
          return this.mapDocChangeAction(documentsChangeActions);
        })
      );
  }

  AddPrevStartAt(prevStart: any) {
    let alreadyExists = false;
    this.prevStartAt.forEach(item => {
      if (prevStart.data() === item.data()) {
       alreadyExists = true;
      }
    });

    if (alreadyExists === false) {
      this.prevStartAt.push(prevStart);
      console.log('hello this was added ' + prevStart.data());
    }

  }

  RemovePrevStartAt(prevStart: any) {
    this.prevStartAt.forEach(item => {
      console.log(prevStart.data().id);
      if (prevStart.data().id === item.data().id) {
        item = null;
      }
    });
  }

  getPrevStartAt() {
    if (this.prevStartAt.length > (this.pageClickCount + 1)) {
      this.prevStartAt.splice(this.prevStartAt.length - 2, this.prevStartAt.length - 1);
    }
    return this.prevStartAt[this.pageClickCount - 1];
  }

  private mapDocChangeAction(documentsChangeActions: DocumentChangeAction<Product>[]): Product[] {
    return documentsChangeActions.map(docAction => {
      const data = docAction.payload.doc.data();
      const prod: Product = {
        name: data.name,
        price: data.price,
        url: data.url,
        uId: docAction.payload.doc.id
      };
      return prod;
    });
  }
  updateProduct(newProduct: Product, pId: string): Promise<any> {
    return this.fs.doc('products/' + pId).set(newProduct);
  }
}

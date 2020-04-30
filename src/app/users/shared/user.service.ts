import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {firestoreConstants} from '../../public/shared/constants';
import {map} from 'rxjs/operators';
import {User} from './user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private fs: AngularFirestore) {}


  getAllUsers(): Observable<User[]> {
    return this.fs
      .collection<User>(firestoreConstants.users)
      .snapshotChanges()
      .pipe(
        map(documentsChangeActions => {
            return documentsChangeActions.map(docAction => {
              const data = docAction.payload.doc.data();
              const user: User = {
                name: data.name,
                email: data.email,
                uid: docAction.payload.doc.id,
                picUrl: data.picUrl
              };
              return user;
            }
            );
        })
      );
  }
}

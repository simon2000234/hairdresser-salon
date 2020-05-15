import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Select, Store} from '@ngxs/store';
import {UserState} from '../shared/user.state';
import {Observable, Subscription} from 'rxjs';
import {User} from '../shared/user';
import {GetUser, UpdateUser} from '../shared/user.action';
import {FormBuilder} from '@angular/forms';
import {Navigate} from '@ngxs/router-plugin';
import * as firebase from 'firebase';

@Component({
  selector: 'app-innotech-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.scss']
})
export class UserUpdateComponent implements OnInit, OnDestroy {
  id;
  user: User;
  sub: Subscription;
  fileToUpload: File;
  errorMessage: string;
  userForm = this.fb.group({
    pic: ['']
  });
  constructor(private route: ActivatedRoute,
              private store: Store,
              private fb: FormBuilder) {}
  @Select(UserState.user2update)
  user$: Observable<User>;

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.store.dispatch(new GetUser(this.id));
    this.sub = this.user$.subscribe(user => this.user = user);
  }
  update() {
    if (this.fileToUpload === undefined) {
      return;
    }
    firebase.storage().ref().child('profilePics/' + this.fileToUpload.name)
      .put(this.fileToUpload).then( ref => {
        ref.ref.getDownloadURL().then(url => {
          const updatedUser: User = {
            name: this.user.name,
            email: this.user.email,
            uid: this.user.uid,
            picUrl: url,
            isAdmin: this.user.isAdmin,
            cartId: this.user.cartId
          };
          this.store.dispatch(new UpdateUser(updatedUser));
          this.store.dispatch(new Navigate(['users']));
        });
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  UploadProfilePic(files: FileList) {
    if (!files.item(0).type.match(/\.(jpg|jpeg|png|gif)$/)) {
      this.errorMessage = 'We Only Accept jpg|jpeg|png|gif';
      return;
    }
    this.fileToUpload = files.item(0);
  }
}

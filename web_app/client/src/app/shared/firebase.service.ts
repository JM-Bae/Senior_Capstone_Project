import { Injectable } from '@angular/core';
import {
  AngularFireDatabase,
  AngularFireList,
  AngularFireObject
} from '@angular/fire/database';
import { Emotion } from './emotion.model';
import { Group } from './group.model';
import { AngularFireFunctions } from '@angular/fire/functions';
import { environment } from 'environments/environment.prod';
import { Observable } from 'rxjs';
import { FirebaseFunctions } from '@angular/fire';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  emotionsRef: AngularFireList<any>;
  emotionRef: AngularFireObject<any>;
  groupsRef: AngularFireList<any>;
  groupRef: AngularFireObject<any>;

  constructor(
    private _db: AngularFireDatabase,
    private _fn: AngularFireFunctions
  ) {
    // USED for testing purposes
    // this._fn.functions.useFunctionsEmulator('http://localhost:5000');
  }

  GetCounts() {
    this.emotionsRef = this._db.list('counts');
    return this.emotionsRef;
  }

  GetCountById(countId: string) {
    this.emotionRef = this._db.object(`counts/${countId}/count`);
    return this.emotionRef;
  }

  // Fetch Single Firebase Object
  GetEmotion(emotionId: string) {
    this.emotionRef = this._db.object(`emotions/${emotionId}`);
    return this.emotionRef;
  }

  GetEmotionLabels(data: any): Observable<any> {
    return this._fn.httpsCallable('getEmotionLabels')(data);
  }

  // GetEmotionLabels() {
  //   this.emotionsRef = this._db.list('emotions');
  //   this.emotionsRef.
  // }

  GetEmotions() {
    this.emotionsRef = this._db.list('emotions');
    return this.emotionsRef;
  }

  // Fetch Emotions List
  GetEmotionsList(emotionId: string) {
    this.emotionsRef = this._db.list(`emotions/${emotionId}`);
    return this.emotionsRef;
  }
  GetEvents() {
    this.emotionsRef = this._db.list('events');
    return this.emotionsRef;
  }
}

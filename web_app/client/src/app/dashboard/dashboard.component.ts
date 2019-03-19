import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Chart } from 'chart.js';
import { FirebaseService } from '../shared/firebase.service';
import { Emotion } from '../shared/emotion.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  public topEmotion: any;
  public lowestEmotion: any;
  public emotionLabels$: any;
  public countsData$: any[];
  public eventsData$: any[];

  public emotionLabelsSub: any;
  public countsDataSub: any;
  public eventsDataSub: any;

  constructor(public firebaseService: FirebaseService) {}

  public titleCase(str: any) {
    return str.substr(0, 1).toUpperCase() + str.substr(1);
  }

  ngOnInit() {
    // this.emotionLabelsSub = this.firebaseService
    //   .GetEmotionLabels('edd')
    //   .subscribe(data => {
    //     this.emotionLabels$ = data.map(x => {
    //       return this.titleCase(x);
    //     });
    //   });

    this.countsDataSub = this.firebaseService
      .GetCounts()
      .snapshotChanges(['child_changed'])
      .subscribe(actions => {
        this.countsData$ = actions
          .filter(action => action.payload.val().count !== 0)
          .map(action => ({
            emotion: this.titleCase(action.payload.key),
            count: action.payload.val().count
          }));
      });
    this.eventsDataSub = this.firebaseService
      .GetEvents()
      .snapshotChanges(['child_added'])
      .subscribe(actions => {
        this.eventsData$ = actions.map(action => ({
          emotion: this.titleCase(action.payload.val().emotion),
          certainty: parseFloat(action.payload.val().certainty).toFixed(4),
          timestamp: action.payload.val().timestamp
        }));
      });
  }
  ngOnDestroy() {
    // this.emotionLabelsSub.unsubscribe();
    this.countsDataSub.unsubscribe();
    this.eventsDataSub.unsubscribe();
  }
}

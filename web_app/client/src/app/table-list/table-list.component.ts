import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../shared/firebase.service';

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css']
})
export class TableListComponent implements OnInit {
  public emotionsList: any;

  constructor(public firebaseService: FirebaseService) {}

  ngOnInit() {}
}

import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FirebaseService } from '../../shared/firebase.service';
import { BaseChartDirective } from 'ng4-charts/ng4-charts';
import { Chart } from 'chart.js';
import 'chartjs-plugin-streaming';
import { BehaviorSubject } from 'rxjs';
import { EmotionColor } from '../EmotionColor';

const initialState = {
  datasets: [{ data: [] }]
};

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit {
  @ViewChild(BaseChartDirective) ch: BaseChartDirective;

  @Input()
  set emotionData(value) {
    this._data.next(value);
  }
  get emotionData() {
    return this._data.getValue();
  }

  private _data = new BehaviorSubject<any[]>([]);
  public lineChartColors: any[] = [];
  pauseChart: boolean = false;

  datasets: any[] = [{ data: [] }];

  options: any = {
    title: {
      display: true,
      text: 'Emotions Tracker',
      fontColor: 'black'
    },
    elements: {
      line: {
        tension: 0, // disables bezier curves
        fill: false,
        borderWidth: 1
      }
    },
    responsive: true,
    scales: {
      xAxes: [
        {
          type: 'realtime',
          realtime: {
            duration: 86400000, // data in the past 60000ms (per-min basis) will be displayed
            delay: 1000, // delay of 1000ms, so upcoming values are known before plotting a line
            pause: this.pauseChart, // chart is not paused
            ttl: 86400000, // data will be automatically deleted as it disappears off the chart
            refresh: 3000
            // onReceive: this.onReceive
            // onRefresh: function(chart: any) {
            //   chart.data.datasets.forEach((dataset: any) => {
            //     dataset.data.push({
            //       x: Date.now(),
            //       y: Math.random()
            //     });
            //   });
            // }
          }
        }
      ],
      yAxes: [
        {
          scaleLabel: {
            display: false,
            labelString: 'Certainty'
          }
        }
      ]
    },
    tooltips: {
      mode: 'nearest',
      intersect: false
    },
    hover: {
      mode: 'nearest',
      intersect: false
    },
    plugins: {
      streaming: {}
    }
  };

  public lineChartLabels: string[];
  public lineChartData: any = initialState;

  constructor() {}

  ngOnInit() {
    this._data.subscribe(x => {
      this.lineChartLabels = this.getLabels(x);
      this.lineChartData = this.getEventData(x);
      // this.updateLineChart(x);
    });
  }
  getLabels(data: any[]): any[] {
    if (!data) {
      return;
    }
    const uniqueList = data
      .map(name => {
        return { count: 1, name: name.emotion };
      })
      .reduce((a, b) => {
        a[b.name] = (a[b.name] || 0) + b.count;
        return a;
      }, {});
    const sortedList = Object.keys(uniqueList)
      .sort()
      .reduce((acc, key) => {
        acc[key] = uniqueList[key];
        return acc;
      }, {});
    const sortedKeys = Object.keys(sortedList);
    this.lineChartColors = this.getColors(sortedKeys);
    return sortedKeys;
  }
  getColors(data: string[]): any[] {
    if (!data) {
      return;
    }
    const newColors = [];
    data.map(emotionType => {
      EmotionColor.filter(colorItem => colorItem.emotion === emotionType).map(
        item =>
          newColors.push({
            backgroundColor: item.backgroundColor,
            borderColor: item.borderColor,
            pointBackgroundColor: item.pointBackgroundColor,
            pointBorderColor: item.pointBorderColor,
            pointHoverBackgroundColor: item.pointHoverBackgroundColor,
            pointHoverBorderColor: item.pointHoverBorderColor
          })
      );
    });
    return newColors;
  }
  getEventData(events: any[]): any[] {
    if (!events) {
      return;
    }
    // const eventData = events.map(event => ({
    //   x: event.certainty,
    //   y: event.timestamp
    // }));
    const emotionLabels = new Set(events.map(x => x.emotion));
    const newDataset = Array.from(emotionLabels)
      .sort()
      .map(x => ({
        label: x,
        data: events
          .filter(event => event.emotion === x)
          .map(item => ({
            x: item.timestamp,
            y: item.certainty
          }))
      }));
    return newDataset;
  }
  updateLineChart(events: any[]): any[] {
    if (!this.lineChartData) {
      return;
    }
    if (!events) {
      return;
    }
    const eventData = events.map(event => ({
      x: event.certainty,
      y: event.timestamp
    }));
    this.onReceive(eventData);
  }

  onReceive(event) {
    if (!this.lineChartData) {
      return;
    }
    if (!event) {
      return;
    }
    // this.lineChartData.forEach((dataset: any) => {});
    // this.datasets.forEach((dataset: any) => {
    //   this.ch.chart.data.datasets[event]
    //   console.log('dataset is: ', dataset);
    // });
    // this.ch.chart.datasets.map(dataset => {
    //   console.log('dataset is: ', dataset);
    // });
    // console.log('event is: ', event);
    // this.ch.chart.datasets.forEach((dataset: any) => {
    //   console.log('dataset is: ', dataset);
    // });
    // this.ch.chart.datasets[event.datasetIndex].data.push({
    //   x: event.timestamp,
    //   y: event.certainty
    // });
    // console.log('eventData from events.map is: ', eventData);
    // this.ch.chart.update({
    //   preservation: true
    // });
  }
}

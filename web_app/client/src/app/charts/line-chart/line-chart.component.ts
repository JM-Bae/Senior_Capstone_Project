import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FirebaseService } from '../../shared/firebase.service';
import { BaseChartDirective } from 'ng4-charts/ng4-charts';
import { Chart } from 'chart.js';
import 'chartjs-plugin-streaming';
import { BehaviorSubject } from 'rxjs';

export const chartColors = {
  red: 'rgb(255, 99, 132)', // anger
  orange: 'rgb(255, 159, 64)',
  yellow: 'rgb(255, 205, 86)', // happy
  green: 'rgb(45, 192, 45)', // fear
  blue: 'rgb(54, 162, 235)', // surprise
  darkblue: 'rgb(24, 42, 75)', // sad
  purple: 'rgb(153, 102, 255)', // disgust
  grey: 'rgb(231, 238, 235)',
  darkgrey: 'rgb(81, 88, 85)',
  black: 'rgb(20, 20, 20)',
  white: 'rgb(255, 255, 255)' // neutral
};
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
  // { // grey
  //   backgroundColor: 'rgba(148,159,177,0.2)',
  //   borderColor: 'rgba(148,159,177,1)',
  //   pointBackgroundColor: 'rgba(148,159,177,1)',
  //   pointBorderColor: '#fff',
  //   pointHoverBackgroundColor: '#fff',
  //   pointHoverBorderColor: 'rgba(148,159,177,0.8)'
  // },
  // { // dark grey
  //   backgroundColor: 'rgba(77,83,96,0.2)',
  //   borderColor: 'rgba(77,83,96,1)',
  //   pointBackgroundColor: 'rgba(77,83,96,1)',
  //   pointBorderColor: '#fff',
  //   pointHoverBackgroundColor: '#fff',
  //   pointHoverBorderColor: 'rgba(77,83,96,1)'
  // },
  // { // red
  //   backgroundColor: 'rgba(255,0,0,0.3)',
  //   borderColor: 'red',
  //   pointBackgroundColor: 'rgba(148,159,177,1)',
  //   pointBorderColor: '#fff',
  //   pointHoverBackgroundColor: '#fff',
  //   pointHoverBorderColor: 'rgba(148,159,177,0.8)'
  // }
  public lineChartColors: any[] = [
    // {
    //   backgroundColor: [
    //     chartColors.red, // angry
    //     chartColors.green, // fear
    //     chartColors.yellow, // happy
    //     chartColors.white, // neutral
    //     chartColors.darkblue, // sad
    //     chartColors.blue, // surprise
    //     chartColors.purple // disgust
    //   ]
    // },
    {
      // angry
      backgroundColor: 'rgba(255,0,0,0.3)',
      borderColor: 'red',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    {
      // fear
      backgroundColor: 'rgba(45, 192, 45,0.3)',
      borderColor: 'green',
      pointBackgroundColor: 'rgba(45, 192, 45,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    {
      // happy
      backgroundColor: 'rgba(255, 205, 86, 0.3)',
      borderColor: 'yellow',
      pointBackgroundColor: 'rgba(255, 205, 86,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    {
      // neutral
      backgroundColor: 'rgba(255, 255, 255,0.3)',
      borderColor: 'white',
      pointBackgroundColor: 'rgba(255, 255, 255,1)',
      pointBorderColor: '#ddd',
      pointHoverBackgroundColor: '#ccc',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    {
      // sad
      backgroundColor: 'rgba(24, 42, 75, 0.3)',
      borderColor: 'darkblue',
      pointBackgroundColor: 'rgba(24, 42, 75, 1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    {
      // surprise
      backgroundColor: 'rgba(54, 162, 235, 0.3)',
      borderColor: 'blue',
      pointBackgroundColor: 'rgba(54, 162, 235, 1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    {
      // disgust
      backgroundColor: 'rgba(153, 102, 255, 0.3)',
      borderColor: 'purple',
      pointBackgroundColor: 'rgba(153, 102, 255, 1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  pauseChart: boolean = false;

  datasets: any[] = [{ data: [] }];
  //   {
  //     label: 'All Emotions',
  //     // backgroundColor: 'rgba(255, 159, 64, 0.5)',
  //     backgroundColor: chartColors.purple,
  //     // pointBackgroundColors: [
  //     //   chartColors.blue, // surprise
  //     //   chartColors.purple // disgust
  //     // ],
  //     // borderColor: chartColors.orange,
  //     borderDash: [8, 4],
  //     // lineTension: 0,
  //     data: []
  //   },
  //   {
  //     label: 'Anger',
  //     // backgroundColor: 'rgba(255, 99, 132, 0.5)',
  //     backgroundColor: chartColors.yellow,
  //     // borderColor: chartColors.red,
  //     data: []
  //   }
  // ];
  //   {
  //     label: 'Joy',
  //     backgroundColor: 'rgba(45, 192, 45, 0.5)',
  //     borderColor: chartColors.green,
  //     borderWidth: 1,
  //     lineTension: 0,
  //     fill: false,
  //     data: []
  //   },
  //   {
  //     label: 'Neutral',
  //     backgroundColor: 'rgba(255, 255, 255, 0.5)',
  //     borderColor: chartColors.white,
  //     borderWidth: 1,
  //     lineTension: 0,
  //     fill: false,
  //     data: []
  //   },
  //   {
  //     label: 'Sadness',
  //     backgroundColor: 'rgba(24, 42, 75, 0.5)',
  //     borderColor: chartColors.darkblue,
  //     borderWidth: 1,
  //     lineTension: 0,
  //     fill: false,
  //     data: []
  //   },
  //   {
  //     label: 'Surprise',
  //     backgroundColor: 'rgba(255, 205, 86, 0.5)',
  //     borderColor: chartColors.yellow,
  //     borderWidth: 1,
  //     lineTension: 0,
  //     fill: false,
  //     data: []
  //   }
  // ];

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
            duration: 60000, // data in the past 60000ms (per-min basis) will be displayed
            delay: 1000, // delay of 1000ms, so upcoming values are known before plotting a line
            pause: this.pauseChart, // chart is not paused
            ttl: 60000, // data will be automatically deleted as it disappears off the chart
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
      this.updateLineChart(x);
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
    return sortedKeys;
  }
  getEventData(events: any[]): any[] {
    if (!events) {
      return;
    }
    const eventData = events.map(event => ({
      x: event.certainty,
      y: event.timestamp
    }));
    const emotionLabels = new Set(events.map(x => x.emotion));
    const newDataset = Array.from(emotionLabels).map(x => ({
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

import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { BaseChartDirective } from 'ng4-charts/ng4-charts';
import { Chart, ChartDataSets } from 'chart.js';
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
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit {
  @ViewChild(BaseChartDirective) ch: BaseChartDirective;
  @Input()
  set emotionData(value) {
    this._data.next(value);
  }
  get emotionData() {
    return this._data.getValue();
  }

  private _data = new BehaviorSubject<any[]>([]);
  public barChartLabels: string[];
  public barChartData: any = initialState;
  public barChartColors: any[] = [
    {
      backgroundColor: [
        chartColors.red, // anger
        chartColors.purple, // disgust
        chartColors.green, // fear
        chartColors.yellow, // happy
        chartColors.white, // neutral
        chartColors.darkblue, // sad
        chartColors.blue // surprise
      ]
    }
  ];
  public barChartLegend = false;
  public options: any = {
    title: {
      display: true,
      text: 'Emotions Count',
      fontColor: 'black'
    },
    responsive: true,
    scales: {
      xAxes: [
        {
          type: 'category',
          labels: this.barChartLabels,
          refresh: 1000,
          onRefresh: this.onRefresh
        }
      ],
      yAxes: [
        {
          ticks: {
            beginAtZero: true
          },
          scaleLabel: {
            display: false,
            labelString: '# of Emotions'
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
    }
  };

  constructor() {}

  ngOnInit() {
    this._data.subscribe(x => {
      this.barChartLabels = this.getLabels(x);
      this.barChartData = this.getCountData(x);
    });
  }

  getLabels(data: any[]): any[] {
    if (!data) {
      return;
    }
    return data.map(x => x.emotion);
  }

  getCountData(data: any[]): number[] {
    if (!data) {
      return;
    }
    const countData = data.map(x => x.count);
    const newData = [];
    newData.push({
      data: countData
    });
    return newData;
  }

  onRefresh(event) {
    this.ch.chart.update({
      preservation: true
    });
  }
}

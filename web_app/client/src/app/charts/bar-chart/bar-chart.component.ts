import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { BaseChartDirective } from 'ng4-charts/ng4-charts';
import { Chart, ChartDataSets } from 'chart.js';
import { BehaviorSubject } from 'rxjs';
import { EmotionColor } from '../EmotionColor';

export const chartColors = {
  red: 'rgb(255, 99, 132)', // anger
  orange: 'rgb(255, 159, 64)', // (fear)
  yellow: 'rgb(255, 205, 86)', // happy
  green: 'rgb(45, 192, 45)', // neutral
  blue: 'rgb(54, 162, 235)', // surprise
  darkblue: 'rgb(24, 42, 75)', // sad
  purple: 'rgb(153, 102, 255)', // (disgust)
  grey: 'rgb(231, 238, 235)',
  darkgrey: 'rgb(81, 88, 85)',
  black: 'rgb(20, 20, 20)',
  white: 'rgb(255, 255, 255)'
};
const initialState = {
  datasets: [{ data: [] }]
};
// const concat = (x, y) => { x.concat(y)};
// const flatMap = (f, arr) => {
//   return arr.map(f).reduce(concat, []);
// }
// Array.prototype.flatMap = (f) => {
//   return flatMap(f, this);
// }

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
  public barChartColors: any[] = [];
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
    // this.updateEmotionLabels();
  }

  updateEmotionLabels() {}

  getLabels(data: any[]): any[] {
    if (!data) {
      return;
    }
    const emotionLabels = data.map(x => x.emotion).sort();
    this.barChartColors = this.getColors(emotionLabels);
    return emotionLabels;
  }

  getColors(data: string[]): any[] {
    if (!data) {
      return;
    }
    const newColorArray = [];
    data.map(emotionType => {
      EmotionColor.filter(colorItem => colorItem.emotion === emotionType).map(
        item => {
          newColorArray.push(item.color);
        }
      );
    });
    const newColors = [
      {
        backgroundColor: newColorArray
      }
    ];
    return newColors;
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

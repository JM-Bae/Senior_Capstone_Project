export const chartColors = {
  red: 'rgb(255, 99, 132)', // angry
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
export const EmotionColor = [
  {
    emotion: 'Angry',
    color: chartColors.red,
    backgroundColor: 'rgba(255,0,0,0.3)',
    borderColor: 'red',
    pointBackgroundColor: 'rgba(148,159,177,1)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(148,159,177,0.8)'
  },
  {
    emotion: 'Happy',
    color: chartColors.yellow,
    backgroundColor: 'rgba(255, 205, 86, 0.3)',
    borderColor: 'yellow',
    pointBackgroundColor: 'rgba(255, 205, 86,1)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(148,159,177,0.8)'
  },
  {
    emotion: 'Fear',
    color: chartColors.orange,
    backgroundColor: 'rgba(255, 159, 64, 0.3)',
    borderColor: 'orange',
    pointBackgroundColor: 'rgba(255, 169, 64,1)',
    pointBorderColor: '#ddd',
    pointHoverBackgroundColor: '#ccc',
    pointHoverBorderColor: 'rgba(148,159,177,0.8)'
  },
  {
    emotion: 'Disgust',
    color: chartColors.purple,
    backgroundColor: 'rgba(153, 102, 255, 0.3)',
    borderColor: 'purple',
    pointBackgroundColor: 'rgba(153, 102, 255, 1)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(148,159,177,0.8)'
  },
  {
    emotion: 'Neutral',
    color: chartColors.green,
    backgroundColor: 'rgba(45, 192, 45,0.3)',
    borderColor: 'green',
    pointBackgroundColor: 'rgba(45, 192, 45,1)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(148,159,177,0.8)'
  },
  {
    emotion: 'Sad',
    color: chartColors.darkblue,
    backgroundColor: 'rgba(24, 42, 75, 0.3)',
    borderColor: 'darkblue',
    pointBackgroundColor: 'rgba(24, 42, 75, 1)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(148,159,177,0.8)'
  },
  {
    emotion: 'Surprise',
    color: chartColors.blue,
    backgroundColor: 'rgba(54, 162, 235, 0.3)',
    borderColor: 'blue',
    pointBackgroundColor: 'rgba(54, 162, 235, 1)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(148,159,177,0.8)'
  }
];

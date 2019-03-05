// Initialize Firebase
var config = {
  apiKey: 'AIzaSyDeoBpT_LE_ABbneoeoYSWVcavpZbxse78',
  authDomain: 'emotion-recognition-database.firebaseapp.com',
  databaseURL: 'https://emotion-recognition-database.firebaseio.com',
  projectId: 'emotion-recognition-database',
  storageBucket: 'emotion-recognition-database.appspot.com',
  messagingSenderId: '241127961624'
};
firebase.initializeApp(config);

var database = firebase.database();

// emotion detected as a string
var emotionVal = 'happy'; // temp value to display the plot for debugging purposes.
// timestamp - x coordinate
var xVal = '2019-03-05 00:31:11'; // temp value to display the plot for debugging purpleses.
// timestamp temporary value
var checkVal = ' ';
// data that is pushed to the plot
var data = [];

function realtimeData() {
  // emotion corresponding to an integer from 1-4 - happy, surprised, angry, sad
  var yVal = 0;

  emotionRef = database.ref('/users').child('Emotions');
  emotionRef.on('value', function(snapshot) {
    // check save value of timestamp
    emotionVal = snapshot.val();
  });
  yVal = EmotionInt(emotionVal);
  data.push({
    x: [xVal],
    y: [yVal],
    type: 'line'
  });

  Plotly.newPlot('myDiv', data, {
    showSendToCloud: true
  });
  // save current timestamp so plots wont continue on the same
  // timestamp when the Pi isnt reading anything
  checkVal = xVal;
}

// runs activities every 3 seconds
setInterval(function() {
  // constantly check the timestamp (x coordinate) in firebase
  timestampRef = database.ref('/users').child('Timestamp');
  timestampRef.on('value', function(snapshot) {
    // check save value of timestamp
    xVal = snapshot.val();
  });

  // check for previous timestamp just so we don't plot multiple y coordinate in the same x coordinate
  // while the Pi isnt detecting any face
  if (checkVal != xVal) {
    realtimeData();
  }
}, 3000);

function EmotionInt(x) {
  if (x == 'neutral') {
    yVal = 0;
  } else if (x == 'happy') {
    yVal = 1;
  } else if (x == 'surprised') {
    yVal = 2;
  } else if (x == 'angry') {
    yVal = 3;
  } else if (x == 'sad') {
    yVal = 4;
  }
  return yVal;
}

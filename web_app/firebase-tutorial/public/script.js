// Initialize Firebase
var config = {
  apiKey: "AIzaSyDeoBpT_LE_ABbneoeoYSWVcavpZbxse78",
  authDomain: "emotion-recognition-database.firebaseapp.com",
  databaseURL: "https://emotion-recognition-database.firebaseio.com",
  projectId: "emotion-recognition-database",
  storageBucket: "emotion-recognition-database.appspot.com",
  messagingSenderId: "241127961624"
};
firebase.initializeApp(config);

var database = firebase.database();




/*
database.ref('/').once('value', function (snapshot) {
  console.log(snapshot.val());
});

var rootRef = database.ref('/');
rootRef.once('value', function (snapshot) {
  console.log(snapshot.val());
});
*/

function pushData() {
  var data = document.getElementById("dataValue").value;
  var dataRef = database.ref('/pushData').push();
  dataRef.set({
    value: data
  });
}

function setData() {
  var data = document.getElementById("dataValue").value;
  var dataRef = database.ref('/setData');
  console.log(data)
  dataRef.set({
    value: data
  });


}
/*
setDataRef = database.ref("/setData");
setDataRef.on('child_changed', function (snapshot) {
  console.log("Below is the data from child_changed");
  console.log(snapshot.val());
  print(snapshot.val());
});

pushDataRef = database.ref("/pushData");
pushDataRef.on("child_added", function (snapshot) {
  console.log("Below is the data from child_added");
  console.log(snapshot.val());
  print(snapshot.val());
});

database.ref('/pushData').once('value', function (snapshot) {
  snapshot.forEach(function (data) {
    console.log("Below are the child keys of the values in 'pushData'")
    console.log(data.key);
  });
  console.log(Object.keys(snapshot.val()));
});
*/




var yVal = 0;
var xVal = 0;
var data = [];

function setPoints() {
  //yVal = yVal +  Math.round(5 + Math.random() *(-5-5));

  setDataRef = database.ref("/setData");
  setDataRef.on('child_added', function (snapshot) { // when change appears
    yVal = snapshot.val();
  });



  data.push({

    x: [xVal++],
    y: [yVal],
    type: 'line'
  });



  Plotly.newPlot('myDiv', data, {
    showSendToCloud: true
  });


}

setInterval(function () {
  setPoints()
}, 1000);
var timeData = [],
    temp1Data = [],
    temp2Data = [],
    acc1Data = [],
    acc2Data = [];
  
    $(document).ready(function () {
  var data = {
    labels: timeData,
    datasets: [
      {
        fill: false,
        label: 'Temperature Heater',
        yAxisID: 'Temperature',
        borderColor: "rgba(255, 204, 0, 1)",
        pointBoarderColor: "rgba(255, 204, 0, 1)",
        backgroundColor: "rgba(255, 204, 0, 0.4)",
        pointHoverBackgroundColor: "rgba(255, 204, 0, 1)",
        pointHoverBorderColor: "rgba(255, 204, 0, 1)",
        data: temp1Data
      },
      {
        fill: false,
        label: 'Temperature Pump',
        yAxisID: 'Temperature',
        borderColor: "rgba(204, 255, 0, 1)",
        pointBoarderColor: "rgba(204, 255, 0, 1)",
        backgroundColor: "rgba(204, 255, 0, 0.4)",
        pointHoverBackgroundColor: "rgba(204, 255, 0, 1)",
        pointHoverBorderColor: "rgba(204, 255, 0, 1)",
        data: temp2Data
      },
      {
        fill: false,
        label: 'Acceleration Heater',
        yAxisID: 'Acceleration',
        borderColor: "rgba(255, 204, 128, 1)",
        pointBoarderColor: "rgba(255, 204, 128, 1)",
        backgroundColor: "rgba(255, 204, 128, 1)",
        pointHoverBackgroundColor: "rgba(255, 204, 128, 1)",
        pointHoverBorderColor: "rgba(255, 204, 128, 1)",
        data: acc1Data
      },
      {
        fill: false,
        label: 'Acceleration Pump',
        yAxisID: 'Acceleration',
        borderColor: "rgba(204, 255, 128, 1)",
        pointBoarderColor: "rgba(204, 255, 128, 1)",
        backgroundColor: "rgba(204, 255, 128, 1)",
        pointHoverBackgroundColor: "rgba(204, 255, 128, 1)",
        pointHoverBorderColor: "rgba(204, 255, 128, 1)",
        data: acc1Data
      }
    ]
  }

  var basicOption = {
    title: {
      display: true,
      text: 'Temperature Real-time Data',
      fontSize: 36
    },
    scales: {
      yAxes: [{
        id: 'Temperature',
        type: 'linear',
        scaleLabel: {
          labelString: 'Temperature(C)',
          display: true
        },
        position: 'left',
      }, {
          id: 'Acceleration',
          type: 'linear',
          scaleLabel: {
            labelString: 'Acceleration',
            display: true
          },
          position: 'right'
        }]
    }
  }

  //Get the context of the canvas element we want to select
  var ctx = document.getElementById("myChart").getContext("2d");
  var optionsNoAnimation = { animation: false }
  var myLineChart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: basicOption
  });

  /*var ws = new WebSocket('wss://' + location.host);
  ws.onopen = function () {
    console.log('Successfully connect WebSocket');
  }*/
  
  var wsonmessage = function (data) {
    console.log('receive message' + data);
    
    try {
      var obj = JSON.parse(data);
      if(!obj.time || (!obj.temp1 && !obj.temperature)) {
        return;
      }
      timeData.push(obj.time);
      if(obj.temp1) {
        temp1Data.push(obj.temp1);
      }
      if(obj.temp2) {
        temp2Data.push(obj.temp2);
      } 
      if(obj.acc1) {
        acc1Data.push(obj.acc1);
      }
      if(obj.acc2) {
        acc2Data.push(obj.acc2);
      }
      // only keep no more than 50 points in the line chart
      const maxLen = 50;
      var len = timeData.length;
      if (len > maxLen) {
        timeData.shift();
        temperatureData.shift();
      }

      if (obj.humidity) {
        humidityData.push(obj.humidity);
      }
      if (humidityData.length > maxLen) {
        humidityData.shift();
      }

      myLineChart.update();
    } catch (err) {
      console.error(err);
    }
  }  

  var socket = io();
  socket.on('data', wsonmessage);

});


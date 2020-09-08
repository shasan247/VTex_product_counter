/* -----------------------------                                                
  AUTHOR:  @SEYAM
  seyam.bd.net@gmail.com
------------------------------ */

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
// var fs = require("fs");
var bodyParser = require('body-parser');
//var mongoose = require('mongoose');

//var sys = require('sys');
//var net = require('net');
var sys = require('util');
var mqtt = require('mqtt'); 
// var io  = require('socket.io')();
var connections=[]; 


// mongoose.connect('mongodb://192.168.10.216/myDB');

// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//   console.log( "we're connected!");
// });



app.use(express.static('public'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded






//var broker = new mqtt.MQTTbroker(1883, '127.0.0.1', 'pusher');
const broker = mqtt.connect('mqtt://broker.hivemq.com')
broker.subscribe('/ESP/dashboard');
console.log('subscribed to topic \'/ESP/dashboard\'');
broker.subscribe('feedback');
console.log('subscribed to topic \'feedback\'');


//Multiple sockets requests handler 
io.sockets.on('connection', function (SocketIOclient) {

  connections.push(SocketIOclient);


  console.log('Connected: '+connections.length+' sockets connected!');



  SocketIOclient.on('disconnect',function(){ //No Parameter For Disconnect Event
    connections.splice(connections.indexOf(SocketIOclient),1);
    console.log('Disconnected: %s sockets connected!', connections.length);
  });


  // SocketIOclient.on('publish', function (data) {
  //     broker.publish(data.topic,data.payload); //NOTICE BOTH TOPIC & PAYLOAD HAVE TO PUBLISH
  //     console.log('publishing to '+data.topic+' to turn it '+data.payload);
  // });



  // SocketIOclient.on('subscribe', function (data) {
        
  //       //socket.join(data.topic);
  //       broker.subscribe(data.topic);
  //       console.log('Subscribing to '+data.topic);
  // });

});




// // listen to messages coming from the mqtt broker[Not Required Here]
broker.on('message', function (topic, payload, packet) {
    console.log(topic+'='+payload);                                                                                                                            
    io.sockets.emit('mqtt', {'topic':String(topic),
                               'payload':String(payload)});

    // var jsonData = JSON.parse(payload);

    // db.collection('sensordatas').insert(jsonData, function (err, result) {
    //       if (err)
    //          console.log('Error');
    //       else
    //          console.log('Success');
    // });
});

//For real time state update(addListener way :D :D )
// broker.addListener('mqttData', function(topic, payload){
//   sys.puts(topic+'='+payload);
//   io.sockets.emit('mqtt',{'topic':String(topic),
//                'payload':String(payload)});
// });



app.get('/', function(req,res){
  res.sendFile(__dirname + '/index_2.html');
});
 
app.get('/data', function (req, res) {
       //var dataRetrieved = db.getCollection('SensorData').find({});
       SensorData.find({/*json object key */}, function (err, docs) {
          //var dt = JSON.parse(docs);
          console.log(docs);
          res.json(docs); //perfect!!!
          //res.end( JSON.stringify(docs));
          //res.end(docs);
            // docs.forEach 
      });
       
})



server.listen(5000);
console.log("SocketIO server is running at port 5000!");
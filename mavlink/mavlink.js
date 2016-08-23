const mavlink = require('mavlink');

module.exports = function(RED) {
  function MavlinkNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;
    var myMAV = new mavlink(1,1,"v1.0",["common","ardupilotmega"]);
    var messagesListened = []; // a list of message that we want to listen to

    this.on('input', function(msg) {
      //if we get a buffer, we consider that the node is receiving UDP feed
      if (Buffer.isBuffer(msg.payload)){
        myMAV.parse(msg.payload);

      } else if (Array.isArray(msg.payload)) { //is not a buffer if its an array we store messages that MAVlink needs to listen to

        //detaching previous events
        for (var i=0 ; i < messagesListened.length ; i++){
            myMAV.on(messagesListened[i], function(){});
        }
        //updating the new messages to listen to
        messagesListened = msg.payload;
        for (var i=0 ; i < messagesListened.length ; i++){
            myMAV.on(messagesListened[i], function(message, fields) {
              msg.topic = myMAV.getMessageName(message.id);
              msg.payload = fields;
              node.send(msg);
            });
        }

      } else { //finally it should be a JSON input that has to be turned into MAVlink binary format...
      myMAV.createMessage(msg.payload.name, msg.payload.parameters,
        function(mavMessage) {
          msg.payload = mavMessage.buffer;
          node.send(msg);
        }
      );

    }

    });
  }
  RED.nodes.registerType("MAVlink", MavlinkNode);
}

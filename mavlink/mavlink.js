const mavlink = require('mavlink');

module.exports = function(RED) {
  function MavlinkNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;
    var myMAV = new mavlink(1,1,"v1.0",["common","ardupilotmega"]);

    this.on('input', function(msg) {
      myMAV.createMessage(msg.payload.parameters, msg.payload.parameters,
        function(mavMessage) {
          msg.payload = mavMessage.buffer;
          node.send(msg);
        }
      );

    });
  }
  RED.nodes.registerType("MAVlink", MavlinkNode);
}

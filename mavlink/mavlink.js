module.exports = function(RED) {
  function MavlinkNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;
    const mavlink = require('mavlink');
    var myMAV = new mavlink(1,1,"v1.0",["common","ardupilotmega"]);

    this.on('input', function(msg) {
      command = {
          name:"COMMAND_LONG",
          parameters:{
          'target_system' : 1,
          'target_component' : 0,
          'command' : 22,
          'confirmation' : 1,
          'param1': 1,
          'param2': "",
          'param3': "",
          'param4': 0,
          'param5': "",
          'param6': "",
          'param7': 40
           }
      }

      myMAV.createMessage(command.name, command.parameters,
        function(mavMessage) {
          msg.payload = mavMessage;
          node.send(msg);}
      );

    });
  }
  RED.nodes.registerType("MAVlink", MavlinkNode);
}

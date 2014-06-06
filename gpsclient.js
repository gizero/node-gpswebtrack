var gpsd = require('node-gpsd');

var listener = new gpsd.Listener({
    hostname: 'gizdesk.local',
    });

exports.start = function(callback) {
  console.log('gpsd client started');

  listener.connect(function() {
    console.log('gpsd client connected');

    listener.on('disconnected', function() {
      console.log('connection is lost');
    });

    listener.watch();

    listener.on('TPV', function(tpvData) {
      console.log('got TPV');

      if (callback) callback(tpvData);

    });
  });
}

exports.stop = function() {
  if (listener.isConnected())
    listener.disconnect(function() {
      console.log('gpsd client disconnected');
    });

  console.log('gpsd client stopped');
}

const express = require('express');

application = express();

application.set('port', process.env.PORT || 3000);

application.use(express.static(__dirname + '/public'));

application.get('/', function (req, res) {
    response.sendFile("/index.html");
});

application.listen(application.get('port'), () => {
  console.log(`Listening on port ${application.get('port')}`)
});



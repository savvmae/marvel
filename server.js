const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackConfig = require('./webpack.config.js');

application = express();

application.set('port', process.env.PORT || 3000);

const compiler = webpack(webpackConfig);
application.use(express.static(__dirname + '/public'));

application.use(webpackDevMiddleware(compiler, {
    hot: true,
    filename: 'bundle.js',
    publicPath: '/',
    stats: {
        colors: true
    },
    historyApiFallback: true,
}));

application.get('/', function (req, res) {
    response.sendFile("/index.html");
});

application.listen(application.get('port'), () => {
  console.log(`Listening on port ${application.get('port')}`)
});


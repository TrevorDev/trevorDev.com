var rek = require('rekuire');
var home = rek('home.js');
var generalPage = rek('generalPage.js');

exports.init = function(app){
	app.get('/page/flashDemo/:game', generalPage.showGame);
	app.get('/page/:page', generalPage.show);
	app.get('/*', home.show);
}

var GOOG_KEY = "AIzaSyAMXdydx9lk6d6gLZ92RX3RfvKKSz0-O54";
var ELECTION_ID = 4000;
var GOOG_URL = "https://www.googleapis.com/civicinfo/us_v1";

var r = require('request'),
	Express = require('express'),
	jade = require('jade'),
	server = Express.createServer();

server.set('views', __dirname + '/public/views');
server.set('view engine', 'jade');

server.use(Express.logger());
server.use(Express.bodyParser());
server.use(Express.methodOverride());
server.use(Express.static(__dirname + '/public'));

server.post('/poll', function(req, res) {
	console.log('here', req.body)
	if (req.body.address !== 'null' || req.body.address !== '') {
		console.log('inside')

		var url = GOOG_URL + '/voterinfo/'+ELECTION_ID+'/lookup?key='+GOOG_KEY

		var resp_body = {};

		r({method: 'POST', url: url, json: {address: req.body.address}}, function(err, resp, body) {
			console.log(body)
			if (body.status === 'success') {
				resp_body.election = body.election.name;
				resp_body.date = body.election.electionDay;
				resp_body.pollingLocations = body.pollingLocations;

				if (body.earlyVoteSites) {
					resp_body.earlyVoteSites = body.earlyVoteSites;
				}

				res.send(resp_body);
			} else {
				console.log('failed')
				res.send({error: 'Failed to get polling location information'});
			}
		});
	} else {
		res.send({error: 'Failed to get polling location information'});
	}
});

server.get('/', function(req, res) {
	res.render('layout');
});

server.listen(8000);
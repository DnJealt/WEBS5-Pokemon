var accepts = require('accepts');

module.exports = {
	response: function(req, res){
		var accept = accepts(req)
		// the order of this list is significant; should be server preferred order 
		switch(accept.type(['json', 'html'])) {

			case 'json':

				res.setHeader('Content-Type', 'application/json');
				res.send({ data: { content: req.data, user: req.user } });

				break;

			case 'html':

				res.setHeader('Content-Type', 'text/html');
				res.render(req.page, { data: { content: req.data, user: req.user } });	

			break;

			default:
				// the fallback is text/plain, so no need to specify it above 
				res.setHeader('Content-Type', 'text/plain')
				res.render('error');
				break;
		}
	}
};
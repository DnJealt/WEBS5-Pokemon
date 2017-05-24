var accepts = require('accepts');

module.exports = {
	response: function(req, res){
		var accept = accepts(req)
		// the order of this list is important; should be server preferred order 
		switch(accept.type(['json', 'html'])) {

			case 'json':

				res.setHeader('Content-Type', 'application/json');
				if(req.data.error){
					res.status(400);
				}
				res.send(req.data);

				break;

			case 'html':

				res.setHeader('Content-Type', 'text/html');
				// console.log(req.data);
				res.render(req.page, { title: req.pagetitle, message: req.message, data: { content: req.data, user: req.user } });	

			break;

			default:
				// the fallback is text/plain, so no need to specify it above 
				res.setHeader('Content-Type', 'text/plain')
				res.render('error');
				break;
		}
	}
};
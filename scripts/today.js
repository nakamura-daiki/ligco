// Description:
//   Messing around with the today API.
// Commands:
//   hubot today  - Return today at random.


// Description:
// 今日は何の日

var parseString = require('xml2js').parseString; //xml perser
var request = require('request');
var Today = function(){
	this.api = 'http://www.mizunotomoaki.com/wikipedia_daytopic/api.cgi/';
};

Today.prototype.get =  function(arg, callback) {
	var self = this;
	request.get(self.api + arg, function(error, response, body){
		if(error){
			console.log('connect error');
			return;
		}

		parseString(body, function (err, result) {
			if(err){
				console.log('perse error');
				return;
			}

			callback(result);
		});
	});
};

//module.exports = new Today;

//var today = require('../src/class/today');

var today = new Today;

module.exports = function(robot) {
	robot.respond(/TODAY/i, function(msg) {
		var day_info = new Date();
		var to = {month:(day_info.getMonth()+1), day:day_info.getDate()};
		
		today.get(to.month+'/'+to.day, function(body) {
			if (!body) {
				msg.send("No today No Life");
				return;
			}
			//今日が何の日かをランダムに
			var kinenbi_list = body.feed.kinenbi[0].item;
			var random = Math.floor( Math.random() * kinenbi_list.length); //乱数
			var kinenbi = kinenbi_list[random];
			if(kinenbi.indexOf("（") != -1){
				var kinenbi_info = kinenbi_list[random].split('（');
				kinenbi = kinenbi_info[0];
			}

			//wikipediaリンク
			var wiki = body.feed.wikipedia[0];

			msg.send('今日は'+ kinenbi+'です。「'+to.month+'月'+to.day+'日: '+wiki+' 」');
		});
	});
};

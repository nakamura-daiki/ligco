#Description:
#今日は何の日

parseString = require('xml2js').parseString
request = require('request')
class Today
    constructor: () ->
        @.api = 'http://www.mizunotomoaki.com/wikipedia_daytopic/api.cgi/'
    get: (arg, callback) ->
        request.get @.api + arg, (error, response, body) ->
            console.log 'connect error' if error is yes
            parseString body, (err, result) ->
                console.log 'connect error' if err is yes
                callback result
                yes


#module.exports = new Today;

#var today = require('../src/class/today');

today = new Today

module.exports = (robot) ->
    robot.respond (/TODAY/i), (msg) ->
        day_info = new Date()
        to = {
            month: day_info.getMonth()+1
            day:day_info.getDate()
        }
        # console.log today
        today.get (to.month+'/'+to.day), (body) ->
            return msg.send 'No today No Life' if body is no
            kinenbi_list = body.feed.kinenbi[0].item
            random = Math.floor Math.random() * kinenbi_list.length
            kinenbi = kinenbi_list[random];
            if kinenbi.indexOf("（") != -1
                kinenbi_info = kinenbi_list[random].split '（'
                kinenbi = kinenbi_info[0]
            wiki = body.feed.wikipedia[0]
            msg.send "今日は#{kinenbi}です。「#{to.month}月#{to.day}日:#{wiki}」"
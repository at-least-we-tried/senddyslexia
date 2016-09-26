var express = require('express'),
    requestSite = require('request'),
    cheerio = require('cheerio'),
    http = require('http'),
    url = require('url'),
    app = express(),
    port = 3000,
    content = ''


app.get('/', function(request, response) {
  response.end('<html><meta charset="utf-8"><h2>startsida</h2></html>')
})

app.get('/site', function(request, response) {
    var site = request.query.site

    if(site.length == 0) {
      content = '<html><meta charset="utf-8"><h2>du behöver sida</h2>'
    }

    if(site.indexOf('http://') == -1) {
      site = 'http://' + site
    }

    requestSite(site, function (error, response, body) {
      if(!error) {
         var $ = cheerio.load(body)
         content = '<html><script src="http://cdnjs.cloudflare.com/ajax/libs/jquery/2.0.3/jquery.min.js"></script><script src="http://ggez.se/dyslexia.js"></script>'
         content += response.body
         $('link').each(function() {
           var theLink = $(this).attr('href')
           if(theLink.indexOf('http://') == -1 && theLink.indexOf('https://') == -1) {

             // vi hittar css som inte är absolut länkat
             if(theLink.indexOf('css') == 1) {
               content = '<h1>Tyvärr kunde vi inte öppna sidan</h1>'
             }

           }
         })
      }
    })
    content += '</html>'
    response.end(content)
})

app.listen(port)
console.log('the dyslexia happens at ' + port)

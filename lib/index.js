var cheerio = require('cheerio'),
  http = require('http'),
  vm = require('vm'),
  request = require('request'),
  Sandbox = require('./sandbox');
/*
 * GET home page.
 */

scrape = function(html, code, res) {
  var initSandbox = {
      $: cheerio.load(html),
      content: code
    };
    var s = new Sandbox();

    s.run('(function() {' + code + '})();', html, function(output) {
      res.send({error: 0, result: output});
    });
}

exports.index = function(req, res) {
  var data = req.body;
  if (!data || !data.url || !data.parse || typeof data.url !== 'string' || typeof data.parse !== 'string') {
    res.send({error:1, 
      message: 'POST JSON with url and parse properties (strings).'
    });
    return;
  }

  request(data.url, function(err, resp, body) {
    if (err) {
      return res.send({error:1, errors:err, message: 'Pulling down site content failed.'});
    }
      scrape(body, data.parse, res);
  });

};
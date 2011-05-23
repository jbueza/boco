var path   = require('path'),
    sys    = require('sys'),
    fs     = require('fs'),
    events = require('events');
    
    
/*!
 * boco
 * Copyright(c) 2011 Jaime Bueza <jbueza@gmail.com>
 * MIT Licensed
 */

/**
 * Library version.
 */

exports.version = '0.0.1';

boco = function(filePaths, callback) {
  filePaths = filePaths.split(":");
  
  var dirImages = filePaths[0]
    , writableTargetFile = filePaths[1]
    , map = { images: [] }
    , target = path.join(__dirname, dirImages);

  var finished = function finished() {
    fs.writeFile(writableTargetFile, JSON.stringify(map), function(err) {
      if(err) {
        callback.call(this, "Oh noess!!", map);
      } else {
        callback.call(this, null, map);
      }
    });
  };

  fs.readdir(target, function(err, filesUnfiltered) {  
    if (err) throw new Error("WTF");
    var files = [];
    filesUnfiltered.forEach(function(file) {
      if (file.split(".")[1].match(/png|gif|jpg|jpeg|webp/gi)) {
      
        files.push(file);
      }
    });
      
    var callCount = 0;

    files.forEach(function(file, index) {
      fs.stat(path.join(target, file), function (stat_error, stat) {
        if (stat.isFile()) {
          var filename = path.join(target, file);
          fs.readFile(filename, 'ascii', function (read_error, body) {

            callCount++;
            if (read_error) console.log("ERROR: Can't read " + filename + ". " + read_error);

            var prefix = 'data:image/' + filename.split('.')[1] + ';base64,'
              , base64 = new Buffer(body, 'binary').toString('base64')
              , data = prefix + base64
              , obj = { file: file, data: data };
              
            map.images.push(obj);
            if(callCount == files.length) {
              finished();
            }
          });
        }
      });
    
      

    });

  });
};




module.exports = boco;
'use strict';

var fs = require('fs');
var path = require('path');
var Writer = require('broccoli-writer');
var ts = require('ts-compiler');
var walkSync = require('walk-sync');
var objectAssign = require('object-assign');

function TSCompiler(inputTree, options) {
  if (!(this instanceof TSCompiler)) {
    return new TSCompiler(inputTree, options);
  }
  
  this.inputTree = inputTree;
  this.options = options || {};
}

TSCompiler.prototype = Object.create(Writer.prototype);
TSCompiler.prototype.constructor = TSCompiler;

TSCompiler.prototype.write = function(readTree, destDir) {
  var options = objectAssign({outDir: destDir}, this.options);
  if (this.options.outDir) {
    options.outDir = path.resolve(destDir, options.outDir);
  }
  if (options.out) {
    options.out = path.resolve(destDir, options.out);
  }

  return readTree(this.inputTree).then(function(srcDir) {
    var files = walkSync(srcDir)
    .filter(isTypeScript)
    .map(function(filepath) {
      return path.resolve(srcDir, filepath);
    });
    
    if (files.length > 0) {
      ts.compile(files, options, function(err) {
        if (err) throw err;
      });
    }
  });
};

function isTypeScript(filepath) {
  return path.extname(filepath).toLowerCase() === '.ts';
}

module.exports = TSCompiler;

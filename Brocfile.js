var mergeTrees = require('broccoli-merge-trees');
var Funnel = require('broccoli-funnel');
var compileTypescript = require('broccoli-typescript-compiler');
var pickFiles = require('broccoli-static-compiler');

var libTree = compileTypescript(new Funnel('lib'), { outDir: 'lib' });

var srcTree = compileTypescript(new Funnel('src'), { out: 'app.ts' });
var componentsTree = compileTypescript(new Funnel('components'), { outDir: 'components' });

var sourceTree = mergeTrees([libTree, srcTree, componentsTree]);

module.export = sourceTree;

#!/usr/bin/env node

'use strict';

const process = require('process');
const fs = require('fs');
const path = require('path');
const replaceStream = require('replacestream');
const program = require('commander');

let cssFiles = '';
let jsFiles = '';

const replaceFunc = (replacement) => {
    return function() {
        return replacement === undefined ? arguments[0] : replacement;
    };
};

const handleError = (message) => {
    console.error(message);
    process.exit(1);
};

function fromDir(startPath,filter){
    if (!fs.existsSync(startPath)){
        console.log("no dir ",startPath);
        return;
    }

    var files=fs.readdirSync(startPath);
    for(var i=0;i<files.length;i++){
        var filename=(path.join(startPath,files[i])).replace(/\\/g, "/");
        var stat = fs.lstatSync(filename);
        
        if (stat.isDirectory()){
            fromDir(filename,filter);
        }
        else if (filename.indexOf(filter)>=0) {
            
            var relPath = path.relative(program.root,filename).replace(/\\/g, "/");
            switch(filter){
                case '.js':
                    jsFiles += `<script src="${relPath}"></script>\n`;
                    break;
                case '.css':
                    cssFiles += `<link rel="stylesheet" href="${relPath}">\n`;
                    break;
            }
        };
    };
};


const getFullPath = (file) => {
    return file.substring(0, 1) !== '/' ? `${process.cwd()}/${file}` : `${process.cwd()}${file}`;
};

program
.version('1.0.0')
.option('-i, --input <input>', 'Input file')
.option('-o, --output <output>', 'Output file (defaults to input when omitted)')
.option('-c, --css <css>', 'css file(s) to inject (file or directory)')
.option('-j, --js <js>', 'js file(s) to inject (file or directory)')
.option('-r, --root <root>', 'src root')
.parse(process.argv);

if(!program.input) {
    handleError('Please specify an input file');
}
else {
    try {
        program.input = getFullPath(program.input);

        if(fs.lstatSync(program.input).isDirectory()) {
            handleError(`'${program.input}' is a directory, please specify an input file`);
        }
        if(!fs.lstatSync(program.input).isFile()) {
            handleError(`File '${program.input}' not found`);
        }
    }
    catch(e) {
        handleError(`File '${program.input}' not found`);
    }
}

program.output = program.output ? getFullPath(program.output) : program.input;

if(program.root) {
    const p = program.root;

    try {
        fromDir(p,'.js');
    }
    catch(e) {
        handleError(`File or folder '${p}' not found`);
    }

    try {
        fromDir(p,'.css');
    }
    catch(e) {
        handleError(`File or folder '${p}' not found`);
    }
}


const replaceJs = replaceFunc(jsFiles);
const replaceCss = replaceFunc(cssFiles);

fs.createReadStream(program.input)
.pipe(replaceStream(/(<!\-\- inject:js \-\->)([\s\S]*?)(<!\-\- endinject \-\->)/gm, replaceJs))
.pipe(replaceStream(/(<!\-\- inject:css \-\->)([\s\S]*?)(<!\-\- endinject \-\->)/gm, replaceCss))
.pipe(fs.createWriteStream(program.output));
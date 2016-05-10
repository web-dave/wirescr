# A command line utility to inject css and js files into an html file.

[![Build Status](https://travis-ci.org/web-dave/wirescr.svg?branch=master)](https://travis-ci.org/web-dave/wirescr)

Inspired by [wiredep](https://www.npmjs.com/package/wiredep) and [postbuild](https://www.npmjs.com/package/postbuild)  and written because I could not find a command-line equivalent that could work with npm scripts instead of gulp.

This module injects css and javascript files between markers placed in an html file.

**This module was written in ES6 and requires node >= 4.0.0.**

## Usage
Place the markers in your html file to inject or remove code:

```html
   <!DOCTYPE html>
   <html>
   <head>
     <title>Home</title>

     <!-- inject:css -->
     <link rel="stylesheet" href="/path/to/styles.css">
     <!-- endinject -->

   </head>
   <body>

     <!-- inject:js -->
     <script src="/path/to/build.js"></script>
     <!-- endinject -->

   </body>
   </html>
```
The css and javascript files will be injected between the markers and the scripts and stylesheets that are already there will be removed.
This way you can replace the regular files used in a development environment with the built files (bundled, minified, versioned) in a production environment.

 Options:

    -h, --help             output usage information
    -V, --version          output the version number
    -i, --input <input>    Input file
    -o, --output <output>  Output file
    -r, --root     <p>        src root

### Examples

example structur:

```
index.tpl.html
-- dist
   -- css
      style.css
      -- subdir
         main.css
   -- js
      vendor.js
      scripts.js
      -- subdir
         main.js
```
`wiresrc -i index.tpl.html -o dist/index.html -r dist`

will result in the file `dist/index.html`:

```html
   <!DOCTYPE html>
   <html>
   <head>
     <title>Home</title>

     <!-- inject:css -->
     <link rel="stylesheet" href="dist/css/style.css">
     <link rel="stylesheet" href="dist/css/subdir/main.css">
     <!-- endinject -->

   </head>
   <body>

     <!-- inject:js -->
     <script src="dist/js/vendor.js"></script>
     <script src="dist/js/scripts.js"></script>
     <script src="dist/js/subdir/main.js"></script>
     <!-- endinject -->

   </body>
   </html>
```



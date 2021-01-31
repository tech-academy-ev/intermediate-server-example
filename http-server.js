// first import the basic http module like last time
// also import 'fs' to use the file system (because this time
// we want to send our files to the user)
var http = require('http');
var fs = require('fs');

var DATA = [
  {
    name: 'Lukas',
    hours: 150,
  },
  {
    name: 'Lara',
    hours: 120,
  },
  {
    name: 'Tom',
    hours: 115,
  },
  {
    name: 'Marc',
    hours: 7,
  },
  {
    name: 'Anne',
    hours: 22,
  },
];

// still the same as last time, we make the server 
var server = http.createServer(function (req, res) {

    // first big difference: last time we sent back the same response
    // no matter the request
    // this time we have to check the path that the user requests
    // like tech-academy.io/path/morepath/...
    // "/" is the root path, it does not have to be entered by the user
    // so we send back out ".html" file for the root request
    if (req.url === "/") {

      // this function can read files from the file system
      fs.readFile("public/index.html", function (error, filecontent) {

          // we need to check for errors, else the entire server would
          // crash on every error that could occur
          if (error) {

              // this is where the "status codes" come from, like the 
              // famous 404
              // specifying the codes is not required, but the browser
              // can use them internally for optimizations
              res.writeHead(404);
              res.write('File not found');
          } else {

              // in addition to the status, we can/should send additional
              // information about what we are sending back, otherwise the
              // browser might have problems processing them
              // a ".html" file has the type "text/html"
              res.writeHead(200, { 'Content-Type': 'text/html' });

              // the actual file content then has to be "written" which
              // basically comes from the idea that the content is not sent
              // as an entire file, but "written" to a stream of data
              // sending one monolithic file of X MB would not be functional
              // on the internet .. not totally important why at this point
              res.write(filecontent);
          }
            
          // since we have created a stream of data, we need to specify when 
          // the stream is over. this is how
          res.end();
      });

    // now it gets interesting: inside our ".html" file we have linked to our
    // stylesheet and our javascript file. when the browser receives our html file
    // it reads it top to bottom, line by line and tries to execute what it reads.
    // when it gets to the link to our stylesheet, it tries to resolve the path
    // that is specified and thus sends a new request to the server, asking
    // for the file that is at "/styles.css". so it asks for the root path "/"
    // plus the path to the file we want. therefore we have to handle this 
    // exact request. everything inside this case is the same as before
    } else if (req.url === "/styles.css") {
      fs.readFile("public/styles.css", function (error, filecontent) {
        if (error) {
            res.writeHead(404);
            res.write('File not found');
        } else {

            // small difference here: this file is not html, it is css
            res.writeHead(200, { 'Content-Type': 'text/css' });
            res.write(filecontent);
        }
          
        res.end();
      });
    
    // same as with the css file, when the browser reaces the link to our
    // script file, it will request this as well
    } else if (req.url === "/script.js") {
      fs.readFile("public/script.js", function (error, filecontent) {
        if (error) {
            res.writeHead(404);
            res.write('File not found');
        } else {

            // obviously this has the type javascript
            res.writeHead(200, { 'Content-Type': 'text/javascript' });
            res.write(filecontent);
        }
          
        res.end();
      });

    // to show the possibilities, i have included a custom font. this font is not
    // linked in the html file, it is linked from the css. the browser will request
    // this file just the same. note that this is inside an asset-folder, therefore
    // the requested path has to include this folder
    } else if (req.url === "/assets/Montserrat-Bold.ttf") {
      fs.readFile("public/assets/Montserrat-Bold.ttf", function (error, filecontent) {
        if (error) {
            res.writeHead(404);
            res.write('File not found');
        } else {
            res.writeHead(200, { 'Content-Type': 'text/ttf' });
            res.write(filecontent);
        }
          
        res.end();
      });

    } else if (req.url === "/assets/Montserrat-Regular.ttf") {
      fs.readFile("public/assets/Montserrat-Regular.ttf", function (error, filecontent) {
        if (error) {
            res.writeHead(404);
            res.write('File not found');
        } else {
            res.writeHead(200, { 'Content-Type': 'text/ttf' });
            res.write(filecontent);
        }
          
        res.end();
      });
    
    // images work just the same
    } else if (req.url === "/assets/logo.png") {
      fs.readFile("public/assets/logo.png", function (error, filecontent) {
        if (error) {
            res.writeHead(404);
            res.write('File not found');
        } else {

            // this content-type could be made into something dynamic
            // the part "image/png" is also called a mime-type
            res.writeHead(200, { 'Content-Type': 'image/png' });
            res.write(filecontent);
        }
          
        res.end();
      });

    } else if (req.url === "/data") {

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.write(JSON.stringify(DATA));
        
      res.end();

    } else {

      // so if none of the paths can be matched, we need a defualt case
      // so that our server doesn't break on error
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write('<h1>Path not found!</h1>' + req.url);
      res.end();
    }
});

// start up the server as usual
server.listen(1337);
 
// a small message to see the process is running
console.log('Server Started listening on port 1337');
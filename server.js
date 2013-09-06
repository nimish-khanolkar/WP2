var http = require('http'),
path = require("path"),
url = require("url"),
fs = require("fs"),
mime = require("mime");
var homepath = ".";
var port =80;
var server = http.createServer(function(req, res){
   var uri = url.parse(req.url).pathname;
   var filepath = path.join(homepath,uri);
	console.log(filepath);
   path.exists(filepath,function(exists){
       if(!exists)
       {
	 console.log('request for a nonexisting file');	
           //404 response
           res.writeHead(404,{"Content-Type":"text/plain"});
           res.write("404 File not Found \n");
           res.end();
       }
       else{
	 if(fs.statSync(filepath).isDirectory())
	  {
	    filepath += '/index.html';
	    filepath = path.normalize(filepath);
	  }
	  fs.readFile(filepath,"binary",function(err,data){
	  if(err){
            res.writeHead(500,{'Content-Type':'text/plain'});
            res.write('500 File read error \n');
            res.end(); 
           }
           else {
               var contentType = mime.lookup(filepath);
		console.log("i reached the res.writehead\n");
		console.log('content-type',contentType);
               res.writeHead(200,{'Content-Type':contentType});
               res.write(data,'binary');
               res.end();
           }
       });
       }  
   });
});
server.listen(3000);
server.on('error', function(e){
    console.log(e);
});
console.log('Server listening on Port 3000');

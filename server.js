var server = require("http").createServer(handler),
path = require("path"),
url = require("url"),
fs = require("fs"),
mime = require("mime"),
matrix = require("./serverScripts/matrix.js"),
io = require("socket.io").listen(server);
server.listen(3000);
var homepath = ".";
var listofMatrices = [];
function handler (req, res){
   var uri = url.parse(req.url).pathname;
   var filepath = path.join(homepath,uri);
	console.log(filepath);
   path.exists(filepath,function(exists){
       if(!exists)
       {
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
               res.writeHead(200,{'Content-Type':contentType});
               res.write(data,'binary');
               res.end();
           }
       });
       }  
   });		   
   }
   //sockets part starts here
   io.sockets.on('connection',function(socket){
   	//event of matrix submission for input	  
   		   socket.on('submitF',function(matrix){
   		   		listofMatrices.push(matrix); 
   		   		console.log('Matrix added. Array length is'+listofMatrices.length);
   		   });
   		   
   	
   
   
   });
   
   
server.on('error', function(e){
    console.log(e);
});
console.log('Server listening on Port 3000');

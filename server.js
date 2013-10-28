var server = require("http").createServer(handler),
path = require("path"),
url = require("url"),
fs = require("fs"),
mime = require("mime"),
matrix = require("./serverScripts/matrix.js"),
processor = require("./serverScripts/processExpression.js"),
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
   //helper function to convert Data Matrix object to server Matrix object. Returns Matrix.
  
   function convertspecToMatrix(spec){
   	   
   	   var temp_matrix = new matrix({name:spec.name,rows:2,cols:2});
   	   temp_matrix.setData(0,0,spec.a11);
   	   temp_matrix.setData(1,0,spec.a12);
   	   temp_matrix.setData(0,1,spec.a21);
   	   temp_matrix.setData(1,1,spec.a22);		   
   	   return temp_matrix;
   }
   
   function convertMatrixtoSpec(matrix){
   	   var spec = { name:this.name, 
   	   a11: matrix.getData(0,0), 
   	   a12: matrix.getData(0,1),
   	   a21:matrix.getData(1,0),
   	   a22:matrix.getData(1,1)
   	   };
   	   return spec;
   }
   function getMatrix(name){
   	   
   	   for( var i = 0; i<listofMatrices.length;i++){
   	   	   if(listofMatrices[i].name == name)
   	   	   {	
   	   	   	   return listofMatrices[i];
   	   	   }
   	   }
   	   return "NF";
   	    
   }
   function getIndex(name){
   	   for( var i = 0; i<listofMatrices.length;i++){
   	   	   if(listofMatrices[i].name == name)
   	   	   {	
   	   	   	   return i;
   	   	   }
   	   }
   	   return "NF";
   }
   
   
   //helper function to retrieve a matrix object from array and send it back. Returns matrix.
   //sockets part starts here
   io.sockets.on('connection',function(socket){
   	//event of matrix submission for input	  
   		   socket.on('submitF',function(matrix){
   		   		var temp = convertspecToMatrix(matrix);
   		   		temp.displayMatrix();
   		   		listofMatrices.push(temp); 
   		   		console.log('Matrix added. Array length is'+listofMatrices.length);
   		   		
   		   });
   		   
   		   socket.on('edit', function(name){
   		   		   console.log('selected matrix is' + name);
   		   		   var selectedMatrix = getMatrix(name)	;
   		   		   if(selectedMatrix!="NF"){
   		   		   	   
   		   		   	   var spec = convertMatrixtoSpec(selectedMatrix);
   		   		   	   spec.name = name;
   		   		   	   socket.emit('editedMatrix',spec);
   		   		   }
   		   		   else {
   		   		   	   socket.emit('error',"Matrix Not Found!!");
   		   		   	   console.log('Matrix not found!!');
   		   		   }
   		   		   
   		   });
   		   
   		   socket.on('editMatrix',function(spec){
   		   	//this is the event for updating an edited matrix	   
   		   	var newMatrix = convertspecToMatrix(spec);
   		   	var index = getIndex(spec.name);
   		   	console.log("matrix come for updation number"+index);
   		   	if(index!='NF')
   		   		listofMatrices[index]=newMatrix;
   		   	else {
   		   		   	   socket.emit('error',"Matrix Not Found!!");
   		   		   	   console.log('Matrix not found!!');
   		   		}
   		   		
   		   });
   		   
   		   socket.on('calculate',function(exp){
   		   	var result = processor.processExpression(exp,listofMatrices);
   		   	var resultMatrix = processor.getMatrix(result);
   		   	resultMatrix.name = 'result';
   		   	
   		   	console.log('after solution ');
   		   	resultMatrix.displayMatrix();
   		   	var spec = convertMatrixtoSpec(resultMatrix);
   		   	spec.status='OK';
   		   	console.log('Converted matrix spec '+spec.a11+"  "+spec.a22+"  "+spec.a12);
   		   	socket.emit('result',spec);
   		   		 
   		   		   
   		   });
   
   });
   
   
server.on('error', function(e){
    console.log(e);
});
console.log('Server listening on Port 3000');

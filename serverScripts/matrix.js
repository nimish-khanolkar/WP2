//3rd Oct, Basic Matrix Class
//Nimish Prabhukhanolkar
var Matrix = function(spec){
	this.name = spec.name;
	this.rows = spec.rows||3;
	this.cols = spec.cols||3;
	this.mat = new Array(this.rows);
	for(var i=0;i< this.rows;i++){
		this.mat[i]=new Array(spec.cols);	
	}
	for(var i=0;i<this.rows;i++)
	{
		for(var j=0;j<this.cols;j++){
			if(i==j)
				this.mat[i][j]=1;
			else
				this.mat[i][j]=0;
			
		}
	}
}
//get name of the matrix
Matrix.prototype.getName=function(){
	return this.name;
}
//get the Data of the matrix

Matrix.prototype.getData=function(i,j){
	return this.mat[i][j];
}
//set the data of the matrix
Matrix.prototype.setData=function(i,j,val){
	this.mat[i][j]=val;
}
//transpose the matrix
Matrix.prototype.doTranspose=function(){
	for(var i=0;i<this.rows;i++){
		for(var j=0;j<this.cols;j++){
			if(j>i){
				var temp = this.getData(i,j);
				this.setData(i,j,this.getData(j,i));
				this.setData(j,i,temp);
			}
		}
	}
			
	
}

//display the matrix in console
Matrix.prototype.displayMatrix=function(){
	var temp;
	for(var i=0;i<this.rows;i++){
		temp="";
		for(var j=0;j<this.cols;j++){
			temp=temp + "\t" + this.getData(i,j);
			
		}
		console.log(temp);
	}
}
	
//multiplication matrix. result is returned as a matrix object
Matrix.prototype.multiply=function(spec){
	result = new Matrix({rows:this.rows,cols:spec.cols})||0;
	var temp=0;
	if((result!=0)&&(this.cols==spec.rows))
	{
		//console.log('im in here');
		for(var i = 0;i<this.rows;i++){
			for(var j=0;j<spec.cols;j++){
				temp = 0;
				for(var k=0;k<this.cols;k++){
					temp = temp+this.getData(i,k)*spec.getData(k,j);
				}
				result.setData(i,j, temp);
			}
		}
		//add code here for matrix multiplication
		return result;
	}
	else return false;
}

//matrix addition
Matrix.prototype.add=function(spec,alpha1,alpha2){
//spec is the recieved argument matrix and alpha is algebraic constants alpha1*this + alpha2*spec
var result = new Matrix({rows:this.rows,cols:this.cols})||0;

alpha1=alpha1||1;
alpha2=alpha2||1;
	if((result!=0)&&(this.rows==spec.rows)&&(this.cols==spec.cols)) //addable
	{
		for(var i = 0;i<this.rows;i++){
			for(var j=0;j<this.cols;j++){
				var temp =this.getData(i,j)*alpha1 + spec.getData(i,j)*alpha2;
				result.setData(i,j,temp);
			}
		}
		return result;	
		
	}
	else
		return false;
	
}

module.exports = Matrix ;
// var spec = {rows:2,cols:3};
// var spec1 = {rows:3, cols:5};
// var spec2={rows:3,cols:5};
// var mat1 = new Matrix(spec);
// var mat2 = new Matrix(spec1);
// var mat3 = new Matrix(spec2);
// mat1.setData(1,2,5.333);
// mat2.setData(2,1,0.1);
// mat2.setData(2,1,0.1);
// mat2.setData(2,3,-0.5);
// mat1.setData(0,1,100);
// var mat4 = mat2.add(mat3,100,-100);
// console.log("mat2");
// mat2.displayMatrix();
// console.log("mat3");
// mat3.displayMatrix();
// console.log("mat4");
// mat4.displayMatrix();
// 
// //mat1.displayMatrix();

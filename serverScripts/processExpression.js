///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//@Nimish prabhukhanolkar 27th oct 2013                                                                              //
//This module can take in expression array which have only one heirarchy of brackets nested and solve the expression //
//matrices need to be defined in listofMatrices                                                                      //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var matrix = require('./matrix.js');
var listofMatrices=[];
//////////////////////////////////////////////////////
var doMultiplication=function(op1,op2){
   var result = op1.multiply(op2);
   if(result)
     return result;
   else 
     return 'error in multiplication';
}

var doAddition=function(op1,op2){
   var result = op1.add(op2);
   if(result)
     return result;
   else 
     return 'error in addition';
}

var newName=function(op1,op2){
  if((op1.name)&&(op2.name))
  {
    return(op1.name+op2.name);
  }else{ 
      return 'name parameter of the arguments doesn\'t exist';
  }
}

var displaylistofMatrices = function(){
 for(var i=0;i<listofMatrices.length;i++){
   console.log(listofMatrices[i].name+'\t');
}
}
var getMatrix_local = function(name){
  for(var i = 0;i < listofMatrices.length ; i++){
    if(listofMatrices[i].name == name)  
    return listofMatrices[i];
  }
  return false;
}
exports.getMatrix = function(name){
  for(var i = 0;i < listofMatrices.length ; i++){
    if(listofMatrices[i].name == name)  
    return listofMatrices[i];
  }
  return false;
}
//function to replace multplication in a expression
var replaceMultiplicants = function(expressionarray){
var indexOfX = expressionarray.indexOf('X');
var op1,op2,result;
  if(indexOfX==-1){
    return expressionarray;
        //no multiplication was found so array remains same
  }
  else{
    if((indexOfX - 1)>=0)
      {
	  var op1name = expressionarray[indexOfX-1];
	  op1 = getMatrix_local(op1name);
	  if(!op1)
	    return 'op1 matrix with the given name was not found';
      }
      else {
	return 'illegal expression';
      }
      if((indexOfX + 1)<=(expressionarray.length-1)){
      
	  var op2name = expressionarray[indexOfX+1];
	  op2 = getMatrix_local(op2name);
	  if(!op2)
	    return 'op2 matrix with the given name was not found';
      }
      else{
	
	return 'illegal expression';
      }
      result = doMultiplication(op1,op2);
	
      if(result){
	  //successful, so name the result, push the result matrix into listofMatrices, change the expressionarray to denote the multiplication
	    result.name = newName(op1,op2);
	    listofMatrices.push(result);
	    expressionarray.splice(indexOfX-1,3,result.name);
	    return expressionarray;
	}
      else 
	return 'could not replaceMultiplicants';
      }
}

//function to replace addition
var replaceAdditionals = function(expressionarray){
var indexOfplus = expressionarray.indexOf('\+');
var op1,op2,result;
  if(indexOfplus==-1){
    return expressionarray;
        //no addition was found so array remains same
  }
  else{
    if((indexOfplus - 1)>=0)
      {
	  var op1name = expressionarray[indexOfplus-1];
	  op1 = getMatrix_local(op1name);
	  if(!op1)
	    return 'op1 matrix with the given name was not found';
      }
      else {
	return 'illegal expression';
      }
      if((indexOfplus + 1)<=(expressionarray.length-1)){
      
	  var op2name = expressionarray[indexOfplus+1];
	  op2 = getMatrix_local(op2name);
	  if(!op2)
	    return 'op2 matrix with the given name was not found';
      }
      else{
	
	return 'illegal expression';
      }
      result = doAddition(op1,op2);
	
      if(result){
	  //successful, so name the result, push the result matrix into listofMatrices, change the expressionarray to denote the multiplication
	    result.name = newName(op1,op2);
	    listofMatrices.push(result);
	    expressionarray.splice(indexOfplus-1,3,result.name);
	    return expressionarray;
	}
      else 
	return 'could not replaceAdditionals';
      }
}
//this function takes in an expression without brackets and operates on it to give you the final answer.
var processExpressionWithoutBrackets = function(expression){
	var oldexpression="";
	var i = 1;
	var dummy;
	if(expression){
		while(!(oldexpression.length == expression.length)){
			
			oldexpression = expression.slice(0); //direct assignment never works in arrays....
			expression = replaceMultiplicants(expression);
			expression = replaceAdditionals(expression);
		}
	}
	
	if(expression.length!=1)
		return 'unable to process full expression';
	else 
		return expression[0];
	
}

//gives location of innermost brackets
function getInnerBracketLocation(exp){
	var that = {}
		that.bracketsOK = false;
		that.start = -1;
		that.end = -1;
		var innerstart = 0;
		var innerend = 0;
		var openbrac = 0;
		var closebrac=0;
	
	for(var i = 0;i< exp.length;i++)
	{
		if(exp[i] == '('){
			innerstart=i;
			openbrac++;
			}
		
		if(exp[exp.length - i] == ')'){
			innerend=exp.length-i;
			closebrac++;
			}
		
	}
	
	if(innerstart!=0)	
	{
		that.bracketsOK = true;
		that.start = innerstart;
		that.end = innerend;
	}
	if((that.start>that.end)||(openbrac!=closebrac))
		//first condition self explanatory second one checks for both closing or both opening brackets
	{
		console.log('openbracket ' + openbrac);
		console.log('closebracket ' + closebrac);
		that.bracketsOK = false;
		
	}
	
	return that;
	
}

//this is the root function for a general expression
var processFullExpression = function(exp){
	
	var result=0;
	var brac = getInnerBracketLocation(exp);
	//console.log('brackets' + brac.start);
	var subexp;
	var subexp_result;
		if(brac.start== -1){
		//nobrackets so process and return
		console.log('im here');
		result = processExpressionWithoutBrackets(exp);
		}
		else {
			while(brac.start!=-1){ //while brackets still remain
					
				if(brac.bracketsOK==true){
					//correct bracketing, code to proceed ahead here
					//find brackets
					console.log(exp);
					subexp = exp.splice(brac.start,brac.end-brac.start+1);
					//remove brackets from start and end
					subexp.pop();
					subexp.shift();
					//solve brackets
					
					console.log(subexp);
					subexp_result = processExpressionWithoutBrackets(subexp);
					//substitute solution for the bracket in original expression
					exp.splice(brac.start,0,subexp_result);
					
				
					}
				else{
					//incorrect bracketing
					return 'incorrect bracketing';
				}
				brac = getInnerBracketLocation(exp);
				//get the next set of brackets
			}
			//now resolve the last remaining expression without brackets
			exp = processExpressionWithoutBrackets(exp);
		}
		
		return exp;
}

//this is the exposed function to run this module
exports.processExpression = function(expression,list){
	listofMatrices = list;
	var result = processFullExpression(expression);	
	return result;
	
}
//var testexp = ['a','(','b','(','c',')',')'];
       // processExpressionWithoutBrackets
//var a = processFullExpression(expressionarray);	
//var resultmat = getMatrix_local(a);
//resultmat.displayMatrix();
//var brac = getInnerBracketLocation(textexp);
//console.log('testing getinnerbracketlocation ' + brac.bracketsOK+" "+brac.end);
//var answer = processFullExpression(testexp);
//displaylistofMatrices();
//console.log(answer);

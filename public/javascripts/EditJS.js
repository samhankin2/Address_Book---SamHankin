
//this is a function that moves between windows, makes the app much more flexible if lots of other routes were added
//would not have to reuse code instead just call this function.
var move = function move(url){
	console.log("./"+url)
	window.location.href="./"+url
	}

//this splits the addresses that come from the database into the form when edditing, so they can be displayed line by line.
function splitAddress(){
	//the edit form has a hidden element that contains the whole address and this is split on the commas.
	//this creates an array of strings.
	var addressComb = document.getElementById("addressCombined").value;
	console.log(addressComb);
	var addresslines = addressComb.split(",");
	
	//this loops through the array and changes the value of the address line elements of the form to the data in the array.
	var i;
	for (i = 0; i < addresslines.length; i++) { 
	  console.log(i);
	  document.getElementById("addressln"+i).value=addresslines[i];
	}
}

//in an address book it makes sesne to require both a name and number for someone
//this adds basic validation functionality.
//gets called when the form to add or edit a user is called and returns true or false depending on if it has a name and number or not.
function Validation(){
	
	//get the name and address input fields and stores them in a variable
	var name = document.forms["addForm"]["name"];
	
	var number = document.forms["addForm"]["phone"];

	console.log("RAN");
	//if statement that if the value of the name or number is empty will return false
	//goes onto name and shows an alert telling the user. 
	if(name.value==''||number.value=='')
	{
		window.alert("please enter name and number");
		name.focus();
		return false;
	}

	return true;
}



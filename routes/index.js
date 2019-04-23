var express = require('express');
var router = express.Router();
var Sequelize = require('sequelize');
var Op = Sequelize.Op;
//dependency imports


//Connects to the mysql server, parameters are: database name, user and password.
//this will have to be changed when accessing a different mysql server.
const connection = new Sequelize('AddressBookSequalize', 'root', 'newpassword', {
  host: 'localhost',
  dialect: 'mysql'
});

//makes sure the connection is made and prints out the success or failure.
connection
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });


//defines the object for the ORM(sequelize) to create a table out of
var Article = connection.define('article',{
  name: Sequelize.STRING,
  address: Sequelize.STRING,
  postcode: Sequelize.STRING,
  phone: Sequelize.STRING,
  email: Sequelize.STRING,
  dob: Sequelize.DATEONLY,
  dobString: Sequelize.STRING

});

//makes the table 
connection.sync();

/* GET home page. */
router.get('/', function(req, res, next) {

//if the URL parametes are empty means that there hasnt been a search performed, so it will find all the articles in the table
//and render the index page, with the articles found sent as parameters so they can be put into the table.
if(req.query.search==undefined){
  connection.sync().then(function(){
    Article.findAll().then(function(articles){
      res.render('index', {title: 'AddressBook', rows: articles})
    });
  });
}else{
  //finds all the rows where name is like the search query and renders index with the matching rows sent as parameters to be on the table
  //like requires the Op to be imported from sequelize.
  Article.findAll({where: {name: {[Op.like]: '%'+req.query.search+'%'}}})
    .then(articles=>{
      res.render('index', {title: 'AddressBook', rows: articles})
    });
}
  

});

//renders the add page, which is a form.
router.get('/add', function(req, res, next) {
	res.render('add');
});

//this is what the route the form's action goes to which adds the new data to the database.
//sends the info with a post method.
router.post('/adding', function(req, res, next) {
	
  //the form has the address seperated by lines and these need to be combined, these are added with commas between for readability and
  //so they can be split later more easily when edditing the addresss
	let CombinedAddress = req.body.addressln1 + "," + req.body.addressln2 + "," + req.body.addressln3 + "," + req.body.city;
	console.log(CombinedAddress);
	let date = req.body.dob;
  //to ensure that there isnt any format issues an empty date entry it is changed to null.
  //this is becuase '' is not a date format but null is allowed.
	if(req.body.dob==''){
		date = null;
	}

  //creates a new entry in the database with the body of the post data. This sytem uses javascript promises that are vital with sequelize.
	connection.sync().then(function(){
    Article.create({
      name: req.body.name, 
      address: CombinedAddress,
      postcode: req.body.postcode,
      phone: req.body.phone, 
      email: req.body.email, 
      dob: date, 
      dobString: req.body.dob});

    
    });

    //after it has been added it will return to the index.
    res.redirect('/');

  });    


//delete route will be called when the delete button is pressed on the homepage table
//the button is a form that uses the post method and sends the id of the data in the table that will be deleted
router.post('/delete', function(req, res, next){
  let idToDelete = req.body.idNumber;
  //id is extracted from the body and then passed to the destroy function of sequelize
  Article.destroy({
    where:{
      id: idToDelete
    }
  }).then(function(){
    res.redirect('/');
  });
  //goes back to the home page after the delete is completed. 


});



//Like the delete route, this uses a form that sends the ID of the data to be eddited.
router.post('/edit', function(req, res, next){
  let idToUpdate = req.body.idNumber;
  //this finds the data with the id to be updated and sends it in the render function, onto the edit page.
  Article.findAll({where: {id: idToUpdate}})
        .then(article => {
             res.render('edit', {result: article[0].dataValues}); //there will only be 1 result so the first index of the result array is sent.
        });
});

//this is what the route the edit form's action goes to which updates the new data to the database.
//sends the info with a post method.
router.post('/editing', function(req, res, next) {
  //the form has the address seperated by lines and these need to be combined, these are added with commas between for readability and
  //so they can be split later more easily when edditing the addresss
  let CombinedAddress = req.body.addressln1 + "," + req.body.addressln2 + "," + req.body.addressln3 + "," + req.body.city;
  console.log(CombinedAddress);
  //to ensure that there isnt any format issues an empty date entry it is changed to null.
  //this is becuase '' is not a date format but null is allowed.
  let date = `'${req.body.dob}'`;
  if(req.body.dob==''){
    date = null;
  }

  console.log(date);

  //does the updating. ORM converts the object into SQL and puts it into the database
  Article.update(

  // Set Attribute values 
      {
        name: req.body.name, 
        address: CombinedAddress,
        postcode: req.body.postcode,
        phone: req.body.phone, 
        email: req.body.email, 
        dob: date, 
        dobString: req.body.dob
      },

        // Where clause / criteria 
         { where: {id: req.body.idNumber } }    

 ).then(function() { 
    //if successfull
     res.redirect('/');
     //else
 }).error(function(err) { 

     console.log(" update failed !");
     //handle error here

 });

});



module.exports = router;

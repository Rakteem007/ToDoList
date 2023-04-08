//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const mongoose=require("mongoose")
const _ =require("lodash");

mongoose.connect(process.env.URL);

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const starterItems = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];

var defaultItems=[];

//date-base schema
const itemSchema=new mongoose.Schema({
   name : String
});

const Item=mongoose.model("Item",itemSchema);

//customListItems
const listSchema=new mongoose.Schema({
  name : String,
  items : [itemSchema]
})

const List=new mongoose.model("List",listSchema);

run()

async function run(){

const item1=new Item(
  {
    name : "Welcome to the todo list"
  }
);

const item2=new Item(
  {
    name :"Hit the + button to items to the list"
  }
)

const item3=new Item(
  {
    name : "click the check button to delete the item"
  }
)

 defaultItems=[item1,item2,item3];

// Item.insertMany(defaultItems);

// const duplicateItems = await Item.find({});

// console.log(duplicateItems[6]._id);

// await Item.deleteOne({_id : "6429b2d0380fb330c6ae1072"});

// await Item.deleteMany({});
}

app.get("/",async function(req, res) {

// const day = date.getDate();

await List.deleteMany({name : "Favicon.ico"});

 const foundItems =await Item.find({});

res.render("list", {listTitle: "Today", newListItems: foundItems});
  await List.deleteMany({name : "Favicon.ico"});

});

app.post("/",async function(req, res){

  // await List.deleteMany({name : "favicon.ico"});
  const itemName = req.body.newItem;
  const listName = req.body.list;

  // if (req.body.list === "Work") {
  //   workItems.push(item);
  //   res.redirect("/work");
  // } else {
  //   items.push(item);
    
  // }

  const item=new Item(
    {
      name : itemName
    }
  );

  

  if(listName === "Today"){
    item.save();
    await List.deleteMany({name : "Favicon.ico"});
  res.redirect("/");

  }else{

    const listItem = await List.findOne({name : listName});

    listItem.items.push(item);
    listItem.save();
    await List.deleteMany({name : "Favicon.ico"});
    res.redirect("/" + listName);
  }

  await List.deleteMany({name : "Favicon.ico"});

});

app.post("/delete",async function(req,res){

     const checkItem = req.body.itemChecked;
     const itemName = req.body.itemName;

     if(itemName === "Today"){
      await Item.deleteOne({_id : checkItem});

     setTimeout(function(){res.redirect("/")},1000);
     }else{

        // const list =await List.findOne({name : itemName});
        await List.findOneAndUpdate({name : itemName},{$pull : {items : {_id : checkItem}}});

        setTimeout(function(){res.redirect("/" + itemName)},1000);
     }
      await List.deleteMany({name : "Favicon.ico"});
})

// app.get("/work", function(req,res){
//   res.render("list", {listTitle: "Work List", newListItems: workItems});
// });

app.get("/:customListName",async function(req,res){

     
    
     const customListName = _.capitalize(req.params.customListName);

     const customName = await List.findOne({name : customListName});

     if(customName == null){
      // create the new list page
      const list=new List({
      name : customListName,
      items : defaultItems
     });

      list.save()
      await List.deleteMany({name : "Favicon.ico"});
       res.redirect("/" + customListName);
      
     }else{
      // render the new list page
      await List.deleteMany({name : "Favicon.ico"});
      res.render("list", {listTitle: customListName, newListItems: customName.items});
     }
await List.deleteMany({name : "Favicon.ico"});
    //  await List.deleteMany({});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});

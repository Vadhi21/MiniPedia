const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const ejs = require("ejs");
const app = express();

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.set({strictQuery:false});
mongoose.connect("mongodb://127.0.0.1:27017/wikiDB",{useNewUrlParser:true},
(err)=>{
  if(err){
    console.log(err);
  }else{
    console.log("Connection established with DB");
  }
});

const articleSchema = new mongoose.Schema({
  title:String,
  content:String
});

const Article = mongoose.model("Article",articleSchema);

app.route("/articles")
.get(function(req,res){

  Article.find({},function(err,foundArticles){
        if(err){
          console.log(err);
        }else{

          console.log(foundArticles);
          res.render("home",{test:"hi",articlesArr:foundArticles});
        }
  });
})
.post(function(req,res){
    const articletitle = req.body.title;
    const articlecontent = req.body.content;
    console.log(req.body.title);
    console.log(req.body.content);

    const articlenew = new Article({title:articletitle,content:articlecontent});
    articlenew.save(function(err){
      if(err){
        console.log(err);
      }else{
        console.log("Article created!");
      }
    });
})
.delete(function(req,res){
  Article.deleteMany({});
  console.log("Deleted all items successfully!");
});


app.route("/articles/:articleTitle")
.get(function(req,res){

    const articleName = req.params.articleTitle;

    Article.findOne({title:articleName},function(err,foundArticle){
        if(err){
          console.log(err);
        }else{
          console.log()
          res.render("article",{articleItem:foundArticle});
        }
    });
})
.put(function(req,res){
  Article.updateOne(
    {title:req.body.articleTitle},
    {title:req.body.title,content:req.body.content},
    {overwrite:true},
    function(err){
      if(!err){console.log("Updated successfully!");}
      else{console.log("FAILURE!");}
    }
  );
});


app.listen(3000,function(err){
  if(err){
    console.log(err);
  }else{
    console.log("Server listening on port 3000!");
  }
});

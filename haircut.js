
var max = 750;
Scores = new Meteor.Collection("scores");
 
var max = 750;
         
if (Meteor.isClient) {
  
  
  Meteor.autorun(function ()
                {
                  if (Session.get("life")<= 0 && gameintervalhandle !== undefined)
                    {
                      Meteor.clearInterval(gameintervalhandle);
                      Meteor.clearInterval(delayhandle);
                      if(Session.get("score")> 15)
                        {
                          var name = window.prompt("Enter your name:","anonymous");
                          Scores.insert({name:name, score:Session.get("score")});
                        }
                    }
                });
  
  Template.score.life = function() {return Session.get("life");}
    
  Template.score.isOver = function() {return Session.get("life")<= 0;};
  Template.game.isOver = function() {return Session.get("life")<= 0;};
  Template.score.score = function () {return Session.get("score"); };

    
  Template.top.topScorers = function() {return Scores.find({},{sort: {score: -1}});};
  
  var takeLife = function(){Session.set("life",(Session.get("life") -1));};
  
  var increaseScore = function (){Session.set("score",Session.get("score") + 1);};
  
   var delay = 2000;//secs
  
  var gameintervalhandle;
  var delayhandle;
  
     
  var showgame = function (){
   var paper = Raphael("game");
   
   gameintervalhandle = Meteor.setInterval(function()
                     {
                       var imagepath;
                       var longer ;
                      	if (Math.round(Math.random()*10)%2 === 0){
                          imagepath = "images/long.png";
                          longer = true;
                        }
                       else{
                         imagepath = "images/short.png";
                         longer= false;
                       }
                        var xval = Math.round(Math.min(Math.random()*1000,max));
                        var image = paper.image(imagepath, xval,50,100,100);    
   											image.animate({ y:550},delay,"linear", function(){
                          if(longer)
                            { takeLife();
                            }
                          else{
                          	increaseScore();}
                          this.remove();});
                        image.click(function(){if (!longer) {takeLife(); } else {increaseScore();};this.remove();})
                     }, delay);
    delayhandle = Meteor.setInterval(function() { delay -= 100;}, 5000);
      
  
  }
  
  Meteor.startup(function (){
    Session.set("life",3);
    Session.set("score",0);
    showgame();
  });
  
  Meteor.subscribe("topscores");
  
}

if (Meteor.isServer) {
  Meteor.publish("topscores", function () {
    return Scores.find({}, {$sort: {scores: -1}}); 
  });
    
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

exports.showGame = function(req, res){
	res.template.game = req.params.game;

	switch(req.params.game)
	{
		case "tinystomp":
			res.template.description = "Super awesome mmo game me and one of my pals made in our first year of university";
			break;
		case "arcadePlatformer":
			res.template.description = "To get over the wall at the begining press down then up really quickly followed by an up at the peak of your height.";
			break;
		case "zombieCrash":
			res.template.description = "This uses my own custom room based pathfinding algorithm to control the zombies<br>Click the black rectangle to start.<br>Move with arrow keys<br>Use K to buy a weapon at the shore / open doors(black rectangles) / Reload<br>L to switch weapons<br>\" to shoot";
			break;
		case "runner":
			res.template.description = "Click help from the menu screen for instructions";
			break;
		case "cartballTunnel":
			res.template.description = "Move with arrow keys";
			break;
		case "catGame":
			res.template.description = "This game is mouse only";
			break;
		case "mousebattle":
			res.template.description = "Your army follows your mouse.<br>A: Buy level 1 troops for 5 Gold<br>S: Buy level 2 troops for 50 Gold<br>D: Buy level 3 troops for 200 Gold<br>F: Buy level 4 troops for 1000 Gold";
			break;
		case "lavaJump":
			res.template.description = "Move with arrow keys";
			break;
		case "jumpoid":
			res.template.description = "Move with arrow keys and hold up to stick to roof or walls";
			break;
		case "pingpong":
		case "rope1":
		case "rope9":
			res.template.description = "Physics demo";
			break;
		case "insidesane":
			res.template.description = "Move with arrow keys. Press z to shoot. Reload page for new level.";
			break;
		case "insidesane":
			res.template.description = "Move with arrow keys. Press z to shoot. Reload page for new level.";
			break;
		case "tankworld":
			res.template.description = "Move with arrow keys. Z to shoot.";
			break;
		case "intoTheInferno":
			res.template.description = "Move with arrow keys. Click to shoot.";
			break;
		case "zombietank":
			res.template.description = "Move with arrow keys. Z to shoot.";
			break;
		case "flyingGhost":
			res.template.description = "Move with arrow keys.";
			break;
		case "crazyland":
			res.template.description = "Move with arrow keys.Z to throw star. x to use sword";
			break;
		case "crazydudeWalking":
			res.template.description = "WASD";
			break;
		case "Ninjalevel":
			res.template.description = "This is my favorite game";
			break;		
		default:
			res.template.description = 'Instructions are in game';
			break;
	}


	res.template.page = 'demo';
  res.render('flashDemo/index',res.template);
};

exports.show = function(req, res){
	res.template.page = req.params.page;
  res.render(req.params.page+'/index',res.template);
};

exports.showWorkterm = function(req, res){
	res.template.page = req.params.page;
  res.render('workterm/'+req.params.page+'/index',res.template);
};
exports.showGame = function(req, res){
	res.template.game = req.params.game;
	res.template.description = '';
	res.template.page = 'demo';
  res.render('flashDemo/index',res.template);
};

exports.show = function(req, res){
	res.template.page = req.params.page;
  res.render(req.params.page+'/index',res.template);
};
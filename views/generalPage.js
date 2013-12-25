exports.show = function(req, res){
	res.template.page = req.params.page;
  res.render(req.params.page+'/index',res.template);
};
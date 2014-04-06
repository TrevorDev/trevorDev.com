var listener = new window.keypress.Listener();
var controllers = []

var Controller = function(keys){
	keyMap = {}
	for(var i in keys){
		keyMap[i] = [keys[i], false]
	}

	this.keys = keyMap;
	this.keyUp = function(key){
		this.keys[key][1]=false;
	};
	this.keyDown = function(key){
		this.keys[key][1]=true;
	};
	this.getKey = function(key){
		return this.keys[key][1];
	}

	for (var key in this.keys) {
	  listener.register_combo({
	    keys              : this.keys[key][0],
	    on_keydown        : this.keyDown.bind(this, [key]),
	    on_keyup          : this.keyUp.bind(this, [key]),
	    prevent_repeat    : true
		});
	}
}

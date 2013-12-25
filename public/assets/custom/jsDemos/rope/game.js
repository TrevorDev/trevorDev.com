function onLoading() {
    var mouseX=0;
    var mouseY=0;

                $("#myCanvas").mousemove(function(e){
                  var pageCoords = "( " + e.pageX + ", " + e.pageY + " )";
                  var clientCoords = "( " + e.clientX + ", " + e.clientY + " )";
                  mouseX=e.pageX-$("#myCanvas").position( ).left;
                  mouseY=e.pageY-$("#myCanvas").position( ).top;
                });


    //GLOBAL//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    var gravity = 0.3;
    var context;
    var canvas;
    var frameTime;

    function clearScreen() {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    function frameTimer() {
        this.time = 0;
        this.dt = 0;
        this.getTimePassed = function() {
            var now = new Date().getTime();
            this.dt = now - (this.time || now);
            this.time = now;
            this.dt /= (15);
            if (this.dt > 1.6) {
                this.dt = 0;
            }
        }
    }

    function checkCollision(a1, b1) {
        var dist = new Array();
        dist.push((a1.dim.y + b1.dim.y) - (Math.max(a1.points[0].y, a1.points[2].y, b1.points[2].y, b1.points[0].y) - Math.min(a1.points[0].y, a1.points[2].y, b1.points[2].y, b1.points[0].y)));
        dist.push((a1.dim.x + b1.dim.x) - (Math.max(a1.points[0].x, a1.points[1].x, b1.points[1].x, b1.points[0].x) - Math.min(a1.points[0].x, a1.points[1].x, b1.points[1].x, b1.points[0].x)));

        if (dist[0] > 0 && dist[1] > 0) {
            var spacing = 0.01;
            if (dist[0] < dist[1]) {
                if (a1.points[2].y == Math.max(a1.points[0].y, a1.points[2].y, b1.points[2].y, b1.points[0].y)) {
                    return new vec2(0, dist[0] + spacing);
                } else {
                    return new vec2(0, -(dist[0] + spacing));
                }
            } else {
                if (a1.points[1].x == Math.max(a1.points[0].x, a1.points[1].x, b1.points[1].x, b1.points[0].x)) {
                    return new vec2((dist[1] + spacing), 0);
                } else {
                    return new vec2(-(dist[1] + spacing), 0);
                }
            }
        }
        return new vec2(0, 0);
    }




    //INPUT//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    var keyEnum = {
        W_Key: 0,
        A_Key: 1,
        S_Key: 2,
        D_Key: 3,
        E_Key: 4,
        L_Key: 5
    };
    var keyArray = new Array(4);

    var handlekeydown = function onKeyDown(event) {

            var key = ('which' in event) ? event.which : event.keyCode;
            // Detect which key was pressed
            if (key == 'W'.charCodeAt(0)) {

                keyArray[keyEnum.W_Key] = true;
            }
            if (key == 'A'.charCodeAt(0)) {

                keyArray[keyEnum.A_Key] = true;
            }
            if (key == 'S'.charCodeAt(0)) {

                keyArray[keyEnum.S_Key] = true;
            }
            if (key == 'D'.charCodeAt(0)) {

                keyArray[keyEnum.D_Key] = true;
            }
            if (key == 'E'.charCodeAt(0)) {
                var data="block";
                function add(str){
                    data = data + "," + str;
                }
                for(var i = 0;i<block.ar.length;i++){
                    add(block.ar[i].pos.x);
                    add(block.ar[i].pos.y);
                    add(block.ar[i].dim.x);
                    add(block.ar[i].dim.y);
                }
                var newWindow = window.open("data:application/octet-stream," + data);
            }
            if (key == 'L'.charCodeAt(0)) {
                block.ar = new Array();
                var level = "block,60,480,690,60,360,450,30,30,540,360,30,120,570,360,180,120,0,0,60,600,720,0,90,600,60,540,660,60,60,0,660,60";
                var levelAr = level.split(",");
                mode = "";
                for(var i=0;i<levelAr.length;i++){
                    if(levelAr[i]=="block"){
                        mode=levelAr[i];
                        i++;
                    }
                    if(mode=="block"){
                        var pos = new vec2(parseInt(levelAr[i++]), parseInt(levelAr[i++]));
                        var dim = new vec2(parseInt(levelAr[i++]), parseInt(levelAr[i++]));
                        new block(pos, dim, "#514949");
                        i--;
                    }
                }
            }
        }

    function onKeyUp(event) {
        var key = ('which' in event) ? event.which : event.keyCode;
        // Detect which key was released
        if (key == 'W'.charCodeAt(0)) {
            keyArray[keyEnum.W_Key] = false;
        }
        if (key == 'A'.charCodeAt(0)) {

            keyArray[keyEnum.A_Key] = false;
        }
        if (key == 'S'.charCodeAt(0)) {

            keyArray[keyEnum.S_Key] = false;
        }
        if (key == 'D'.charCodeAt(0)) {

            keyArray[keyEnum.D_Key] = false;
        }
        // Repeat for each key you care about...
    }

    function isKeyDown(key) {
        return keyArray[key];
    }

    function mouseDown(e) {
        if (e.type == "mouseup") {
            var pos = lockToGrid(new vec2(mouseDown.startPos.x, mouseDown.startPos.y));
            var dim = lockToGrid(new vec2(e.offsetX - mouseDown.startPos.x, e.offsetY - mouseDown.startPos.y));

            if (dim.x < 0) {
                pos.x += dim.x;
                dim.x *= -1;
            }
            if (dim.y < 0) {
                pos.y += dim.y;
                dim.y *= -1;
            }

            new block(pos, dim, "#514949");
        } else if (e.type == "mousedown") {
            mouseDown.startPos.x = e.offsetX;
            mouseDown.startPos.y = e.offsetY;
        }
    }
    mouseDown.startPos = new vec2(0, 0);


    //GRID//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function drawGrid() {
        for (var i = 0; i < canvas.width; i += drawGrid.space) {
            context.moveTo(i, 0);
            context.lineTo(i, canvas.height);

        }
        for (var j = 0; j < canvas.height; j += drawGrid.space) {
            context.moveTo(0, j);
            context.lineTo(canvas.width, j);
        }
    }
    drawGrid.space = 30;

    function lockToGrid(vec) {
        vec.x = Math.round(vec.x / drawGrid.space) * drawGrid.space;
        vec.y = Math.round(vec.y / drawGrid.space) * drawGrid.space;
        return vec;
    }
    //OBJECTS//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function vec2(x, y) {
        this.x = x;
        this.y = y;
        this.scaleMult = function(num) {
            return new vec2(this.x * num, this.y * num);
        }
        this.copy = function() {
            return new vec2(this.x, this.y);
        }
        this.add = function(vec) {
            return new vec2(this.x + vec.x, this.y + vec.y);
        }
    }

    function movieClip(pos, dim) {
        this.pos = pos;
        this.dim = dim;
    }

    function block(pos, dim, color) {
        movieClip.call(this, pos, dim);
        block.ar.push(this);
        this.draw = function() {
            context.fillStyle = this.color;
            context.fillRect(this.pos.x, this.pos.y, this.dim.x, this.dim.y);
        }
        this.calcPoints = function() {
            for (var i = 0; i < 2; i++) {
                for (var j = 0; j < 2; j++) {
                    this.points[i * 2 + j] = new vec2(this.pos.x + (j * (this.dim.x)), this.pos.y + (i * (this.dim.y)));
                }
            }
        }
        this.points = new Array();
        this.calcPoints();
        this.color = color;
    }
    block.ar = new Array();


    function Mouse(pos, dim, color) {
        movieClip.call(this, pos, dim);
        this.calcPoints = function() {
            for (var i = 0; i < 2; i++) {
                for (var j = 0; j < 2; j++) {
                    this.points[i * 2 + j] = new vec2(this.pos.x + (j * (this.dim.x)), this.pos.y + (i * (this.dim.y)));
                }
            }
        }

        this.move = function() {
            this.pos.x=mouseX;
            this.pos.y=mouseY;
            this.calcPoints();
        }

        this.draw = function() {
            context.fillStyle = this.color;
            context.fillRect(this.pos.x, this.pos.y, this.dim.x, this.dim.y);
        }
        this.points = new Array();
        this.calcPoints();
    }

    

    

    //PLAYER//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function player(pos, dim, color) {
        movieClip.call(this, pos, dim);
        this.calcPoints = function() {
            for (var i = 0; i < 2; i++) {
                for (var j = 0; j < 2; j++) {
                    this.points[i * 2 + j] = new vec2(this.pos.x + (j * (this.dim.x)), this.pos.y + (i * (this.dim.y)));
                }
            }
        }

        this.move = function() {
            this.spd.y += gravity * frameTime.dt;
            this.pos = this.pos.add(this.spd.scaleMult(frameTime.dt));
            this.calcPoints();
            this.grounded = false;
            var brokenCollisionsBlock = new Array();
            var brokenCollisionsMove = new Array();
            for (var b = 0; b < block.ar.length; b++) {
                var vec = checkCollision(this, block.ar[b]);
                this.pos = this.pos.add(vec);
                this.calcPoints();
                var worked = true;
                for (var c = 0; c < block.ar.length; c++) {
                    if (block.ar[c] != block.ar[b]) {
                        var vec2 = checkCollision(this, block.ar[c]);

                        if ((vec2.x != 0 || vec2.y != 0)) {
                            var place = brokenCollisionsBlock.indexOf(block.ar[c]);
                            if (place != -1) {
                                this.pos = this.pos.add(vec2);


                                if (vec2.y != 0) {
                                    if ((vec2.y < 0) != (this.spd.y < 0)) {
                                        this.spd.y = 0;
                                        if (vec2.y < 0) {
                                            this.grounded = true;
                                            this.jumpsDone = 0;
                                        }
                                    }

                                } else if (vec2.x != 0) {
                                    if ((vec2.x < 0) != (this.spd.x < 0)) {
                                        this.spd.x = 0;
                                    }
                                }

                            } else {
                                brokenCollisionsBlock.push(block.ar[b]);
                                brokenCollisionsMove.push(vec2);
                                this.pos = this.pos.add(vec.scaleMult(-1));
                                this.calcPoints();
                                worked = false;
                                break;
                            }
                        }
                    }

                }
                if (worked) {
                    if (vec.y != 0) {
                        if ((vec.y < 0) != (this.spd.y < 0)) {
                            this.spd.y = 0;
                            if (vec.y < 0) {
                                this.grounded = true;
                                this.jumpsDone = 0;
                            }
                        }

                    } else if (vec.x != 0) {
                        if ((vec.x < 0) != (this.spd.x < 0)) {
                            this.spd.x = 0;
                        }
                    }
                }


            }
            this.calcPoints();
        }
        this.checkInput = function() {
            if (isKeyDown(keyEnum.W_Key)) {
                if (this.jumpsDone < this.maxJumps && !this.jumpKeyDown) {
                    this.spd.y = -7;
                    this.jumpsDone++;
                    this.jumpKeyDown = true;
                }
            } else {
                this.jumpKeyDown = false;
            }
            if (isKeyDown(keyEnum.S_Key)) {
                this.spd.y = 5;
            }
            if (isKeyDown(keyEnum.A_Key)) {
                if (this.spd.x > -this.maxSpd) {
                    this.spd.x -= 0.7 * frameTime.dt;
                }
            }
            if (isKeyDown(keyEnum.D_Key)) {
                if (this.spd.x < this.maxSpd) {
                    this.spd.x += 0.7 * frameTime.dt;
                }
            }
        }
        this.draw = function() {
            context.fillStyle = this.color;
            context.fillRect(this.pos.x, this.pos.y, this.dim.x, this.dim.y);
        }

        this.grounded = false;
        this.maxJumps = 2;
        this.jumpsDone = 0;
        this.jumpKeyDown = false;
        this.points = new Array();
        this.calcPoints();
        this.maxSpd = 3;
        this.spd = new vec2(0, 0);
        this.color = color;
    }

    function badG(pos, dim, color, weight) {
        this.color = color;
        movieClip.call(this, pos, dim);
        this.weight = weight;
        this.spd = new vec2(0,0);
        this.calcPoints = function() {
            for (var i = 0; i < 2; i++) {
                for (var j = 0; j < 2; j++) {
                    this.points[i * 2 + j] = new vec2(this.pos.x + (j * (this.dim.x)), this.pos.y + (i * (this.dim.y)));
                }
            }
        }

        this.draw = function() {
            context.fillStyle = this.color;
            context.fillRect(this.pos.x, this.pos.y, this.dim.x, this.dim.y);
        }
        this.points = new Array();
        this.calcPoints();
    }

    function ropeNode(pos, dim, color, weight) {
        this.color = color;
        movieClip.call(this, pos, dim);
        this.weight = weight;
        this.spd = new vec2(0,0);
        this.acc = new vec2(0,0);
        this.calcPoints = function() {
            for (var i = 0; i < 2; i++) {
                for (var j = 0; j < 2; j++) {
                    this.points[i * 2 + j] = new vec2(this.pos.x + (j * (this.dim.x)), this.pos.y + (i * (this.dim.y)));
                }
            }
        }

        this.draw = function() {
            context.fillStyle = this.color;
            context.fillRect(this.pos.x, this.pos.y, this.dim.x, this.dim.y);
        }
        this.points = new Array();
        this.calcPoints();
    }

    function rope(pos, dim, color) {
        var grav = 0.08;
        var k = 0.8;
        var len = 4;
        var spdDamp = 0.90;
        var nodes = new Array();
        for (var i = 0; i < len; i++) {
            //nodes.push(new ropeNode(pos.copy(), new vec2(90,90), color, 5));
            nodes.push(new ropeNode(pos.copy(), dim, color, 5));
        }
        nodes.push(new ropeNode(pos.copy(), dim, "#000000", 20));
        this.move = function() {
            nodes[0].pos.x=mouseX;
            nodes[0].pos.y=mouseY;
            for (var i = 1; i < nodes.length; i++) {
                //var dist1 = Math.sqrt((nodes[i-1].pos.y-nodes[i].pos.y)*(nodes[i-1].pos.y-nodes[i].pos.y)+((nodes[i-1].pos.x-nodes[i].pos.x)*((nodes[i-1].pos.x-nodes[i].pos.x));
                nodes[i].acc.y=(grav*nodes[i].weight)+(((nodes[i-1].pos.y+(nodes[i-1].dim.y)/2)-(nodes[i].pos.y+(nodes[i].dim.y)/2))*k/nodes[i].weight);
                nodes[i].acc.x=(((nodes[i-1].pos.x+(nodes[i-1].dim.x)/2)-(nodes[i].pos.x+(nodes[i].dim.x)/2))*k/nodes[i].weight);
                if(nodes[i+1]){
                    nodes[i].acc.y+=((nodes[i+1].pos.y-nodes[i].pos.y)*k/nodes[i].weight);
                    nodes[i].acc.x+=((nodes[i+1].pos.x-nodes[i].pos.x)*k/nodes[i].weight);
                }
                nodes[i].spd.x+=nodes[i].acc.x*frameTime.dt;
                nodes[i].spd.y+=nodes[i].acc.y*frameTime.dt;
                nodes[i].spd.x+=(spdDamp*nodes[i].spd.x-nodes[i].spd.x)*frameTime.dt;
                nodes[i].spd.y+=(spdDamp*nodes[i].spd.y-nodes[i].spd.y)*frameTime.dt;
                nodes[i].pos.x+=nodes[i].spd.x*frameTime.dt;
                nodes[i].pos.y+=nodes[i].spd.y*frameTime.dt;
                
            };
        }

        this.draw = function() {
            for (var i = 0; i < nodes.length; i++) {
                nodes[i].draw();
            };
        }
    }

    //MAIN//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    canvas = document.getElementById("myCanvas");
    context = canvas.getContext("2d");
    frameTime = new frameTimer();
    canvas.focus();
    canvas.addEventListener("keydown", handlekeydown, true);
    canvas.addEventListener("keyup", onKeyUp, true);
    canvas.addEventListener("mousedown", mouseDown, true);
    //canvas.addEventListener('mousemove', mouseDown, true);
    canvas.addEventListener("mouseup", mouseDown, true);
    var r = new rope(new vec2(100, 100), new vec2(30, 30), "#FF0000");

    var mainloop = function() {
            clearScreen();
            frameTime.getTimePassed();
            r.move();
            r.draw();
        };

    var animFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || null;
    if (animFrame !== null) {
        var recursiveAnim = function() {
                mainloop();
                animFrame(recursiveAnim, canvas);
            };
        // start the mainloop
        animFrame(recursiveAnim, canvas);
    } else {
        var ONE_FRAME_TIME = 1000.0 / 60.0;
        setInterval(mainloop, ONE_FRAME_TIME);
    }
}

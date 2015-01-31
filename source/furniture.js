
//TODO:
//+change textures
//+add ui
//+width changing doesnt modify the texture
//+vertical AND horizontal tickness
//make backside
//add more rows/columns
//make overflow checks
//abs stripes

//global variables
var renderer;
var scene;
var camera;

//shelf
var sideTexture;
var stripeTexture;
var length = 1;
var firstytex = true;
var plankThicknessVertical = 3;
var plankThicknessHorizontal = 2;
var shelfWidth = 60;
var shelfHeight = 100;
var shelfDepth = 30;
var numberOfColumns = 1;
var numberOfRows = 2;
var objectsArr = [];

//main entry function, 
function mainy()
{
	//init 3D
	init3d();
	
	//init shelf
	initTextures();
	drawShelf();

}

//init three.js scene and renderer
function init3d()
{
	//get html element that shows 3D
	var container3d = document.getElementById( 'id-container3d' );
	
	//creating Three.js scene
	scene = new THREE.Scene(); 
	
	//camera properties
	var view_angle = 10,
		aspect = container3d.offsetWidth/container3d.offsetHeight,
		near = 0.1,
		far = 2000;
	camera = new THREE.PerspectiveCamera(view_angle, aspect, near, far); //creating camera
	camera.position.z = 680;

	//renderer
	renderer = new THREE.WebGLRenderer({color: 0xffffff }); //create renderer,set its size,add to body
	renderer.setSize(container3d.offsetWidth, container3d.offsetHeight);
	renderer.setClearColor( 0xA4A4A4, 1); //setting colour to dark grey (default is black) and opaque alpha value
	container3d.appendChild(renderer.domElement);
	
	//controls
	var controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.update();

	//some light
	var pointLight =
	new THREE.PointLight(0xFFFFFF);
	pointLight.position.set(-500,400,500);
	scene.add(pointLight);
	
	//need to create ambient light to see ambient color that we set
	var lightAmb = new THREE.AmbientLight(0x333333); 
	lightAmb.position.set( 10,20,50 );
	scene.add(lightAmb);
	
	render();
}

var render = function () {
	//finally doing rendering, when this function is called
	requestAnimationFrame(render);
	renderer.render(scene, camera);
};

function clearScene()
{
	for(i=0; i<objectsArr.length; i++)
	{
		scene.remove(objectsArr[i]);
	}
}
	
//events
			
function changeWidth() {
	console.log('changing Width');
	
	var elem = document.getElementById( 'id-input-shelf-width' );
	var value = elem.value;
	var newShelfWidth = parseInt(value);
	
	if(newShelfWidth != shelfWidth)
	{
		shelfWidth = newShelfWidth;
		clearScene();
		drawShelf();
	}	
};

function changeHeight() {
	console.log('changing Height');
	
	var elem = document.getElementById( 'id-input-shelf-height' );
	var value = elem.value;
	var newShelfHeight = parseInt(value);
	
	if(newShelfHeight != shelfHeight)
	{
		shelfHeight = newShelfHeight;
		clearScene();
		drawShelf();
	}
};	
	
function changeDepth()	{
	console.log('changing Depth');
	
	var elem = document.getElementById( 'id-input-shelf-depth' );
	var value = elem.value;
	var newShelfDepth = parseInt(value);
	
	if(newShelfDepth != shelfDepth)
	{
		shelfDepth = newShelfDepth;
		clearScene();
		drawShelf();
	}
};
function changeRows()   {
	console.log('changing Rows');

	var elem = document.getElementById( 'id-input-shelf-rows' );
	var value = elem.value;
	var newNumberOfRows = parseInt(value);

	//check wrong values
	if (isNaN(newNumberOfRows))
	{
		elem.value = numberOfRows;
		newNumberOfRows = numberOfRows;
		console.log("value not a number!");
	}
	if(newNumberOfRows>3)
	{
		elem.value = 3;
		newNumberOfRows = 3;
		console.log("value too high!");
	}
	if(newNumberOfRows<0)
	{
		elem.value = 0;
		newNumberOfRows = 0;
		console.log("value too small!");
	}

	//if new value is valid and different then old value, we draw shelf
	if(newNumberOfRows != numberOfRows)
	{
		numberOfRows = newNumberOfRows;
		clearScene();
		drawShelf();
	}
};

function changeColumns() {
	console.log('changing Columns');
	 
	var elem = document.getElementById( 'id-input-shelf-columns' );
	var value = elem.value;
	var newNumberOfColumns = parseInt(value);

	//check wrong values
	if (isNaN(newNumberOfColumns))
	{
		elem.value = numberOfColumns;
		newNumberOfColumns = numberOfColumns;
		console.log("value not a number!");
	}
	if(newNumberOfColumns>3)
	{
		elem.value = 3;
		newNumberOfColumns = 3;
		console.log("value too high!");
	}
	if(newNumberOfColumns<0)
	{
		elem.value = 0;
		newNumberOfColumns = 0;
		console.log("value too small!");
	}

	//if new value is valid and different then old value, we draw shelf
	if(newNumberOfColumns != numberOfColumns)
	{
		numberOfColumns = newNumberOfColumns;
		clearScene();
		drawShelf();
	}
};

function changeTexture(texture)
{
	clearScene();
	
	sideTexture = THREE.ImageUtils.loadTexture( texture );
	sideTexture.wrapS = THREE.RepeatWrapping;
	sideTexture.wrapT = THREE.RepeatWrapping;
	sideTexture.anisotropy = 16;

	drawShelf();
}
			
// loading wood textures for shelf
function initTextures()
{
	sideTexture = THREE.ImageUtils.loadTexture( 'media/wood_side_light.jpg' );
	sideTexture.wrapS = THREE.RepeatWrapping;
	sideTexture.wrapT = THREE.RepeatWrapping;
	sideTexture.anisotropy = 16;
	stripeTexture = THREE.ImageUtils.loadTexture( 'media/wood_stripe_dark.jpg' );
	stripeTexture.wrapS = THREE.RepeatWrapping;
	stripeTexture.wrapT = THREE.RepeatWrapping;
}



//shelf 

function drawShelf()
{
	//draw shelf using updated width/height/depth etc..
	drawSide(-shelfWidth/2,shelfHeight,shelfDepth);
	drawSide(shelfWidth/2,shelfHeight,shelfDepth);
	if(numberOfColumns == 1)
	{
		drawSide(0,shelfHeight-plankThicknessHorizontal*2+0.2,shelfDepth);
	}
	else if(numberOfColumns == 2)
	{
		drawSide(-shelfWidth/6,shelfHeight-plankThicknessHorizontal*2+0.2,shelfDepth);
		drawSide(shelfWidth/6,shelfHeight-plankThicknessHorizontal*2+0.2,shelfDepth);
	}
	else if(numberOfColumns > 2)
	{
		drawSide(-shelfWidth/4,shelfHeight-plankThicknessHorizontal*2+0.2,shelfDepth);
		drawSide(0,shelfHeight-plankThicknessHorizontal*2+0.2,shelfDepth);
		drawSide(shelfWidth/4,shelfHeight-plankThicknessHorizontal*2+0.2,shelfDepth);
	}
	
	drawHorizontal(shelfWidth-plankThicknessVertical,shelfHeight/2,shelfDepth-0.2);
	drawHorizontal(shelfWidth-plankThicknessVertical,-shelfHeight/2+plankThicknessHorizontal,shelfDepth-0.2);
	
	if(numberOfRows == 1)
	{
		drawHorizontal(shelfWidth-plankThicknessVertical,0+plankThicknessHorizontal/2,shelfDepth-0.2);
	}
	else if(numberOfRows == 2)
	{
		drawHorizontal(shelfWidth-plankThicknessVertical,shelfHeight/6+plankThicknessHorizontal*1/4,shelfDepth-0.2);
		drawHorizontal(shelfWidth-plankThicknessVertical,-shelfHeight/6+plankThicknessHorizontal*3/4,shelfDepth-0.2);
	}
	else if(numberOfRows > 2)
	{
		drawHorizontal(shelfWidth-plankThicknessVertical,shelfHeight/4+plankThicknessVertical/4,shelfDepth-0.2);
		drawHorizontal(shelfWidth-plankThicknessVertical,0+plankThicknessVertical/2,shelfDepth-0.2);
		drawHorizontal(shelfWidth-plankThicknessVertical,-shelfHeight/4+plankThicknessVertical*3/4,shelfDepth-0.2);
	}
}


function drawSide(x,y,z)
{				
	var planeGeometryRepeat = new THREE.PlaneGeometry(z,y,1,1);
	sideTexture.repeat.set( shelfDepth/50, shelfHeight/50 );
	var cubeMaterial = new THREE.MeshLambertMaterial({map:sideTexture});
	var cubeRepeat = new THREE.Mesh(planeGeometryRepeat, cubeMaterial);
	cubeRepeat.position.set (x,0,0);
	cubeRepeat.rotation.set (0,-Math.PI/2,0);
	scene.add(cubeRepeat);
	objectsArr.push(cubeRepeat);
	
	planeGeometryRepeat = new THREE.PlaneGeometry(z,y,1,1);
	sideTexture.repeat.set( shelfDepth/50, shelfHeight/50  );
	var cubeMaterial = new THREE.MeshLambertMaterial({map:sideTexture});
	var cubeRepeat = new THREE.Mesh(planeGeometryRepeat, cubeMaterial);
	cubeRepeat.position.set (x+plankThicknessVertical,0,0);
	cubeRepeat.rotation.set (0,Math.PI/2,0);
	scene.add(cubeRepeat);
	objectsArr.push(cubeRepeat);
	
	planeGeometryRepeat = new THREE.PlaneGeometry(plankThicknessVertical,y,1,1);
	stripeTexture.repeat.set( plankThicknessVertical/50, shelfHeight/50 );
	var cubeMaterial = new THREE.MeshLambertMaterial({map:stripeTexture});
	var cubeRepeat = new THREE.Mesh(planeGeometryRepeat, cubeMaterial);
	cubeRepeat.position.set (x+plankThicknessVertical/2,0,z/2);
	cubeRepeat.rotation.set (0,0,0);
	scene.add(cubeRepeat);
	objectsArr.push(cubeRepeat);
	
	planeGeometryRepeat = new THREE.PlaneGeometry(plankThicknessVertical,z,1,1);
	stripeTexture.repeat.set( plankThicknessVertical/50, shelfHeight/50 );
	var cubeMaterial = new THREE.MeshLambertMaterial({map:stripeTexture});
	var cubeRepeat = new THREE.Mesh(planeGeometryRepeat, cubeMaterial);
	cubeRepeat.position.set (x+plankThicknessVertical/2,y/2,0);
	cubeRepeat.rotation.set (-Math.PI/2,0,0);
	scene.add(cubeRepeat);
	objectsArr.push(cubeRepeat);
	
	planeGeometryRepeat = new THREE.PlaneGeometry(plankThicknessVertical,z,1,1);
	stripeTexture.repeat.set( plankThicknessVertical/50, shelfHeight/50 );
	var cubeMaterial = new THREE.MeshLambertMaterial({map:stripeTexture});
	var cubeRepeat = new THREE.Mesh(planeGeometryRepeat, cubeMaterial);
	cubeRepeat.position.set (x+plankThicknessVertical/2,-y/2,0);
	cubeRepeat.rotation.set (Math.PI/2,0,0);
	scene.add(cubeRepeat);
	objectsArr.push(cubeRepeat);
	

}

function drawHorizontal(x,y,z)
{				
	var planeGeometryRepeat = new THREE.PlaneGeometry(z,x,1,1);
	sideTexture.repeat.set( shelfDepth/50, shelfWidth/50 );
	var cubeMaterial = new THREE.MeshLambertMaterial({map:sideTexture});
	var cubeRepeat = new THREE.Mesh(planeGeometryRepeat, cubeMaterial);
	cubeRepeat.position.set (plankThicknessVertical/2,y,0);
	cubeRepeat.rotation.set (-Math.PI/2,0,0);
	cubeRepeat.rotation.set (-Math.PI/2,0,-Math.PI/2);
	scene.add(cubeRepeat);
	objectsArr.push(cubeRepeat);
	
	var planeGeometryRepeat = new THREE.PlaneGeometry(z,x,1,1);
	sideTexture.repeat.set( shelfDepth/50, shelfWidth/50 );
	var cubeMaterial = new THREE.MeshLambertMaterial({map:sideTexture});
	var cubeRepeat = new THREE.Mesh(planeGeometryRepeat, cubeMaterial);
	cubeRepeat.position.set (plankThicknessVertical/2,y-plankThicknessHorizontal,0);
	cubeRepeat.rotation.set (-Math.PI/2,0,0);
	cubeRepeat.rotation.set (Math.PI/2,0,Math.PI/2);
	scene.add(cubeRepeat);
	objectsArr.push(cubeRepeat);
	
	planeGeometryRepeat = new THREE.PlaneGeometry(plankThicknessHorizontal,shelfWidth,1,1);
	stripeTexture.repeat.set( plankThicknessHorizontal/50, shelfWidth/50 );
	var cubeMaterial = new THREE.MeshLambertMaterial({map:stripeTexture});
	var cubeRepeat = new THREE.Mesh(planeGeometryRepeat, cubeMaterial);
	cubeRepeat.position.set (plankThicknessVertical/2,y-plankThicknessHorizontal/2,z/2-0.1);
	cubeRepeat.rotation.set (0,0,Math.PI/2);
	scene.add(cubeRepeat);
	objectsArr.push(cubeRepeat);
	

}

			
			
			
			

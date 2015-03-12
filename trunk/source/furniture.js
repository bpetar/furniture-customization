
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
var controls;
var crate;


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

//sofa
var sceneSofa;
var sofaInitialized = false;
var sofaMesh ;


//main entry function, 
function mainy()
{
	//init 3D
	initShelf3dView();
	
	//init shelf
	initTextures();
	drawShelf();
	loadModel();
	//modelLoaded();
	
	//draw crate by the shelf
    drawCrate();
	
	//draw floor and walls
	drawFloorAndWalls();
	
	
	
	
}

//init three.js scene and renderer
function initShelf3dView()
{
	//get html element that shows 3D
	var container3d = document.getElementById( 'id-container3d' );
	
	//creating Three.js scene
	scene = new THREE.Scene();
	
	
	//camera properties
	var view_angle = 10,
		aspect = container3d.offsetWidth/container3d.offsetHeight,
		near = 0.1,
		far = 9000;
	camera = new THREE.PerspectiveCamera(view_angle, aspect, near, far); //creating camera
	camera.position.z = 780;
	camera.position.y = 80;

	//renderer
	renderer = new THREE.WebGLRenderer({color: 0xffffff , antialias:true}); //create renderer,set its size,add to body
	renderer.setSize(container3d.offsetWidth, container3d.offsetHeight);
	renderer.setClearColor( 0xEEEEEE, 1); //setting colour to dark grey (default is black) and opaque alpha value
	container3d.appendChild(renderer.domElement);
	
	//controls
	controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.target = new THREE.Vector3(0,50,0)
	controls.update();

	//some light
	var pointLight =
	new THREE.PointLight(0xFFFFFF);
	pointLight.position.set(-500,400,500);
	scene.add(pointLight);

	var pointLight =
	new THREE.PointLight(0x999999);
	pointLight.position.set(500,-400,500);
	scene.add(pointLight);
	
	//need to create ambient light to see ambient color that we set
	var lightAmb = new THREE.AmbientLight(0x333333); 
	lightAmb.position.set( 10,20,50 );
	scene.add(lightAmb);
	
	render();
}


function initSofa3dView()
{
	if (sofaInitialized)
		return;
	
	//get html element that shows 3D
	var container3d = document.getElementById( 'id-sofa-container3d' );
	
	//creating Three.js scene
	sceneSofa = new THREE.Scene(); 
	
	var loader = new THREE.JSONLoader();
    loader.load('./media/red_sofa3.js', scene2ModelLoaded);
	
	
	//camera properties
	var view_angle = 10,
		aspect = container3d.offsetWidth/container3d.offsetHeight,
		near = 0.1,
		far = 9000;
	cameraSofa = new THREE.PerspectiveCamera(view_angle, aspect, near, far); //creating camera
	cameraSofa.position.z = 780;
	cameraSofa.position.y = 80;

	//renderer
	rendererSofa = new THREE.WebGLRenderer({color: 0xffffff , antialias:true}); //create renderer,set its size,add to body
	rendererSofa.setSize(container3d.offsetWidth, container3d.offsetHeight);
	rendererSofa.setClearColor( 0xEEEEEE, 1); //setting colour to dark grey (default is black) and opaque alpha value
	container3d.appendChild(rendererSofa.domElement);
	
	//controls
	controlsSofa = new THREE.OrbitControls( cameraSofa, rendererSofa.domElement );
	controlsSofa.target = new THREE.Vector3(0,50,0)
	controlsSofa.update();

	//some light
	var pointLight =
	new THREE.PointLight(0xFFFFFF);
	pointLight.position.set(-500,400,500);
	sceneSofa.add(pointLight);

	var pointLight =
	new THREE.PointLight(0x999999);
	pointLight.position.set(500,-400,500);
	sceneSofa.add(pointLight);
	
	//need to create ambient light to see ambient color that we set
	var lightAmb = new THREE.AmbientLight(0x333333); 
	lightAmb.position.set( 10,20,50 );
	sceneSofa.add(lightAmb);
	
	renderSofa();
	
	sofaInitialized = true;
}

var render = function () {
	//finally doing rendering, when this function is called
	requestAnimationFrame(render);
	renderer.render(scene, camera);
};

var renderSofa = function () {
	//finally doing rendering, when this function is called
	requestAnimationFrame(renderSofa);
	rendererSofa.render(sceneSofa, cameraSofa);
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
		if (shelfWidth>100)
			crate.position.z = 125;
		else
			crate.position.z = 25;
		clearScene();
		drawShelf();
	}
};

function changePlankThicknessVertical() {
		     console.log('chanhing vertical thicness')
		
	var elem = document.getElementById( 'id-input-shelf-v_thicness' );
	var value = elem.value;
	var newplankThicknessVertical = parseInt(value);
		
	//check wrong values
	if (isNaN(newplankThicknessVertical))
	{
		elem.value = plankThicknessVertical
		newplankThicknessVertical = plankThicknessVertical;
		console.log("value not a number!");
	}
	if(newplankThicknessVertical>20)
	{
		elem.value = 20;
		newplankThicknessVertical = 20;
		console.log("value too high!");
	}
	if(newplankThicknessVertical<0)
	{
		elem.value = 0;
		newplankThicknessVertical = 0;
		console.log("value too small!");
	}

	//if new value is valid and different then old value, we draw shelf
	if(newplankThicknessVertical != plankThicknessVertical)
	{
		plankThicknessVertical = newplankThicknessVertical;
		clearScene();
		drawShelf();
	}
		
};
function  changePlankThicknessHorizontal(){
             console.log('changing horizontal thicness')
	   
	var elem = document.getElementById( 'id-input-shelf-h_thicness' );
	var value = elem.value;
    var newplankThicknessHorizontal = parseInt(value);
		
	//check wrong values
	if (isNaN(newplankThicknessHorizontal))
	{
		elem.value = plankThicknessHorizontal
		newplankThicknessHorizontal = plankThicknessHorizontal;
		console.log("value not a number!");
	}
	if(newplankThicknessHorizontal>20)
	{
		elem.value = 20;
		newplankThicknessHorizontal = 20;
		console.log("value too high!");
	}
	if(newplankThicknessHorizontal<0)
	{
		elem.value = 0;
		newplankThicknessHorizontal = 0;
		console.log("value too small!");
	}

	//if new value is valid and different then old value, we draw shelf
	if(newplankThicknessHorizontal != plankThicknessHorizontal)
	{
		plankThicknessHorizontal = newplankThicknessHorizontal;
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
		drawSide(0,shelfHeight-plankThicknessHorizontal*2+0.4,shelfDepth);
	}
	else if(numberOfColumns == 2)
	{
		drawSide(-shelfWidth/6,shelfHeight-plankThicknessHorizontal*2+0.4,shelfDepth);
		drawSide(shelfWidth/6,shelfHeight-plankThicknessHorizontal*2+0.4,shelfDepth);
	}
	else if(numberOfColumns > 2)
	{
		drawSide(-shelfWidth/4,shelfHeight-plankThicknessHorizontal*2+0.4,shelfDepth);
		drawSide(0,shelfHeight-plankThicknessHorizontal*2+0.2,shelfDepth);
		drawSide(shelfWidth/4,shelfHeight-plankThicknessHorizontal*2+0.4,shelfDepth);
	}
	
	drawHorizontal(shelfWidth-plankThicknessVertical,shelfHeight,shelfDepth-0.2);
	drawHorizontal(shelfWidth-plankThicknessVertical,0+plankThicknessHorizontal,shelfDepth-0.2);
	
	if(numberOfRows == 1)
	{
		drawHorizontal(shelfWidth-plankThicknessVertical,shelfHeight/2+plankThicknessHorizontal/2,shelfDepth-0.2);
	}
	else if(numberOfRows == 2)
	{
		drawHorizontal(shelfWidth-plankThicknessVertical,2*shelfHeight/3+plankThicknessHorizontal*1/4,shelfDepth-0.2);
		drawHorizontal(shelfWidth-plankThicknessVertical,shelfHeight/3+plankThicknessHorizontal*3/4,shelfDepth-0.2);
	}
	else if(numberOfRows > 2)
	{
		drawHorizontal(shelfWidth-plankThicknessVertical,shelfHeight*3/4+plankThicknessVertical/4,shelfDepth-0.2);
		drawHorizontal(shelfWidth-plankThicknessVertical,shelfHeight/2+plankThicknessVertical/2,shelfDepth-0.2);
		drawHorizontal(shelfWidth-plankThicknessVertical,shelfHeight/4+plankThicknessVertical*3/4,shelfDepth-0.2);
	}
}


function drawSide(x,y,z)
{				
	var planeGeometryRepeat = new THREE.PlaneGeometry(z,y,1,1);
	sideTexture.repeat.set( shelfDepth/50, shelfHeight/50 );
	var cubeMaterial = new THREE.MeshLambertMaterial({map:sideTexture});
	var cubeRepeat = new THREE.Mesh(planeGeometryRepeat, cubeMaterial);
	if(y<shelfHeight)
		cubeRepeat.position.set (x,y/2+plankThicknessHorizontal-0.2,z/2);
	else
		cubeRepeat.position.set (x,y/2,z/2);
	cubeRepeat.rotation.set (0,-Math.PI/2,0);
	scene.add(cubeRepeat);
	objectsArr.push(cubeRepeat);
	
	planeGeometryRepeat = new THREE.PlaneGeometry(z,y,1,1);
	sideTexture.repeat.set( shelfDepth/50, shelfHeight/50  );
	var cubeMaterial = new THREE.MeshLambertMaterial({map:sideTexture});
	var cubeRepeat = new THREE.Mesh(planeGeometryRepeat, cubeMaterial);
	if(y<shelfHeight)
		cubeRepeat.position.set (x+plankThicknessVertical,y/2+plankThicknessHorizontal-0.2,z/2);
	else
		cubeRepeat.position.set (x+plankThicknessVertical,y/2,z/2);
	cubeRepeat.rotation.set (0,Math.PI/2,0);
	scene.add(cubeRepeat);
	objectsArr.push(cubeRepeat);
	
	planeGeometryRepeat = new THREE.PlaneGeometry(plankThicknessVertical,y,1,1);
	stripeTexture.repeat.set( plankThicknessVertical/50, shelfHeight/50 );
	var cubeMaterial = new THREE.MeshLambertMaterial({map:stripeTexture});
	var cubeRepeat = new THREE.Mesh(planeGeometryRepeat, cubeMaterial);
	if(y<shelfHeight)
		cubeRepeat.position.set (x+plankThicknessVertical/2,y/2+plankThicknessHorizontal-0.2,z);
	else
		cubeRepeat.position.set (x+plankThicknessVertical/2,y/2,z);
	cubeRepeat.rotation.set (0,0,0);
	scene.add(cubeRepeat);
	objectsArr.push(cubeRepeat);
	
	planeGeometryRepeat = new THREE.PlaneGeometry(plankThicknessVertical,z,1,1);
	stripeTexture.repeat.set( plankThicknessVertical/50, shelfHeight/50 );
	var cubeMaterial = new THREE.MeshLambertMaterial({map:stripeTexture});
	var cubeRepeat = new THREE.Mesh(planeGeometryRepeat, cubeMaterial);
	if(y<shelfHeight)
		cubeRepeat.position.set (x+plankThicknessVertical/2,y+plankThicknessHorizontal-0.2,z/2);
	else
		cubeRepeat.position.set (x+plankThicknessVertical/2,y,z/2);
	cubeRepeat.rotation.set (-Math.PI/2,0,0);
	scene.add(cubeRepeat);
	objectsArr.push(cubeRepeat);
	
	planeGeometryRepeat = new THREE.PlaneGeometry(plankThicknessVertical,z,1,1);
	stripeTexture.repeat.set( plankThicknessVertical/50, shelfHeight/50 );
	var cubeMaterial = new THREE.MeshLambertMaterial({map:stripeTexture});
	var cubeRepeat = new THREE.Mesh(planeGeometryRepeat, cubeMaterial);
	if(y<shelfHeight)
		cubeRepeat.position.set (x+plankThicknessVertical/2,plankThicknessHorizontal-0.2,z/2);
	else
		cubeRepeat.position.set (x+plankThicknessVertical/2,0,z/2);
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
	cubeRepeat.position.set (plankThicknessVertical/2,y,z/2);
	cubeRepeat.rotation.set (-Math.PI/2,0,0);
	cubeRepeat.rotation.set (-Math.PI/2,0,-Math.PI/2);
	scene.add(cubeRepeat);
	objectsArr.push(cubeRepeat);
	
	var planeGeometryRepeat = new THREE.PlaneGeometry(z,x,1,1);
	sideTexture.repeat.set( shelfDepth/50, shelfWidth/50 );
	var cubeMaterial = new THREE.MeshLambertMaterial({map:sideTexture});
	var cubeRepeat = new THREE.Mesh(planeGeometryRepeat, cubeMaterial);
	cubeRepeat.position.set (plankThicknessVertical/2,y-plankThicknessHorizontal,z/2);
	cubeRepeat.rotation.set (-Math.PI/2,0,0);
	cubeRepeat.rotation.set (Math.PI/2,0,Math.PI/2);
	scene.add(cubeRepeat);
	objectsArr.push(cubeRepeat);
	
	planeGeometryRepeat = new THREE.PlaneGeometry(plankThicknessHorizontal,shelfWidth,1,1);
	stripeTexture.repeat.set( plankThicknessHorizontal/50, shelfWidth/50 );
	var cubeMaterial = new THREE.MeshLambertMaterial({map:stripeTexture});
	var cubeRepeat = new THREE.Mesh(planeGeometryRepeat, cubeMaterial);
	cubeRepeat.position.set (plankThicknessVertical/2,y-plankThicknessHorizontal/2,z-0.1);
	cubeRepeat.rotation.set (0,0,Math.PI/2);
	scene.add(cubeRepeat);
	objectsArr.push(cubeRepeat);

}

function drawCrate()
{
    var geometry = new THREE.CubeGeometry(50, 50, 50);
	var cubeTexture = THREE.ImageUtils.loadTexture('./media/cube_texture.jpg');
	var material = new THREE.MeshLambertMaterial({map: cubeTexture});
	crate = new THREE.Mesh(geometry, material);
	
	crate.position.x = 80;
	crate.position.y = 25;
	crate.position.z = 25;
	scene.add(crate);
}

//draw floor and walls
function drawFloorAndWalls()
{
	//todo
}			
			
function loadModel() {  // Call this function to load the model.
    var loader = new THREE.JSONLoader();
    loader.load('./media/plant.js', modelLoaded);  // Start load, call modelLoaded when done.
}
     
function scene2ModelLoaded ( geometry, materials ) { // callback function for JSON loader
     sofaMesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ) );
    sofaMesh.position.x = 100;
	sofaMesh.position.y = 0;
	sofaMesh.position.z = 0;
    sofaMesh.scale.x = 20;
	sofaMesh.scale.y = 20;
	sofaMesh.scale.z = 20;
    sofaMesh.name = "plant";
    sofaMesh.visible = true;
    sceneSofa.add( sofaMesh );
	sofaMesh.scale *= 10;
}

function modelLoaded( geometry, materials ) { // callback function for JSON loader
    var mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ) );
    mesh.position.x = 80;
	mesh.position.y = 50;
	mesh.position.z = 25;
    mesh.scale.x = 20;
	mesh.scale.y = 20;
	mesh.scale.z = 20;
    mesh.name = "plant";
    mesh.visible = true;
    scene.add( mesh );
	mesh.scale *= 10;
}

function changeSofaTexture1(baza)
{
	sofaMesh.material.materials[7].map = THREE.ImageUtils.loadTexture( baza);
    sofaMesh.material.materials[7].needsUpdate = true;
}

function changeSofaTexture2(sedalica)
{
    
	sofaMesh.material.materials[0].map = THREE.ImageUtils.loadTexture( sedalica);
    sofaMesh.material.materials[0].needsUpdate = true;
	sofaMesh.material.materials[1].map = THREE.ImageUtils.loadTexture( sedalica);
    sofaMesh.material.materials[1].needsUpdate = true;
	sofaMesh.material.materials[2].map = THREE.ImageUtils.loadTexture( sedalica);
    sofaMesh.material.materials[2].needsUpdate = true;
		
}

function changeSofaTexture3(jastuci)
{
	sofaMesh.material.materials[3].map = THREE.ImageUtils.loadTexture( jastuci);
    sofaMesh.material.materials[3].needsUpdate = true;
	sofaMesh.material.materials[4].map = THREE.ImageUtils.loadTexture( jastuci);
    sofaMesh.material.materials[4].needsUpdate = true;
	sofaMesh.material.materials[5].map = THREE.ImageUtils.loadTexture( jastuci);
    sofaMesh.material.materials[5].needsUpdate = true;
	sofaMesh.material.materials[6].map = THREE.ImageUtils.loadTexture( jastuci);
    sofaMesh.material.materials[6].needsUpdate = true;
}



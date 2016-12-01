// http://www.stylenovels.com/assets/js/app.js?bust=0.6
var Birds = function () {



    /*****************************
  * CONST
  *****************************/
  var SCREEN_WIDTH = window.innerWidth;
  var SCREEN_HEIGHT = window.innerHeight;
  var SCREEN_WIDTH_HALF = SCREEN_WIDTH  / 2;
  var SCREEN_HEIGHT_HALF = SCREEN_HEIGHT / 2;


    /*****************************
  * VARS
  *****************************/

  var _this = this;

  var _activeCanvas = false;

  var _camera;
  var _scene;
  var _renderer;

  var _birds;
  var _bird;

  var _boid;
  var _boids;

  var _stats;



      /*****************************
  * INIT
  *****************************/

      this.init = function(p_general) {

        _this._init();
    _this._animate();
      };



      /*****************************
  * METODI PUBBLICI
  *****************************/

  this.play = function(){
    _activeCanvas = true;
  };
  this.pause = function(){
    _activeCanvas = false;
  };
  this.startMouseMove = function(){
    document.addEventListener('mousemove', _this._onDocumentMouseMove, false);
  };
  this.stopMouseMove = function(){
    document.removeEventListener('mousemove', _this._onDocumentMouseMove, false);
  };





      /*****************************
  * METODI PRIVATI
  *****************************/


  // INIT:
  this._init = function() {

    _container = document.getElementById('birds-canvas-holder');

    _camera = new THREE.PerspectiveCamera( 75, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000 );
    _camera.position.z = 450;

    _scene = new THREE.Scene();

    _birds = [];
    _boids = [];

    for(var i = 0; i < 200; i ++) {

      _boid = _boids[ i ] = new Boid();
      _boid.position.x = Math.random() * 400 - 200;
      _boid.position.y = Math.random() * 400 - 200;
      _boid.position.z = Math.random() * 400 - 200;
      _boid.velocity.x = Math.random() * 2 - 1;
      _boid.velocity.y = Math.random() * 2 - 1;
      _boid.velocity.z = Math.random() * 2 - 1;
      _boid.setAvoidWalls( true );
      _boid.setWorldSize( 500, 500, 400 );

      _bird = _birds[ i ] = new THREE.Mesh( new Bird(), new THREE.MeshBasicMaterial( { color:Math.random() * 0xffffff, side: THREE.DoubleSide } ) );
      _bird.phase = Math.floor( Math.random() * 62.83 );

      _scene.add(_bird );
    }

    _renderer = new THREE.CanvasRenderer({alpha: true});
    _renderer.setPixelRatio(window.devicePixelRatio);
    _renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

    _container.appendChild(_renderer.domElement);
    window.addEventListener('resize', _this._onWindowResize, false);

  };
  this._onWindowResize = function() {
    _camera.aspect = window.innerWidth / window.innerHeight;
    _camera.updateProjectionMatrix();

    _renderer.setSize( window.innerWidth, window.innerHeight );
  };
  this._onDocumentMouseMove = function( event ) {
    var vector = new THREE.Vector3( event.clientX - SCREEN_WIDTH_HALF, - event.clientY + SCREEN_HEIGHT_HALF, 0 );

    for ( var i = 0, il = _boids.length; i < il; i++ ) {
      _boid = _boids[ i ];
      vector.z = _boid.position.z;
      _boid.repulse( vector );
    }
  };



  //
  this._animate = function() {
    requestAnimationFrame(_this._animate );

    if(_activeCanvas){
      _this._render();
    }
  };

  this._render = function() {
    for ( var i = 0, il = _birds.length; i < il; i++ ) {
      _boid = _boids[ i ];
      _boid.run(_boids);

      _bird = _birds[ i ];
      _bird.position.copy(_boids[ i ].position);

      color = _bird.material.color;
      color.r = color.g = color.b = ( 500 - _bird.position.z ) / 1000;

      _bird.rotation.y = Math.atan2( - _boid.velocity.z, _boid.velocity.x );
      _bird.rotation.z = Math.asin( _boid.velocity.y / _boid.velocity.length() );
      _bird.phase = ( _bird.phase + ( Math.max( 0, _bird.rotation.z ) + 0.1 )  ) % 62.83;
      _bird.geometry.vertices[ 5 ].y = _bird.geometry.vertices[ 4 ].y = Math.sin( _bird.phase ) * 5;
    }
    _renderer.render( _scene, _camera );
  };





    // ON SCROLL:
      this._initOnScroll = function() {

    $( window ).scroll(function() {
      _this._scroll();
    });
      };
  this._scroll = function() {

  };


  // ON RESIZE:
  this._initOnResize = function() {

    $( window ).resize(function() {
      _this._resize();
    });
  };
  this._resize = function() {


  };



};

var App = {};

// BIRDS
			App.BIRDS = new Birds();
 			App.BIRDS.init();
 			App.BIRDS.play();
      TweenMax.to(document.querySelector('#birds-canvas-holder'), 1, {
 				opacity: 1,
 				onStart: function(){
          console.log('onStart');
					// if(App.JUKEBOX) App.JUKEBOX.playTrack($('.birds-loop.loop'), 'loop');
 				}
 			});

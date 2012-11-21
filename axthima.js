

/* DASH Playback Technology - Wrapper for Axthima DASHP2P API
================================================================================ */

//_V_.options.techOrder.push("axthima");

_V_.axthima = _V_.PlaybackTech.extend({

  init: function(player, options){
    this.player = player;
	this.options = options;
    this.el = this.createElement();
	
	this.addEvent("click", this.proxy(this.onClick));
	
	console.log("axthimaTech!");
	
	this.event_handlers = { onMetaData : _V_.axthima.onMetaData.bind(this),
							   onBuffering : _V_.axthima.onBuffering.bind(this),
							   onFinish : _V_.axthima.onFinish.bind(this)
							 };
	
	
	require([this.player.options.DASHR_API], _V_.axthima.onReady.bind(this) );
	
	this.player.ready(_V_.axthima.CheckAutoplay.bind(this));
	
	this.setupTriggers();
  },
  
  
  
   setupTriggers: function(){
    _V_.each.call(this, _V_.axthima.events, function(type){
      _V_.addEvent(this.el, type, _V_.proxy(this.player, this.eventHandler));
    });
  },
  removeTriggers: function(){
    _V_.each.call(this, _V_.axthima.events, function(type){
      _V_.removeEvent(this.el, type, _V_.proxy(this.player, this.eventHandler));
    });
  },
  eventHandler: function(e){
    e.stopPropagation();
    this.triggerEvent(e);
  },

  destroy: function(){
    this.player.tag = false;
	//this.aDash.Stop();
    this.el.parentNode.removeChild(this.el);
  },

  createElement: function(){
    var axthima = _V_.axthima,
        player = this.player,

        // If possible, reuse original tag for HTML5 playback technology element
        el = player.tag,
        newEl;

    // Check if this browser supports moving the element into the box.
    // On the iPhone video will break if you move the element,
    // So we have to create a brand new element.
    if (!el || this.support.movingElementInDOM === false) {

      // If the original tag is still there, remove it.
      if (el) {
        player.el.removeChild(el);
      }

      newEl = _V_.createElement("video", {
        id: el.id || player.el.id + "_dashr_api",
        className: el.className || "vjs-tech"
      });

      el = newEl;
      _V_.insertFirst(el, player.el);
    }

    // Update tag settings, in case they were overridden
    _V_.each(["autoplay","preload","loop","muted"], function(attr){ // ,"poster"
      if (player.options[attr] !== null) {
        el[attr] = player.options[attr];
      }
    }, this);

    return el;
  },

  play: function(){ this.aDash.play(); this.player.triggerEvent('play'); },
  pause: function(){ if(!this.el.seeking) { this.aDash.pause(); this.player.triggerEvent('pause'); } ; },
  paused: function(){ return this.aDash.paused(); }, //ne pas pauser si on est en train de seeker

  currentTime: function(){ return this.el.currentTime; },
  setCurrentTime: function(seconds){
    this.aDash.seek(seconds);
  },

  duration: function(){ return this.el.duration; },
  buffered: function(){ 
  var r= this.aDash.getBuffered(); 
  //video-js doesn't handle buffer ranges with multiranges
  var max_time = this.getMaxTime(r);
  return _V_.createTimeRange(0,max_time);
   },

   getMaxTime: function(buf){
    for(var i=0; i<buf.buffered.length; i++)
    {
      if(buf.start(i)<=this.currentTime() && this.currentTime()<=buf.end(i))
      {
        return buf.end(i);
      }
    }
    return this.currentTime();
   },

  volume: function(){ return this.el.volume; },
  setVolume: function(percentAsDecimal){ this.el.volume = percentAsDecimal; },
  muted: function(){ return this.el.muted; },
  setMuted: function(muted){ this.el.muted = muted; },

  width: function(){ return this.el.offsetWidth; },
  height: function(){ return this.el.offsetHeight; },

  supportsFullScreen: function(){
    if (typeof this.el.webkitEnterFullScreen == 'function') {

      // Seems to be broken in Chromium/Chrome && Safari in Leopard
      if (!navigator.userAgent.match("Chrome") && !navigator.userAgent.match("Mac OS X 10.5")) {
        return true;
      }
    }
    return false;
  },

  enterFullScreen: function(){
      try {
        this.el.webkitEnterFullScreen();
      } catch (e) {
        if (e.code == 11) {
          // this.warning(VideoJS.warnings.videoNotReady);
          _V_.log("VideoJS: Video not ready.");
        }
      }
  },
  exitFullScreen: function(){
      try {
        this.el.webkitExitFullScreen();
      } catch (e) {
        if (e.code == 11) {
          // this.warning(VideoJS.warnings.videoNotReady);
          _V_.log("VideoJS: Video not ready.");
        }
      }
  },
  src: function(src){ this.el.src = src; },
  load: function(){ this.el.load(); },
  currentSrc: function(){ return this.el.currentSrc; },

  preload: function(){ return this.el.preload; },
  setPreload: function(val){ this.el.preload = val; },
  autoplay: function(){ return this.el.autoplay; },
  setAutoplay: function(val){ this.el.autoplay = val; },
  loop: function(){ return this.el.loop; },
  setLoop: function(val){ this.el.loop = val; },

  error: function(){ return this.el.error; },
  // networkState: function(){ return this.el.networkState; },
  // readyState: function(){ return this.el.readyState; },
  seeking: function(){ return this.el.seeking; },
  // initialTime: function(){ return this.el.initialTime; },
  // startOffsetTime: function(){ return this.el.startOffsetTime; },
  // played: function(){ return this.el.played; },
  // seekable: function(){ return this.el.seekable; },
  ended: function(){ return this.el.ended; },
  // videoTracks: function(){ return this.el.videoTracks; },
  // audioTracks: function(){ return this.el.audioTracks; },
  // videoWidth: function(){ return this.el.videoWidth; },
  // videoHeight: function(){ return this.el.videoHeight; },
  // textTracks: function(){ return this.el.textTracks; },
  // defaultPlaybackRate: function(){ return this.el.defaultPlaybackRate; },
  // playbackRate: function(){ return this.el.playbackRate; },
  // mediaGroup: function(){ return this.el.mediaGroup; },
  // controller: function(){ return this.el.controller; },
  controls: function(){ return this.player.options.controls; },
  defaultMuted: function(){ return this.el.defaultMuted; }
});

/* AxthimaDash Support Testing -------------------------------------------------------- */

_V_.axthima.isSupported = function(){
  // test de media source plutot je pense
  return !!(window.MediaSource || window.WebKitMediaSource || window.webkitMediaSource);
};

_V_.axthima.canPlaySource = function(srcObj){
  return srcObj.type == "video/dash";
  // TODO: Check Type
  // If no Type, check ext
  // Check Media Type
};

// List of all HTML5 events (various uses).
_V_.axthima.events = "loadstart,suspend,abort,error,emptied,stalled,loadedmetadata,playing,waiting,seeking,seeked,ended,durationchange,timeupdate,progress,ratechange,volumechange".split(","); // tous sauf play et pause pour pouvoir controler les etat reels de lecture/buffering.

/* HTML5 Device Fixes ---------------------------------------------------------- */

_V_.axthima.prototype.support = {

  // Support for tech specific full screen. (webkitEnterFullScreen, not requestFullscreen)
  // http://developer.apple.com/library/safari/#documentation/AudioVideo/Reference/HTMLVideoElementClassReference/HTMLVideoElement/HTMLVideoElement.html
  // Seems to be broken in Chromium/Chrome && Safari in Leopard
  fullscreen: (typeof _V_.testVid.webkitEnterFullScreen !== undefined) ? (!_V_.ua.match("Chrome") && !_V_.ua.match("Mac OS X 10.5") ? true : false) : false,

  // In iOS, if you move a video element in the DOM, it breaks video playback.
  movingElementInDOM: !_V_.isIOS(),
  formats: {
    "video/dash": "MPD"
  }

};

// Android
if (_V_.isAndroid()) {

  // Override Android 2.2 and less canPlayType method which is broken
  if (_V_.androidVersion() < 3) {
    document.createElement("video").constructor.prototype.canPlayType = function(type){
      return (type && type.toLowerCase().indexOf("video/mp4") != -1) ? "maybe" : "";
    };
  }
}


// Event callbacks ------------------------------------------------------------
_V_.axthima.CheckAutoplay = function ()
{
	if (this.el.autoplay && this.paused())  //histoire de bug
  {
	this.el.poster = null; // Chrome Fix. Fixed in Chrome v16.
	this.play();
  }
}

_V_.axthima.onReady = function(api) {
  console.log('DASH Module Loaded');  
  this.aDash = new api(this.el,this.options.source.src,this.event_handlers,this.player.options.preselected_tracks);
  
  this.player.tech.triggerReady();
  this.player.triggerReady();
  
  
  
  this.player.triggerEvent("canplay");
  
};

_V_.axthima.onMetaData = function(tracksList)
{
	console.log('onMetaDataReceived');
	console.log(tracksList);
	var audiotracksinfos = new Array();
	var videotracksinfos = new Array();
	for(var i=0;i<tracksList.length;i++)
	{
		if(tracksList[i].type == 'audio')
		{
			audiotracksinfos.push(tracksList[i]);
		}
		else if(tracksList[i].type =='video')
		{
			videotracksinfos.push(tracksList[i]);
		}
	}
	if(audiotracksinfos.length)
	{
		this.player.controlBar.addComponent("audioButton", audiotracksinfos);
	}
	if(videotracksinfos.length)
	{
		this.player.controlBar.addComponent("videoButton", videotracksinfos);
	}
}

_V_.axthima.onBuffering = function() {
  this.player.triggerEvent("waiting");
};

_V_.axthima.onFinish = function() {
  this.player.triggerEvent("ended");
  this.pause();
  this.setCurrentTime(0);
};



/* Text Track Menu Items
================================================================================ */
_V_.AlternativeTrackeMenuItem = _V_.MenuItem.extend({

  init: function(player, options,parent){
    // Modify options for parent MenuItem class's init.
	
	this.parentMenu = parent;
	if(!options.auto)
	{
    
    	options.label = (options.lang) ? '['+options.lang+'] '+ Math.floor((options.bandwidth/1024)) + 'kbps' : Math.floor(options.bandwidth/1024) + 'kbps';
	}
	else 
	{
		options.label = (options.lang) ? '['+options.lang+'] ' + "Auto" : 'Auto';
		options.id_rep = -1;
	}
	this.track = options;
    options.selected = options.selected | false;
    this._super(player, options);
	
  },

  onClick: function(){
    this._super();
	for (var i=0; i< this.parentMenu.items.length; i++)
	{
		if(this !== this.parentMenu.items[i])
		{
				this.parentMenu.items[i].selected(false);
		}
	}
	this.player.tech.aDash.switchRepresentation(this.track.type, this.track.id_aset, this.track.id_rep);
  }

});

/* Captions Button
================================================================================ */
_V_.AlternativeTrackButton = _V_.Button.extend({

  init: function(player, options){
    this._super(player, options);

	this.options = options;
	this.player = player;
	
    this.menu = this.createMenu();
	
/*
    if (this.items.length === 0) {
      this.hide();
    } */
  },

  createMenu: function(){
	
    var menu = new _V_.Menu(this.player);

    // Add a title list item to the top
    menu.el.appendChild(_V_.createElement("li", {
      className: "vjs-menu-title",
      innerHTML: _V_.uc(this.kind)
    }));
	
	this.items = new Array();
    
	for(var i=0; i<this.options.length; i++)
	{
		if(this.options[i].auto)
		{
			var m = new _V_.AlternativeTrackeMenuItem(this.player, {type : this.options[i].type, lang:this.options[i].lang,  id_aset :this.options[i].id_aset, auto:true, selected : this.options[i].selected},this);
		}
		else 
		{
			var id_aset = this.options[i].id_aset;
			var bw = this.options[i].bandwidth
			var id_rep = this.options[i].id_rep;
			var selected = this.options[i].selected | false;
      if(this.options[i].lang)
      {
        var tracklang = this.options[i].lang;
      }
			var m = new _V_.AlternativeTrackeMenuItem(this.player, {type : this.options[i].type, lang : tracklang, id_aset:id_aset, id_rep : id_rep, bandwidth : bw, selected : selected},this);
		}
		this.items.push(m);
		menu.addItem(m);
		
	}

    // Add list to element
    this.addComponent(menu);

    return menu;
  },

  buildCSSClass: function(){
    return this.className + " vjs-menu-button " + this._super();
  },

  // Focus - Add keyboard functionality to element
  onFocus: function(){
    // Show the menu, and keep showing when the menu items are in focus
    this.menu.lockShowing();
    // this.menu.el.style.display = "block";

    // When tabbing through, the menu should hide when focus goes from the last menu item to the next tabbed element.
    _V_.one(this.menu.el.childNodes[this.menu.el.childNodes.length - 1], "blur", this.proxy(function(){
      this.menu.unlockShowing();
    }));
  },
  // Can't turn off list display that we turned on with focus, because list would go away.
  onBlur: function(){},

  onClick: function(){
    // When you click the button it adds focus, which will show the menu indefinitely.
    // So we'll remove focus when the mouse leaves the button.
    // Focus is needed for tab navigation.
    this.one("mouseout", this.proxy(function(){
      this.menu.unlockShowing();
      this.el.blur();
    }));
  }

});

_V_.AudioButton = _V_.AlternativeTrackButton.extend({
  kind: "audio",
  buttonText: "Audio Tracks",
  className: "vjs-dashr-audiotracks-button"
});

_V_.VideoButton = _V_.AlternativeTrackButton.extend({
  kind: "video",
  buttonText: "Video Tracks",
  className: "vjs-dashr-videotracks-button"
});

// Add Buttons to controlBar
/*_V_.merge(_V_.ControlBar.prototype.options.components, {
  "audioButton": {},
  "videoButton": {}
});*/



/*
 RequireJS 2.1.1 Copyright (c) 2010-2012, The Dojo Foundation All Rights Reserved.
 Available via the MIT or new BSD license.
 see: http://github.com/jrburke/requirejs for details
*/
var requirejs,require,define;
(function(W){function D(b){return M.call(b)==="[object Function]"}function E(b){return M.call(b)==="[object Array]"}function t(b,c){if(b){var d;for(d=0;d<b.length;d+=1)if(b[d]&&c(b[d],d,b))break}}function N(b,c){if(b){var d;for(d=b.length-1;d>-1;d-=1)if(b[d]&&c(b[d],d,b))break}}function A(b,c){for(var d in b)if(b.hasOwnProperty(d)&&c(b[d],d))break}function O(b,c,d,g){c&&A(c,function(c,j){if(d||!F.call(b,j))g&&typeof c!=="string"?(b[j]||(b[j]={}),O(b[j],c,d,g)):b[j]=c});return b}function r(b,c){return function(){return c.apply(b,
arguments)}}function X(b){if(!b)return b;var c=W;t(b.split("."),function(b){c=c[b]});return c}function G(b,c,d,g){c=Error(c+"\nhttp://requirejs.org/docs/errors.html#"+b);c.requireType=b;c.requireModules=g;if(d)c.originalError=d;return c}function ba(){if(H&&H.readyState==="interactive")return H;N(document.getElementsByTagName("script"),function(b){if(b.readyState==="interactive")return H=b});return H}var g,s,u,y,q,B,H,I,Y,Z,ca=/(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg,da=/[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g,
$=/\.js$/,ea=/^\.\//;s=Object.prototype;var M=s.toString,F=s.hasOwnProperty,fa=Array.prototype.splice,v=!!(typeof window!=="undefined"&&navigator&&document),aa=!v&&typeof importScripts!=="undefined",ga=v&&navigator.platform==="PLAYSTATION 3"?/^complete$/:/^(complete|loaded)$/,R=typeof opera!=="undefined"&&opera.toString()==="[object Opera]",w={},n={},P=[],J=!1;if(typeof define==="undefined"){if(typeof requirejs!=="undefined"){if(D(requirejs))return;n=requirejs;requirejs=void 0}typeof require!=="undefined"&&
!D(require)&&(n=require,require=void 0);g=requirejs=function(b,c,d,p){var i,j="_";!E(b)&&typeof b!=="string"&&(i=b,E(c)?(b=c,c=d,d=p):b=[]);if(i&&i.context)j=i.context;(p=w[j])||(p=w[j]=g.s.newContext(j));i&&p.configure(i);return p.require(b,c,d)};g.config=function(b){return g(b)};g.nextTick=typeof setTimeout!=="undefined"?function(b){setTimeout(b,4)}:function(b){b()};require||(require=g);g.version="2.1.1";g.jsExtRegExp=/^\/|:|\?|\.js$/;g.isBrowser=v;s=g.s={contexts:w,newContext:function(b){function c(a,
f,x){var e,m,b,c,d,h,i,g=f&&f.split("/");e=g;var j=k.map,l=j&&j["*"];if(a&&a.charAt(0)===".")if(f){e=k.pkgs[f]?g=[f]:g.slice(0,g.length-1);f=a=e.concat(a.split("/"));for(e=0;f[e];e+=1)if(m=f[e],m===".")f.splice(e,1),e-=1;else if(m==="..")if(e===1&&(f[2]===".."||f[0]===".."))break;else e>0&&(f.splice(e-1,2),e-=2);e=k.pkgs[f=a[0]];a=a.join("/");e&&a===f+"/"+e.main&&(a=f)}else a.indexOf("./")===0&&(a=a.substring(2));if(x&&(g||l)&&j){f=a.split("/");for(e=f.length;e>0;e-=1){b=f.slice(0,e).join("/");if(g)for(m=
g.length;m>0;m-=1)if(x=j[g.slice(0,m).join("/")])if(x=x[b]){c=x;d=e;break}if(c)break;!h&&l&&l[b]&&(h=l[b],i=e)}!c&&h&&(c=h,d=i);c&&(f.splice(0,d,c),a=f.join("/"))}return a}function d(a){v&&t(document.getElementsByTagName("script"),function(f){if(f.getAttribute("data-requiremodule")===a&&f.getAttribute("data-requirecontext")===h.contextName)return f.parentNode.removeChild(f),!0})}function p(a){var f=k.paths[a];if(f&&E(f)&&f.length>1)return d(a),f.shift(),h.require.undef(a),h.require([a]),!0}function i(a){var f,
b=a?a.indexOf("!"):-1;b>-1&&(f=a.substring(0,b),a=a.substring(b+1,a.length));return[f,a]}function j(a,f,b,e){var m,K,d=null,g=f?f.name:null,j=a,l=!0,k="";a||(l=!1,a="_@r"+(M+=1));a=i(a);d=a[0];a=a[1];d&&(d=c(d,g,e),K=o[d]);a&&(d?k=K&&K.normalize?K.normalize(a,function(a){return c(a,g,e)}):c(a,g,e):(k=c(a,g,e),a=i(k),d=a[0],k=a[1],b=!0,m=h.nameToUrl(k)));b=d&&!K&&!b?"_unnormalized"+(N+=1):"";return{prefix:d,name:k,parentMap:f,unnormalized:!!b,url:m,originalName:j,isDefine:l,id:(d?d+"!"+k:k)+b}}function n(a){var f=
a.id,b=l[f];b||(b=l[f]=new h.Module(a));return b}function q(a,f,b){var e=a.id,m=l[e];if(F.call(o,e)&&(!m||m.defineEmitComplete))f==="defined"&&b(o[e]);else n(a).on(f,b)}function z(a,f){var b=a.requireModules,e=!1;if(f)f(a);else if(t(b,function(f){if(f=l[f])f.error=a,f.events.error&&(e=!0,f.emit("error",a))}),!e)g.onError(a)}function s(){P.length&&(fa.apply(C,[C.length-1,0].concat(P)),P=[])}function u(a,f,b){var e=a.map.id;a.error?a.emit("error",a.error):(f[e]=!0,t(a.depMaps,function(e,c){var d=e.id,
g=l[d];g&&!a.depMatched[c]&&!b[d]&&(f[d]?(a.defineDep(c,o[d]),a.check()):u(g,f,b))}),b[e]=!0)}function w(){var a,f,b,e,m=(b=k.waitSeconds*1E3)&&h.startTime+b<(new Date).getTime(),c=[],g=[],i=!1,j=!0;if(!S){S=!0;A(l,function(b){a=b.map;f=a.id;if(b.enabled&&(a.isDefine||g.push(b),!b.error))if(!b.inited&&m)p(f)?i=e=!0:(c.push(f),d(f));else if(!b.inited&&b.fetched&&a.isDefine&&(i=!0,!a.prefix))return j=!1});if(m&&c.length)return b=G("timeout","Load timeout for modules: "+c,null,c),b.contextName=h.contextName,
z(b);j&&t(g,function(a){u(a,{},{})});if((!m||e)&&i)if((v||aa)&&!T)T=setTimeout(function(){T=0;w()},50);S=!1}}function y(a){n(j(a[0],null,!0)).init(a[1],a[2])}function B(a){var a=a.currentTarget||a.srcElement,b=h.onScriptLoad;a.detachEvent&&!R?a.detachEvent("onreadystatechange",b):a.removeEventListener("load",b,!1);b=h.onScriptError;a.detachEvent&&!R||a.removeEventListener("error",b,!1);return{node:a,id:a&&a.getAttribute("data-requiremodule")}}function I(){var a;for(s();C.length;)if(a=C.shift(),a[0]===
null)return z(G("mismatch","Mismatched anonymous define() module: "+a[a.length-1]));else y(a)}var S,U,h,L,T,k={waitSeconds:7,baseUrl:"./",paths:{},pkgs:{},shim:{},map:{},config:{}},l={},V={},C=[],o={},Q={},M=1,N=1;L={require:function(a){return a.require?a.require:a.require=h.makeRequire(a.map)},exports:function(a){a.usingExports=!0;if(a.map.isDefine)return a.exports?a.exports:a.exports=o[a.map.id]={}},module:function(a){return a.module?a.module:a.module={id:a.map.id,uri:a.map.url,config:function(){return k.config&&
k.config[a.map.id]||{}},exports:o[a.map.id]}}};U=function(a){this.events=V[a.id]||{};this.map=a;this.shim=k.shim[a.id];this.depExports=[];this.depMaps=[];this.depMatched=[];this.pluginMaps={};this.depCount=0};U.prototype={init:function(a,b,c,e){e=e||{};if(!this.inited){this.factory=b;if(c)this.on("error",c);else this.events.error&&(c=r(this,function(a){this.emit("error",a)}));this.depMaps=a&&a.slice(0);this.errback=c;this.inited=!0;this.ignore=e.ignore;e.enabled||this.enabled?this.enable():this.check()}},
defineDep:function(a,b){this.depMatched[a]||(this.depMatched[a]=!0,this.depCount-=1,this.depExports[a]=b)},fetch:function(){if(!this.fetched){this.fetched=!0;h.startTime=(new Date).getTime();var a=this.map;if(this.shim)h.makeRequire(this.map,{enableBuildCallback:!0})(this.shim.deps||[],r(this,function(){return a.prefix?this.callPlugin():this.load()}));else return a.prefix?this.callPlugin():this.load()}},load:function(){var a=this.map.url;Q[a]||(Q[a]=!0,h.load(this.map.id,a))},check:function(){if(this.enabled&&
!this.enabling){var a,b,c=this.map.id;b=this.depExports;var e=this.exports,m=this.factory;if(this.inited)if(this.error)this.emit("error",this.error);else{if(!this.defining){this.defining=!0;if(this.depCount<1&&!this.defined){if(D(m)){if(this.events.error)try{e=h.execCb(c,m,b,e)}catch(d){a=d}else e=h.execCb(c,m,b,e);if(this.map.isDefine)if((b=this.module)&&b.exports!==void 0&&b.exports!==this.exports)e=b.exports;else if(e===void 0&&this.usingExports)e=this.exports;if(a)return a.requireMap=this.map,
a.requireModules=[this.map.id],a.requireType="define",z(this.error=a)}else e=m;this.exports=e;if(this.map.isDefine&&!this.ignore&&(o[c]=e,g.onResourceLoad))g.onResourceLoad(h,this.map,this.depMaps);delete l[c];this.defined=!0}this.defining=!1;if(this.defined&&!this.defineEmitted)this.defineEmitted=!0,this.emit("defined",this.exports),this.defineEmitComplete=!0}}else this.fetch()}},callPlugin:function(){var a=this.map,b=a.id,d=j(a.prefix);this.depMaps.push(d);q(d,"defined",r(this,function(e){var m,
d;d=this.map.name;var x=this.map.parentMap?this.map.parentMap.name:null,i=h.makeRequire(a.parentMap,{enableBuildCallback:!0,skipMap:!0});if(this.map.unnormalized){if(e.normalize&&(d=e.normalize(d,function(a){return c(a,x,!0)})||""),e=j(a.prefix+"!"+d,this.map.parentMap),q(e,"defined",r(this,function(a){this.init([],function(){return a},null,{enabled:!0,ignore:!0})})),d=l[e.id]){this.depMaps.push(e);if(this.events.error)d.on("error",r(this,function(a){this.emit("error",a)}));d.enable()}}else m=r(this,
function(a){this.init([],function(){return a},null,{enabled:!0})}),m.error=r(this,function(a){this.inited=!0;this.error=a;a.requireModules=[b];A(l,function(a){a.map.id.indexOf(b+"_unnormalized")===0&&delete l[a.map.id]});z(a)}),m.fromText=r(this,function(b,e){var f=a.name,c=j(f),d=J;e&&(b=e);d&&(J=!1);n(c);try{g.exec(b)}catch(x){throw Error("fromText eval for "+f+" failed: "+x);}d&&(J=!0);this.depMaps.push(c);h.completeLoad(f);i([f],m)}),e.load(a.name,i,m,k)}));h.enable(d,this);this.pluginMaps[d.id]=
d},enable:function(){this.enabling=this.enabled=!0;t(this.depMaps,r(this,function(a,b){var c,e;if(typeof a==="string"){a=j(a,this.map.isDefine?this.map:this.map.parentMap,!1,!this.skipMap);this.depMaps[b]=a;if(c=L[a.id]){this.depExports[b]=c(this);return}this.depCount+=1;q(a,"defined",r(this,function(a){this.defineDep(b,a);this.check()}));this.errback&&q(a,"error",this.errback)}c=a.id;e=l[c];!L[c]&&e&&!e.enabled&&h.enable(a,this)}));A(this.pluginMaps,r(this,function(a){var b=l[a.id];b&&!b.enabled&&
h.enable(a,this)}));this.enabling=!1;this.check()},on:function(a,b){var c=this.events[a];c||(c=this.events[a]=[]);c.push(b)},emit:function(a,b){t(this.events[a],function(a){a(b)});a==="error"&&delete this.events[a]}};h={config:k,contextName:b,registry:l,defined:o,urlFetched:Q,defQueue:C,Module:U,makeModuleMap:j,nextTick:g.nextTick,configure:function(a){a.baseUrl&&a.baseUrl.charAt(a.baseUrl.length-1)!=="/"&&(a.baseUrl+="/");var b=k.pkgs,c=k.shim,e={paths:!0,config:!0,map:!0};A(a,function(a,b){e[b]?
b==="map"?O(k[b],a,!0,!0):O(k[b],a,!0):k[b]=a});if(a.shim)A(a.shim,function(a,b){E(a)&&(a={deps:a});if(a.exports&&!a.exportsFn)a.exportsFn=h.makeShimExports(a);c[b]=a}),k.shim=c;if(a.packages)t(a.packages,function(a){a=typeof a==="string"?{name:a}:a;b[a.name]={name:a.name,location:a.location||a.name,main:(a.main||"main").replace(ea,"").replace($,"")}}),k.pkgs=b;A(l,function(a,b){if(!a.inited&&!a.map.unnormalized)a.map=j(b)});if(a.deps||a.callback)h.require(a.deps||[],a.callback)},makeShimExports:function(a){return function(){var b;
a.init&&(b=a.init.apply(W,arguments));return b||X(a.exports)}},makeRequire:function(a,f){function d(e,c,i){var k,p;if(f.enableBuildCallback&&c&&D(c))c.__requireJsBuild=!0;if(typeof e==="string"){if(D(c))return z(G("requireargs","Invalid require call"),i);if(a&&L[e])return L[e](l[a.id]);if(g.get)return g.get(h,e,a);k=j(e,a,!1,!0);k=k.id;return!F.call(o,k)?z(G("notloaded",'Module name "'+k+'" has not been loaded yet for context: '+b+(a?"":". Use require([])"))):o[k]}I();h.nextTick(function(){I();p=
n(j(null,a));p.skipMap=f.skipMap;p.init(e,c,i,{enabled:!0});w()});return d}f=f||{};O(d,{isBrowser:v,toUrl:function(b){var d=b.lastIndexOf("."),f=null;d!==-1&&(f=b.substring(d,b.length),b=b.substring(0,d));return h.nameToUrl(c(b,a&&a.id,!0),f)},defined:function(b){b=j(b,a,!1,!0).id;return F.call(o,b)},specified:function(b){b=j(b,a,!1,!0).id;return F.call(o,b)||F.call(l,b)}});if(!a)d.undef=function(b){s();var c=j(b,a,!0),d=l[b];delete o[b];delete Q[c.url];delete V[b];if(d){if(d.events.defined)V[b]=
d.events;delete l[b]}};return d},enable:function(a){l[a.id]&&n(a).enable()},completeLoad:function(a){var b,c,d=k.shim[a]||{},g=d.exports;for(s();C.length;){c=C.shift();if(c[0]===null){c[0]=a;if(b)break;b=!0}else c[0]===a&&(b=!0);y(c)}c=l[a];if(!b&&!o[a]&&c&&!c.inited)if(k.enforceDefine&&(!g||!X(g)))if(p(a))return;else return z(G("nodefine","No define call for "+a,null,[a]));else y([a,d.deps||[],d.exportsFn]);w()},nameToUrl:function(a,b){var c,d,i,h,j,l;if(g.jsExtRegExp.test(a))h=a+(b||"");else{c=
k.paths;d=k.pkgs;h=a.split("/");for(j=h.length;j>0;j-=1)if(l=h.slice(0,j).join("/"),i=d[l],l=c[l]){E(l)&&(l=l[0]);h.splice(0,j,l);break}else if(i){c=a===i.name?i.location+"/"+i.main:i.location;h.splice(0,j,c);break}h=h.join("/");h+=b||(/\?/.test(h)?"":".js");h=(h.charAt(0)==="/"||h.match(/^[\w\+\.\-]+:/)?"":k.baseUrl)+h}return k.urlArgs?h+((h.indexOf("?")===-1?"?":"&")+k.urlArgs):h},load:function(a,b){g.load(h,a,b)},execCb:function(a,b,c,d){return b.apply(d,c)},onScriptLoad:function(a){if(a.type===
"load"||ga.test((a.currentTarget||a.srcElement).readyState))H=null,a=B(a),h.completeLoad(a.id)},onScriptError:function(a){var b=B(a);if(!p(b.id))return z(G("scripterror","Script error",a,[b.id]))}};h.require=h.makeRequire();return h}};g({});t(["toUrl","undef","defined","specified"],function(b){g[b]=function(){var c=w._;return c.require[b].apply(c,arguments)}});if(v&&(u=s.head=document.getElementsByTagName("head")[0],y=document.getElementsByTagName("base")[0]))u=s.head=y.parentNode;g.onError=function(b){throw b;
};g.load=function(b,c,d){var g=b&&b.config||{},i;if(v)return i=g.xhtml?document.createElementNS("http://www.w3.org/1999/xhtml","html:script"):document.createElement("script"),i.type=g.scriptType||"text/javascript",i.charset="utf-8",i.async=!0,i.setAttribute("data-requirecontext",b.contextName),i.setAttribute("data-requiremodule",c),i.attachEvent&&!(i.attachEvent.toString&&i.attachEvent.toString().indexOf("[native code")<0)&&!R?(J=!0,i.attachEvent("onreadystatechange",b.onScriptLoad)):(i.addEventListener("load",
b.onScriptLoad,!1),i.addEventListener("error",b.onScriptError,!1)),i.src=d,I=i,y?u.insertBefore(i,y):u.appendChild(i),I=null,i;else aa&&(importScripts(d),b.completeLoad(c))};v&&N(document.getElementsByTagName("script"),function(b){if(!u)u=b.parentNode;if(q=b.getAttribute("data-main")){if(!n.baseUrl)B=q.split("/"),Y=B.pop(),Z=B.length?B.join("/")+"/":"./",n.baseUrl=Z,q=Y;q=q.replace($,"");n.deps=n.deps?n.deps.concat(q):[q];return!0}});define=function(b,c,d){var g,i;typeof b!=="string"&&(d=c,c=b,b=
null);E(c)||(d=c,c=[]);!c.length&&D(d)&&d.length&&(d.toString().replace(ca,"").replace(da,function(b,d){c.push(d)}),c=(d.length===1?["require"]:["require","exports","module"]).concat(c));if(J&&(g=I||ba()))b||(b=g.getAttribute("data-requiremodule")),i=w[g.getAttribute("data-requirecontext")];(i?i.defQueue:P).push([b,c,d])};define.amd={jQuery:!0};g.exec=function(b){return eval(b)};g(n)}})(this);
window.requirejs = requirejs;
window.require = require;
window.define = define;
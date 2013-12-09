String.prototype.rev = function() { return this.split("").reverse().join(""); }

function ce(type, extra) {
  var e = document.createElement(type);
  if (extra != undefined) {
    for (var x in extra) {
      e[x] = extra[x];
    }
  } 
  return e;
}
function ctn(text) { return document.createTextNode(text) }
Array.prototype.last = function() {return this[this.length - 1]}
Node.prototype.ac = function(c) { return this.appendChild(c) }
Node.prototype.rc = function(c) { return this.removeChild(c) }
Node.prototype.rme = function() { return this.parentNode.removeChild(this) }
Node.prototype.ace = function(type, extra) {
    return this.appendChild(ce(type, extra));
}
Node.prototype.actn = function(text) { return this.appendChild(document.createTextNode(text)); }
Node.prototype.removeChildren = function () {
  while (this.childNodes.length > 0) {
    this.removeChild(this.firstChild);
  }
}
Node.prototype.setText = function (x) {
  this.removeChildren();
  this.actn(x);	
}
function gebid(id) { return document.getElementById(id); }
// $ = gebid;
Event.prototype.key = function() { 
 return (this.which ? 1 : -1) * (this.keyCode ? this.keyCode : this.charCode);
}
String.prototype._split = String.prototype.split;
String.prototype.split = function (del) { 
 if (arguments.length == 0)
  return this._split(" ");
 else
  return this._split(del);
};
Array.prototype.app = function(f) {
 for (var i = 0; i < this.length; i++) {
  f(this[i]);
 }
};
kvs = function(n) {
    var buf = [];
    for (var x in n) {
	buf.push([x,n[x]]);
    }
    return buf;
};
Array.prototype.map = function(f) {
 var l = [];
 for (var i = 0; i < this.length; i++) {
  l[i] = f(this[i]);
 }
 return l;
}
function map(f) {
    return function(a) {
	return a.map(f);
    }
}
function mapit(f) {
    return function(a) {
	return a.mapit(f);
    }
}
function join(s) {
    return function(a) {
	return a.join(s);
    }
}

Array.prototype.mapi = function(f) {
 var l = [];
 for (var i = 0; i < this.length; i++) {
  l[i] = f(i, this[i]);
 }
 return l;
}
Array.prototype.mapit = function(f) {
 var l = [];
 for (var i = 0; i < this.length; i++) {
  l[i] = f([i, this[i]]);
 }
 return l;
}
Array.prototype.equals = function (a, e) {
 if (this.length != a.length) return false;
 if (e == undefined) e = function (x,y) { return x == y; };
 for (var i = 0; i < this.length; i++) {
  if (!e(this[i],a[i])) return false;
 }
 return true;
}
Array.prototype.copy = function () {
 return this.concat();
}

// 'a list list -> 'a list
Array.prototype.cat = function () {
  var acc = [];
  for (i = 0; i < this.length; i++) {
    acc = acc.concat(this[i]);
  } 
  return acc;
}
Array.prototype.hd = function () {
  return this[0];
}
Array.prototype.tl = function () {
  return this.slice(1);
}
Array.prototype.dh = function () {
  return this[this.length - 1];
}
Array.prototype.lt = function () {
  return this.slice(0,this.length - 1);
}

function kvstr (kv) {
    var k = kv[0];
    var v = kv[1];
    return (k + ":" + str(v));
}


var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;

function quote(string) {
        escapable.lastIndex = 0;
        return escapable.test(string) ?
            '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string' ? c :
                    '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' :
            '"' + string + '"';
 }

function str(x) {
    if (typeof x == "string") { return quote(x) }
    if (typeof x == "object") {
	if (x instanceof Array) {return "[" + x.map(str).join(",") + "]"}
	return "{" + kvs(x).map(kvstr).join(",") + "}";
    }
    else {
	return x;
    }
}

function reveal(x,n) {
 var buf = "";
 var indent = "";
 if (n == undefined) n = 0;
 for (var i = 0; i < n; i++)
  indent = indent + " ";
 if (typeof(x) == "object") {
  var buf;
  for (var i in x) {
   if (typeof(x[i]) != "function")
   buf = buf + indent + i + "= (" + reveal(x[i], n + 1) + ")\n";
  }
  return buf;
 }
 else { return x; }
}


function debug (str) {
  var d = gebid("debug");
  d.actn(str);
  d.ace("br");
}

function debugr (str) {
  var d = gebid("debug");
  d.actn(str);
}

function dbg (str) {
  $("debug").actn(str);
}

Array.prototype.listjoin = function(sep, presep) {
  if (this.length == 0) return [];
  
  if (presep == undefined) n = [this[0]];
  else n = [presep,this[0]];

  for (var i = 1; i < this.length; i++) {
    n.push(sep);
    n.push(this[i]);
  }	
  return n;
}
     
 function shallow(x) {
     var n = {};
     for (i in x) { n[i] = x[i]; }
     return n;
 };


// add class name
Node.prototype.acn = function(cn) {
    var cns = this.className.split(" ");
    for (i = 0; i < cns.length; i++) {
	if (cns[i] == cn) return;
    }
    if (!this.className) this.className = cn;
    else  this.className = this.className + " " + cn;
};

// remove class name
Node.prototype.rcn = function(cn) {
    var cns = this.className.split(" ");
    var ncns = [];
    for (i = 0; i < cns.length; i++) {
	if (cns[i] != cn) ncns.push(cns[i]);
    }
    this.className = ncns.join(" ");
};

// insert before me
Node.prototype.ibme = function(d) {
 this.parentNode.insertBefore(d, this);
};

var TEXT_NODE = 3;
var ELEMENT_NODE = 1;

function textNodes(x) {
    var rv = [];
    function acc(p) {
	var c = p.firstChild;
	while (c) {
	    if (c.nodeType == TEXT_NODE) rv.push(c);
	    if (c.nodeType == ELEMENT_NODE) acc(c);
	    c = c.nextSibling;
	}
    }
    acc(x);
    return rv;
}

function chr (x) {
    return String.fromCharCode(x);
}

function unique (tag) {
 return document.getElementsByTagName(tag)[0];
}

function localKeys () {
  var rv = [];
  for (i = 0; i < localStorage.length; i++)
   rv.push(localStorage[i]);
  return rv;
}
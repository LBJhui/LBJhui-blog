var folderImage     = 'design/image/TreeDirClosed.gif';
var openFolderImage = 'design/image/TreeDirOpen.gif';
var fileImage       = 'design/image/new.gif';
var lineImage       = 'design/image/TreeLine.gif';
var lImage          = 'design/image/TreeBranch2.gif';
var lMinusImage     = 'design/image/TreeMinus2.gif';
var lPlusImage      = 'design/image/TreePlus2.gif';
var tImage          = 'design/image/TreeBranch1.gif';
var tMinusImage     = 'design/image/TreeMinus1.gif';
var tPlusImage      = 'design/image/TreePlus1.gif';
var blankImage      = 'design/image/blank.gif';
var __tree;

function hi(object)
{
  object.style.backgroundColor  = "#ffb6c1";
  object.style.borderColor = "rgb(176,8,95)";
}

function lo(object)
{
  object.style.backgroundColor  = "";
  object.style.borderColor      = "white";
}

function Tree()
{
  this.source          = "";
  this.mode            = 0;
  this.adapterURL      = "";
  __tree               = this;
  this.id              = -1;
  this.nodes           = [];
  this.backcolor       = "white";
  this.tablebackcolor  = "white";
  this.background      = "white";
  this.font            = "Arial";
  this.fontsize        = "11px";
  this.fontcolor       = "black";
  this.fontbackcolor   = "";
  this.fontbold        = false;
  this.fontitalic      = false;
  this.selectfontcolor = "black";
  this.selectfontbackcolor = "";
  this.folderIcon      = folderImage;
  this.openFolderIcon  = openFolderImage;
  this.icons           = true;
  this.highlight       = false;
  var node             = new Node("__ROOT");
  node.isMaster        = true;
  node.open            = true;
  node.tree            = this;
  this.nodes[this.nodes.length] = node;
  this.rootnode        = node;
  this._selNode        = null;
  this._scrollY        = 0;
  this.callback_select = null;
  this.callback_click  = null;
  this.isFolderOpenedWhenTextClicked = false;
}

Tree.prototype.setIconsBlank = function()
{
  lineImage       = 'design/image/blank.gif';
  lImage          = 'design/image/blank.gif';
  lMinusImage     = 'design/image/blank.gif';
  lPlusImage      = 'design/image/blank.gif';
  tImage          = 'design/image/blank.gif';
  tMinusImage     = 'design/image/blank.gif';
  tPlusImage      = 'design/image/blank.gif';
  return false;
}

Tree.prototype._getID = function()
{
  // get next id
  this.id++;
  return this.id;
}

Tree.prototype._nodeclick = function(id,y)
{
  this._scrollY = y;
  this.nodes[id].nodeclick();
}

Tree.prototype._nodeselect = function(id)
{
  this.nodes[id].nodeselect();
}

Tree.prototype.setMode = function (mode) {
  this.mode =  mode;
  if(this.mode == 1) {
    if(this.adapterURL != "") {
      __comm = new Comm(this.adapterURL);
    }
  }
};

Tree.prototype.getMode = function ()
{
  return this.mode;
};

Tree.prototype.setAdapterURL = function (url)
{
  this.adapterURL =  url;
};

Tree.prototype.add = function (node)
{
  // add the new node to the internal root node
  this.rootnode.add(node);
};

Tree.prototype.createHTML = function ()
{
  var html = "";
  var crlf = "\r";

  html +="<table bgcolor=\"" + this.tablebackcolor + "\" border='0' cellspacing='0'>" + crlf;
  html +="<tr>" + crlf;
  html +="<td nowrap>" + crlf;
  for (var i = 0; i < this.rootnode._subNodes.length; i++) {
    html += this.rootnode._subNodes[i].createHTML(i,this.rootnode._subNodes.length) + crlf;
  }

  html +="</td>" + crlf;
  html +="</tr>" + crlf;
  html +="</table>" + crlf;

  return html;
};

Tree.prototype.getSelectedNode = function ()
{
  return this._selNode;
}

Tree.prototype.draw = function ()
{
  document.body.innerHTML = this.createHTML();
}

function Node(name, action, key, icon)
{
  this._subNodes  = [];
  this._lastNode  = false;
  this.name       = name;
  this.action     = action || "javascript:void(0);";
  this.id         = __tree._getID();
  this.expanded   = false;
  this.key        = key;
  this.tree       = null;
  this.isRoot     = false;
  this.icon       = icon;
  this.parent     = null;
};

Node.prototype.add = function (node)
{
  node.parent = this;
  node.tree   = this.tree;
  this._subNodes[this._subNodes.length] = node;
  // hold the tree in array, necessary for identifying node after call back
  this.tree.nodes[this.tree.nodes.length] = node;
  if(this.name == "__ROOT")
    // make this node to root node, because it is the first visible node
    node.isRoot = true;
};

Node.prototype.nodeclick = function ()
{
  if (this.expanded) {
    this.collapse();
  } else {
    this.expand();
  }
}

Node.prototype.nodeselect = function ()
{

  if(this.tree._selNode) {
    this.tree._selNode.deselect();
  }
  this.tree._selNode = this;

  document.getElementById(this.id + '.0').style.backgroundColor = this.tree.selectfontbackcolor;
  document.getElementById(this.id + '.0').style.color = this.tree.selectfontcolor;

  if(!this.tree.callback_select == null)
    this.tree.callback_select();
}

Node.prototype.deselect = function ()
{
  var color = "";
  var backcolor = "";

  if(!this.fontcolor)
    color = this.tree.fontcolor;

  if(this.fontbackcolor)
    backcolor = this.fontbackcolor;
  else if(!this.fontbackcolor && this.tree.fontbackcolor)
    backcolor = this.tree.fontbackcolor;
  else
    backcolor = "";

  var obj = document.getElementById(this.id + '.0');
  if(obj != null) {
    obj.style.backgroundColor = backcolor;
    obj.style.color = color;
  }
}

Node.prototype.expand = function ()
{
  this.expanded = true;

  if(this.tree.mode == 1) {
    // delete all sub items
    this._subNodes = [];
    this._lastNode  = false;
    // save current tree
    this.tree.currentNode = this;
    // get nodes from server
    this.tree.getSubTree();
  } else {
    this.tree.draw();
  }
}

Node.prototype.collapse = function ()
{
  this.expanded = false;
  this.tree.draw();
}

Node.prototype.activate = function ()
{
  this.nodeselect();
  eval(this.action);
}

Node.prototype.createHTML = function (node,nodeCount)
{
  var parentNode = this.parent;
  var indent     = '';
  var icon       = "";
  var crlf       = "\r";
  var font       = "";
  var size       = "";
  var color      = "";
  var backcolor  = "";
  var bold       = false;
  var italic     = false;
  var id         = "";
  var scroll     = "";

  if(!this.font)
    font = "font-family:" + this.tree.font + ";";
  else
    font = "font-family:" + this.font + ";";
  if(!this.fontsize)
    size = "font-size:" + this.tree.fontsize + ";";
  else
    size = "font-size:" + this.fontsize + ";";
  if(!this.fontcolor)
    color = "color:" + this.tree.fontcolor + ";";
  else
    color = "color:" + this.fontcolor + ";";
  if(!this.fontbackcolor && this.tree.fontbackcolor != "")
    backcolor = "background-color:" + this.tree.fontbackcolor + ";";
  else if(this.fontbackcolor)
    backcolor = "background-color:" + this.fontbackcolor + ";";
  else
    backcolor = "";
  if(this.fontbold)
    bold = "font-weight:bold;";
  else
    bold = "font-weight:normal;";

  if (node + 1 == nodeCount) {
    // determine last node
    this.parent._lastNode = true;
  }

  while (parentNode.parent && !parentNode.parent.isMaster) {
    parentNode = parentNode.parent;
    icon = parentNode._lastNode ? blankImage : lineImage;
    indent = "<td width=\"1%\"><img border=0 src=\"" + icon + "\"></td>" + indent;
  }
  parentNode = this.parent;
  if(this.tree.mode == 1) {
    this.folder = 1;
  } else {
    if (this._subNodes.length) {
      this.folder = 1;
    }
  }
  if(this.tree.highlight && (is.ie || is.ns6))
    var html = "<table style=\"border-width: 1px; border-style: solid; border-color:" + this.tree.backcolor + ";\" onmouseover=\"javascript:hi(this);\" onmouseout=\"javascript:lo(this);\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\">"
  else
    var html = "<table cellspacing=\"0\" cellpadding=\"0\">"

  if (this.folder) {
    if (!this.icon) {
      this.icon = this.tree.folderIcon;
    }
    if (!this.openIcon) { this.openIcon = this.tree.openFolderIcon; }
    if(this.expanded)
      this.icon = this.tree.openFolderIcon;
    else
      this.icon = this.tree.folderIcon;

    html += "<tr>" + crlf;
    html += indent + crlf;
    icon = ((this.expanded)?((this.parent._lastNode)?lMinusImage:tMinusImage):((this.parent._lastNode)?lPlusImage:tPlusImage));
    if(is.ie)
      scroll = ",document.body.scrollTop";
    else
      scroll = ",window.pageYOffset";
    if(!parentNode.isMaster) {
      html += "<td width=\"1%\"><a  style=\"text-decoration: none;\" href=\"javascript:void(0);\" onclick=\"javascript:" + "__tree._nodeclick(" + this.id + scroll + ");\"><img id=\"" + this.id + ".1\" border=0 src=\"" + icon + "\" ></a></td>" + crlf;
    }
    if(this.tree.icons)
      html += "<td width=\"1%\"><a style=\"text-decoration: none;\"  href=\"javascript:void(0);\" onclick=\"javascript:" + "__tree._nodeclick(" + this.id + scroll + ");\"><img id=\"" + this.id + ".2\" border=0 src=\"" + this.icon + "\"  ></a></td>" + crlf;
    id = "id=\"" + this.id + ".0\"";

    if(this.tree.isFolderOpenedWhenTextClicked)
      html += "<td nowrap><a style=\"text-decoration: none;\"  href=\"" + this.action + "\" target=\"" + this.tree.target + "\" onclick=\"" + "__tree._nodeclick(" + this.id + scroll + ");\"><div " + id + " style=\"text-decoration: none;" + bold + font + size + color + backcolor + "\">" + this.name + "</div></a></td>" + crlf;
    else
      html += "<td nowrap><a style=\"text-decoration: none;\"  href=\"" + this.action + "\" target=\"" + this.tree.target + "\" onclick=\"" + "__tree._nodeselect(" + this.id + ");\"><div " + id + " style=\"text-decoration: none;" + bold + font + size + color + backcolor + "\">" + this.name + "</div></a></td>" + crlf;
    html += "</tr>" + crlf;
    html += "</table>" + crlf;

    if(this.expanded) {
      for (var i = 0; i < this._subNodes.length; i++) {
        html += this._subNodes[i].createHTML(i,this._subNodes.length) + crlf;
      }
      this._lastNode = false;
    }

  } else {
    if (!this.icon) {
      this.icon = fileImage;
    }
    html += "<tr>" + crlf;
    html += indent + crlf;
    icon = this.parent._lastNode ? lImage : tImage;
    if(!parentNode.isMaster) {
      html += "<td width=\"1%\"><img id=\"" + this.id + ".1\" border=0 src=\"" + icon + "\"></td>" + crlf;
    }
    if(this.tree.icons)
      html += "<td width=\"1%\"><a href=\"javascript:void(0);\" onclick=\"" + "__tree._nodeselect(" + this.id + ");\"><img id=\"" + this.id + ".2\" border=0 src=\"" + this.icon + "\" ></a></td>" + crlf;
    if(!is.ns4) {
      id = "id=\"" + this.id + ".0\"";
    }
    html += "<td nowrap><a style=\"text-decoration: none;\" href=\"javascript:void(0);\" onclick=\"javascript:__tree._nodeselect(" + this.id + ");\"><div " + id + " style=\"" + bold + font + size + color + backcolor + "\">" + this.name + "</div></a></td>" + crlf;

    html += "</tr>" + crlf;
    html += "</table>" + crlf;
  }
  this.plusIcon = ((this.parent._lastNode) ? lPlusImage : tPlusImage);
  this.minusIcon = ((this.parent._lastNode) ? lMinusImage : tMinusImage);
  return html;
}

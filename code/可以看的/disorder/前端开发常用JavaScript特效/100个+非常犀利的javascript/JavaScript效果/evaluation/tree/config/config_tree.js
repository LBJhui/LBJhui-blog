var tree;

function onNodeClick()
{
	var node = tree.getSelectedNode();
	parent.document.getElementById("main").src = node.action;
}

function configTree()
{
	var red = "rgb(176,8,95)";
	var highlight = "black";
	var web       = "";
	var newString = "<font color='red'>&nbsp;(New)</font>";

	if(is.opera)
		web = "../../";

	tree                 = new Tree();
	tree.backcolor       = "#ECE9D8"
	tree.selectfontcolor = red; //"rgb(176,8,95)";
	tree.highlight       = true;
	tree.font            = "Verdana, Arial, Helvetica, sans-serif"
	tree.fontsize        = "11px";
	tree.folderIcon      = "images/closed.gif";
	tree.openFolderIcon  = "images/opened.gif";
	tree.isFolderOpenedWhenTextClicked = true;
	tree.setIconsBlank();
	tree.onNodeClick         = "onNodeClick()";


	var node0 = new Node("New - pinNavigator 2.0");
	node0.fontbold = true;
	node0.fontcolor = highlight;
	node0.fontcolor = "red";
	node0.expanded = true;
	tree.add(node0);

	var node100 = new Node("New features",web + "evaluation/doc/newfeatures.html")
	node100.fontbold = true;
	node0.add(node100);

	var node2 = new Node("pinNavigator Samples");
	node2.fontbold = true;
	node2.fontcolor = highlight;
	node2.expanded = true;
	node0.add(node2);

	var node3 = new Node("Basics");
	node3.fontbold = true;
	node3.fontcolor = highlight;
	node3.expanded = true;
	node2.add(node3);
  node3.add(new Node("Url based",web + "evaluation/samples/urlbased/urlbased.html"));
  node3.add(new Node("Simple",web + "evaluation/samples/simple/simple.html"));
  node3.add(new Node("Caching pages" + newString,web + "evaluation/samples/cache/cache.html"));

	var node3 = new Node("Design");
	node3.fontbold = true;
	node3.fontcolor = highlight;
	node3.expanded = true;
	node2.add(node3);
  node3.add(new Node("Styles" + newString,web + "evaluation/samples/styles/styles.html"));

	// Using .Net features
	var node3 = new Node("Using .Net features");
	node3.fontbold = true;
	node3.fontcolor = highlight;
	node3.expanded = true;
	node2.add(node3);
	node3.add(new Node("Initiate postback",web + "evaluation/samples/netonly.html"));
	node3.add(new Node("Use .Net validation/postback I" + newString,web + "evaluation/samples/netonly.html"));
	node3.add(new Node("Use .Net validation/postback II" + newString,web + "evaluation/samples/netonly.html"));
	node3.add(new Node("Activate item after postback " + newString,web + "evaluation/samples/netonly.html"));

	var node3 = new Node("Split area");
	node3.fontbold = true;
	node3.fontcolor = highlight;
	node3.expanded = true;
	node2.add(node3);
  node3.add(new Node("Split Area",web + "evaluation/samples/splitarea/area.html"));
  node3.add(new Node("Split Area Load",web + "evaluation/samples/splitareaaction/areaaction.html"));
  node3.add(new Node("Split Area Access",web + "evaluation/samples/splitareaaction/areaaction2.html"));


	var node3 = new Node("Client features");
	node3.fontbold = true;
	node3.fontcolor = highlight;
	node3.expanded = true;
	node2.add(node3);
  node3.add(new Node("Call a tab item page function" + newString,"evaluation/samples/call/call.html"));
  node3.add(new Node("Client Event" + newString,"evaluation/samples/event/event.html"));
  node3.add(new Node("API" + newString,"evaluation/samples/api/api.html"));
  node3.add(new Node("Expand/Collapse","evaluation/samples/expand/expand.html"));
  node3.add(new Node("Activate item","evaluation/samples/activate/activate.html"));


	var node3 = new Node("Misc");
	node3.fontbold = true;
	node3.fontcolor = highlight;
	node3.expanded = true;
	node2.add(node3);
  node3.add(new Node("Extended","evaluation/samples/extended/extended.html"));


	var node8 = new Node("pinNavigator Docs");
	node8.fontbold = true;
	node8.fontcolor = highlight;
	//node8.expanded = true;
	node0.add(node8);

  node8.add(new Node("pinNavigator Data Sheet","evaluation/doc/pinNavigatorDataSheet.pdf"));
  node8.add(new Node("pinNavigator Manual","evaluation/doc/pinNavigatorManual.pdf"));

  var node15 = new Node("Download pinNavigator");
  node15.fontbold = true;
  node15.fontcolor = "blue";
  node15.expanded = true;
  tree.add(node15);

  node15.add(new Node("pinNavigator Evaluation","http://www.pintexx.com/application/products/development/pinNavigator/download_files.html"));

  var node16 = new Node("Purchase pinNavigator");
  node16.fontbold = true;
  node16.fontcolor = "blue";
  node16.expanded = true;
  tree.add(node16);

  node16.add(new Node("Licencing","http://www.pintexx.com/application/products/development/pinNavigator/preise.html"));
  node16.add(new Node("Purchase","http://www.pintexx.com/application/products/order.html"));

	tree.draw();

}
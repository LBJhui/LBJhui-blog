function configTree()
{
  var tree;
  var red       = "rgb(176,8,95)";
  var highlight = "black";

  tree                 = new Tree();
  //tree.backcolor       = "#ECE9D8"
  tree.selectfontcolor = red;
  tree.highlight       = true;
  tree.font            = "Verdana, Arial, Helvetica, sans-serif"
  tree.fontsize        = "11px";
  //tree.folderIcon      = "design/image/closed.gif";
  //tree.openFolderIcon  = "design/image/opened.gif";
  //tree.isFolderOpenedWhenTextClicked = true;
  //tree.setIconsBlank();

  var node = new Node("Root");
  node.expanded = true;
  tree.add(node);

  var node1 = new Node("Node1")
  node.add(node1);

  var node2 = new Node("Node2")
  node1.add(node2);

  var node3 = new Node("Node3")
  node.add(node3);

  var node4 = new Node("Node4")
  node3.add(node4);

  tree.draw();

}
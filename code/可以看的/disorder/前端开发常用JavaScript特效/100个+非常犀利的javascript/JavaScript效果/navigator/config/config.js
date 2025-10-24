function createNavigator()
{
  objNavigator = new Navigator();
  objNavigator.design = "2";
  objNavigator.splitarea = true;
  objNavigator.splitwidth = 4;
  objNavigator.splitcolor = "#C4DAFA";
  objNavigator.splittype = 1;
  objNavigator.width = "250";
  objNavigator.url = "../evaluation/samples/p1.html";

  objNavigator.add( new NavigatorItem("E-Mail","design/image/email.gif","",true,true,"../evaluation/samples/p5.html"));
  objNavigator.add( new NavigatorItem("ToDo","design/image/email.gif","",false,true,"file://D:/Systems/server/tomcat/jakarta-tomcat-4.1.24/webapps/pinTree.Work/tree/pinTree.html"));
  objNavigator.add( new NavigatorItem("1","design/image/email.gif","",false,true,"../evaluation/samples/p3.html"));
  objNavigator.add( new NavigatorItem("2","design/image/email.gif","",false,true,"../evaluation/samples/p4.html"));
  objNavigator.add( new NavigatorItem("3","design/image/email.gif","",false,false,"../evaluation/samples/p4.html"));
  objNavigator.add( new NavigatorItem("4","design/image/email.gif","",false,false,"../evaluation/samples/p4.html"));

  objNavigator.create();
}
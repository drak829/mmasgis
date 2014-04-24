<%@ page import="java.util.*,java.sql.*,java.io.*" %>
<%
if(session.getAttribute("username") == null) {
	response.sendRedirect("http://gis.di.unimi.it/k1-azienda/src/index.php");
	//response.sendRedirect("http://www.metmi.it/k1_aziende/src/index.php");
	
}

String user_id = (String) session.getAttribute("user_id");
String username = (String) session.getAttribute("username");
String permessi = (String) session.getAttribute("permessi");

System.out.println(permessi);
//se ha il permesso 20 allora do la ZA
String mapFolder=null;
if (permessi.indexOf("20") < 0)
	mapFolder = "mappa";
else{
	mapFolder = "mappaZA";
}




String censimenti = (String) session.getAttribute("censimenti");
String customer = request.getParameter("customer");
String id_offerta = "";
String id_vetrina = "";
if(request.getParameterMap().containsKey("id_offerta")) {
	id_offerta = request.getParameter("id_offerta");
}
if(request.getParameterMap().containsKey("id_vetrina")) {
	id_vetrina = request.getParameter("id_vetrina");
}
%>
<html>
	<form id="showFeatures" action="risultati.jsp" method="post"
		<% if(id_offerta.equals("")&&id_vetrina.equals("")){ out.print("target=\"new_tab\""); }%>>
		<input type="hidden" name="reg" value=""> <input type="hidden" name="pro" value=""> <input type="hidden" name="com" value="">
		<input type="hidden" name="cap" value=""> <input type="hidden" name="dbname" value=""> <input type="hidden" name="custom" value="">
		<input type="hidden" name="customer" value="" /> 
		<input type="hidden" name="dbpers" value=""> <input type="hidden" name="id_offerta" value=""> <input type="hidden" name="id_vetrina" value="">
	</form>
	<head>
		<link rel="shortcut icon" href="img/tomcat.ico">
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
		<meta name="apple-mobile-web-app-capable" content="yes">
		<link rel="stylesheet" href="css/button.css" type="text/css">
		<link rel="stylesheet" href="css/style.css" type="text/css">
		<link rel="stylesheet" href="css/basic_style.css" type="text/css">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<link rel="stylesheet" type="text/css" href="extjs/resources/css/ext-all-gray.css">
		<script src="js/const.js"></script>
		<script src="http://maps.google.com/maps/api/js?v=3&amp;sensor=false"></script>
		<script type="text/javascript" src="js/openlayers/OpenLayers.js"></script>
		<script type="text/javascript">
				var user_id = '<%=user_id%>';
				var username = '<%=username%>';
				var permessi = <%=permessi%>;
				var lista_censimenti = <%=censimenti%>;
				var customer = "<%=customer%>";
				var id_offerta = '<%=id_offerta%>';
				var id_vetrina = '<%=id_vetrina%>';
		</script>
		<!--<script type="text/javascript" src="extjs/adapter/ext/ext-base.js"></script>-->
		<script type="text/javascript" src="extjs/ext-all.js"></script>
		<script type="text/javascript" src="js/auth.js"></script>
		<script type="text/javascript" src="js/<%=mapFolder%>/map.js"></script>
		<script type="text/javascript" src="js/<%=mapFolder%>/tree.js"></script>
		<script type="text/javascript" src="js/<%=mapFolder%>/box.js"></script>
		<script type="text/javascript" src="js/<%=mapFolder %>/top.js"></script>
		<script>
		if(permessi.indexOf("20") > 0){
			document.write("<script type='text/javascript' src='js/mappaZA/scenario.js'></scrip" + "t>");
			document.write("<script type='text/javascript' src='js/mappaZA/zone.js'></scrip" + "t>");
		}
		</script>
		<title id="page-title">MMASGIS</title>
	</head>
	<body>
	</body>
</html>
function NewWindow(	sPageName, 
			sURL, 
			iXpos,
			iYpos,
			iWidth, 
			iHeight,
			bScrollbars
		      )
{

	var sHTML	= "toolbar=no,"
			+ "location=no,"
			+ "directories=no,"
			+ "status=no,"
			+ "menubar=no,"
			+ "fullscreen=no,"
			+ "resizable=no,"
			+ "left=" + iXpos + ","
			+ "top=" + iYpos + ","
			+ "width=" + iWidth + ","
			+ "height=" + iHeight + ","
			+ "scrollbars=" + bScrollbars;
	var w = window.open( sPageName, sURL, sHTML );
	w.focus();

}

function convertDecimal(field) 
{
	var value = field.value;

	var newValue = value.replace(/,/,".");
	field.value = newValue;
}
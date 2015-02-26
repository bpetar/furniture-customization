
//TODO:


function hideTabs()
{
	document.getElementById( "id-shelf-container").style.display="none";
	remove_element_class("id-menu-shelf","menu_option_selected");
	document.getElementById( "id-sofa-container").style.display="none";
	remove_element_class("id-menu-sofa","menu_option_selected");
	document.getElementById( "id-kitchen-container").style.display="none";
	remove_element_class("id-menu-kitchen","menu_option_selected");
	document.getElementById( "id-contact-container").style.display="none";
	remove_element_class("id-menu-contact","menu_option_selected");
}

function goToSofaTab()
{
	hideTabs();
	document.getElementById( "id-sofa-container").style.display="block";
	add_element_class("id-menu-sofa","menu_option_selected");
	
	initSofa3dView();
}

function goToShelfTab()
{
	hideTabs();
	document.getElementById( "id-shelf-container").style.display="block";
	add_element_class("id-menu-shelf","menu_option_selected");
}
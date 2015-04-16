
//TODO:


function hideTabs()
{
	document.getElementById( "id-shelf-container").style.display="none";
	remove_element_class("id-menu-shelf","c-menu-option-selected");
	document.getElementById( "id-sofa-container").style.display="none";
	remove_element_class("id-menu-sofa","c-menu-option-selected");
	document.getElementById( "id-kitchen-container").style.display="none";
	remove_element_class("id-menu-kitchen","c-menu-option-selected");
	document.getElementById( "id-contact-container").style.display="none";
	remove_element_class("id-menu-contact","c-menu-option-selected");
}

function goToSofaTab()
{
	hideTabs();
	document.getElementById( "id-sofa-container").style.display="block";
	add_element_class("id-menu-sofa","c-menu-option-selected");
	
	initSofa3dView();
}

function goToShelfTab()
{
	hideTabs();
	document.getElementById( "id-shelf-container").style.display="block";
	add_element_class("id-menu-shelf","c-menu-option-selected");
}

function goToKitchenTab()
{
	hideTabs();
	document.getElementById( "id-kitchen-container").style.display="block";
	add_element_class("id-menu-kitchen","c-menu-option-selected");
}

function goToContactTab()
{
	hideTabs();
	document.getElementById( "id-contact-container").style.display="block";
	add_element_class("id-menu-contact","c-menu-option-selected");
}
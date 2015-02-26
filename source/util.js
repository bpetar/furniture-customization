
//TODO:


function add_element_class(element,classy)
{
	var e = document.getElementById(element);
	if(!(e.classList.contains(classy)))
	{
		e.classList.add(classy);
	}
}

function remove_element_class(element,classy)
{
	var e = document.getElementById(element);
	if(e.classList.contains(classy))
	{
		e.classList.remove(classy);
	}
}
import Navigation from '../js/NavigationSpa.js';
import Util from '../js/Util.js';

Util.addOnLoad(()=>
{

  let n = new Navigation();
	n.debug = true;

	//let page1 = new Page({ element: '#page1'});
	//let page2 = new Page({ element: '#page2'});
	//let page3 = new Page({ element: '#page3'});

	//page3.setOnShow(()=>
	//{
	//	console.log('on init page3');
	//	let page4	= new Page
	//	({
	//		template	: '<div>Hello World <a href="#" data-click="back"></div>'
	//		,removeOnPop	: true
	//	});

	//	page4.setOnInit(()=>
	//	{
	//		let x = page3._element.querySelector('[data-new-page]');
	//		x.setAttribute('href','#'+page4.getId());
	//	});

	//	n.router.setPageHandler('/page4/',page4 );
	//});

	//n.router.setPageHandler('/page1/',page1 );
	//n.router.setPageHandler('/page2/',page2 );
	//n.router.setPageHandler('/page3/',page3 );

	//console.log('Page 1 is ', page1.getId() );

	n.setPageInit( 'page1' );
	page1 = document.getElementById('page1');
	page1.addEventListener('page-show',(evt)=>
	{
		console.log('Page1 show',evt);
	});
	page1.addEventListener('page-hide',(evt)=>
	{
		console.log('Page1 hide',evt);
	});
});

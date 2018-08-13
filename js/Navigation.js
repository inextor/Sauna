class Navigation
{
	constructor()
	{
		this.history					= [];
		this.history_begins_index		= window.history.length;
		this.handle_url_parameters		= true;
		this.router						= new Router( this );
		this.debug						= false;
		this.lastPage					= null;
	}

	setInitPageId( pageInitId )
	{
		this.log('PageInitId '+pageInitId);

		Utils.delegateEvent('click',document.body,'a',(evt)=>
		{

			let href = evt.target.getAttribute('href');

			if( ! href || href === '#') return;


			let hash	= href.substring( href.indexOf('#')+1 );
			let bang	= hash.indexOf('!');

			if( bang !== -1 )
			{
				hash = hash.substring( 0, bang );
			}

			var obj	= Utils.getById( hash );

			if( ! obj )
				return;

			evt.preventDefault();
			evt.stopImmediatePropagation();

			if( obj.classList.contains('page') || obj.classList.contains('panel') )
			{
				this.click_anchorHash( href, false );
				Utils.stopEvent( evt );
				return;
			}
		});

		window.addEventListener( 'popstate' , (evt)=>{ this.evt_popstate(evt); } );

		var x			= Utils.getAll('div.page');
		var last		= Utils.getById( pageInitId );
		this.lastPage	= this.router.getById( pageInitId );

		last.classList.add('start');
		this.click_anchorHash('#'+pageInitId , false );
	}


	log(...args)
	{
		if( this.debug )
			console.log.call(console,args);
	}

	click_anchorHash( h, replace = false )
	{
		let clickedHashId	= h.substring( h.indexOf('#')+1 );
		let bang	= clickedHashId.indexOf('!');

		if( bang !== -1 )
		{
			clickedHashId = clickedHashId.substring( 0, bang );
		}

		var current			= Utils.getFirst('.panel.open') || Utils.getFirst('.page.active');

		if( current === null || ( current.getAttribute( 'id' ) == clickedHashId && !current.classList.contains('panel') ) )
		{
			if( this.handle_url_parameters )
			{
				history.pushState({},'', h );
				let page = this.router.run( window.location.href );
				//page.onShow();
			}
			return;
		}

		var target	= Utils.getById( clickedHashId );

		if( !target )
		{
			this.log('No found id: '+clickedHashId );
			return;
		}

		// target is a panel
		if( target.classList.contains('panel') )
		{
			//if targe is a panel and is open just close it
			if( target.classList.contains('open') )
			{
				target.classList.remove('open');
				document.body.classList.remove('panel-open');
				history.replaceState( {},'', this.history.pop() );
				return;
			}

			if( current && current.classList.contains('panel') )
			{
				this.openPanelFromPanel( target, current);
				history.replaceState({},'',h );
				return;
			}
			//Target is a panel and there are not panels open
			target.classList.add('open');
			document.body.classList.add('panel-open');
			var page = Utils.getFirst('.page.active');
			this.openPanelFromPage( target, page );
			this.history.push( window.location.href );
			history.pushState( {},'', h );
			return;
		}

		//Target is not a panel
		var isFromPanel = false;

		//If there is a panel open just close it and continue
		if( current && current.classList.contains( 'panel' ) )
		{
			isFromPanel	= current.getAttribute('id');
		}


		var prev		= false;
		var toRemove	= [];
		for( var i=this.history.length-1; i>=0; i-- )
		{
			toRemove.push( this.history[ i ] );

			//TODO BUG problems with diff hash with similar endings
			//are detected as equals example #pageRide and #pageRides
			var index	= this.history[ i ].indexOf( '#'+clickedHashId );
			var diff	= this.history[i].length - ( clickedHashId.length + 1 );
			if( index !== -1 && diff === index )
			{
				prev = i;
				break;
			}
		}

		if( prev === false )
		{
			//new push
			if( isFromPanel )
			{
				history.replaceState({},'',h );
				prev	= this.history[ this.history.length -1 ];
				this.pushPageFromPanel( target, current );
				return;
			}

			if( replace )
			{
				history.replaceState({},'',h );
				this.makeTransitionPush( current, target );
				return;
			}

			this.history.push( location.href );
			history.pushState({},'',h );
			this.makeTransitionPush( current, target);
			return;
		}

		//Pop Events
		history.replaceState({},'', h );

		if( isFromPanel )
			this.popPageFromPanel( target, current);
		else
			this.popPageFromPage( current, target );

		//Removing the previous
		while( toRemove.length )
		{
			var url = toRemove.shift();
			let zz	= this.history.indexOf( id );
			this.history.splice( zz ,1 );
			var id = url.substring( url.indexOf('#')+1 );
			Utils.getById( id ).classList.remove('previous');
		}
	}

	replace_root( h )
	{
		var toReplace	= Utils.getFirst('.page.active');
		var replacement	= Utils.getById( h.substring( h.indexOf('#')+1 ) );

		replacement.classList.add('noanimation');
		replacement.classList.remove('previous');
		replacement.classList.remove('noanimation');
		replacement.classList.add('active');
		toReplace.classList.remove('active');

		history.replaceState({},'',h);

		var x = Utils.getAll('.page.previous');

		for(var i=0;i<x.length;i++)
		{
			x[ i ].classList.add('noanimation');
			x[ i ].classList.remove('previous');
			x[ i ].classList.remove('noanimation');
		}
	}

	push_state( state,title, h )
	{
		this.click_anchorHash( h, false );
	}

	replace_state( state,title, h )
	{
		this.click_anchorHash( h, true );
	}

	/*
	 	this is only for just for pop
	*/

	evt_popstate( evt )
	{
		if( !this.history.length )
		{
			if( navigator.app && navigator.app.exitApp )
			{
				navigator.app.exitApp();
				return;
			}

			history.go( -(history.length-1) );
			return;
		}

		var prevUrl		= this.history[ this.history.length-1 ];
		this.click_anchorHash( prevUrl, true );
	}

	/*

	* target is in History
		* Target is page
			* current is panel
			* current is page

	* target is not in History
		* Target is panel
			* Current is page
			* current is panel

		* Target is page
			* current is panel
			* current is page
	*/

	//Target is not in History
	openPanelFromPage( panel, page )
	{
		panel.classList.add('open');
		document.body.classList.add('panel_open');
	}

	openPanelFromPanel( nextPanel, currentPanel )
	{
		currentPanel.classList.remove('open');
		nextPanel.classList.add('open');
	}

	pushPageFromPanel( pageElement , panel )
	{
		panel.classList.remove('open');
		document.body.classList.remove('panel_open');

		var currentPage = Utils.getFirst('.page.active');

		if( currentPage !== pageElement )
			this.makeTransitionPush( currentPage, pageElement );
		else
			this.router.run( window.location.href );
	}

	pushPageFromPage( nextPageElement, currentPageElement )
	{
		this.makeTransitionPush( currentPageElement, nextPageElement );
		//let currentPageObject	= this.router.getById( currentPageElement.getAttribute('id') );
		//let nextPageObject		= this.router.getById( nextPageElement.getAttribute('id') );

		//nextPageObject.onShow();
		//currentPageObject.onHide();
	}

	// Target is in History
	popPageFromPanel( pageElement, panel )
	{
		panel.classList.remove('open');
		document.body.classList.remove('panel_open');
		var currentPage = Utils.getFirst('.page.active');
		if( currentPage === pageElement )
			return;

		this.makeTransitionPop( page ,currentPage );
	}

	popPageFromPage( pageToPop, prevPage )
	{
		var pageToPopId = pageToPop.getAttribute('id');
		var ids			= {};

		this.makeTransitionPop( prevPage ,pageToPop );
	}

	makeTransitionPush( current ,next )
	{
		let currentId = current.getAttribute('id');
		let currentPage	= this.router.getById( currentId );

		if( currentPage )
			currentPage.onHide();

		let nextId	= next.getAttribute('id');
		let nextPage = this.router.getById( nextId );

		if( nextPage )
			nextPage.onShow();

		next.classList.add('noanimation');
		setTimeout(function()
		{
			next.classList.remove('previous');
			next.classList.remove('noanimation');
			next.classList.add('active');

			current.classList.add('previous');
			current.classList.remove('active');
		},10 );
	}

	makeTransitionPop( previous ,current)
	{
		let currentId = current.getAttribute('id');
		let currentPage	= this.router.getById( currentId );

		if( currentPage )
			currentPage.onHide();

		let prevId	= previous.getAttribute('id');
		let prevPage = this.router.getById( prevId );

		if( prevPage )
			prevPage.onShow();

		previous.classList.add('active');
		previous.classList.remove('previous');
		current.classList.remove('active');
		current.classList.remove('previous');
	}

	removeNotPrevious()
	{
		var z = Utils.getAll('.page.previous');

		for(var i=0;i<z.length;i++)
		{
			var found	= false;

			for(var j=0;j<this.history.length;j++)
			{
				if( this.history[ j ].indexOf( z[i].getAttribute('id') ) !== -1 )
				{
					found = true;
					break;
				}
			}

			if( !found )
			{
				let pageId 	= z[i].getAttribute('id' );
				let page	= router.getById( pageId  )

				if( page.options.removeOnPop )
				{
					if( this.debug )
						console.log( 'Remove on Pop '+page.getId() );

					z[i].remove();
					page.onRemove();
					router.removePageById( pageId );
				}
				else
				{
					z[ i ].classList.add('noanimation');
					z[ i ].classList.remove('previous');

					var x = 0+i;

					setTimeout(()=> //jshint: ignore line
					{
						z[x].classList.remove('noanimation');
					},100);
				}
			}
		}
	}

	loadPages(pages)
	{
		let promises	= pages.map((i)=> Utils.ajax({ url : i ,dataType : 'text',overrideMimeType: 'text/plain'}));
		return Promise.all( promises )
		.then((responses)=>
		{
			let d 			= document.createElement('div');
			d.innerHTML		= responses.reduce( (p,c)=> p+c, '' );
			let allChilds	= Array.from( d.children );

			allChilds.forEach( ac=>document.body.appendChild( ac ));

			this.log('It finish Load',responses.length, responses );

			return Promise.resolve( pages );
		});
	}
}

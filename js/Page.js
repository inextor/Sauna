class Page
{
	/*
	*/
	constructor( options )
	{
		this._selector	= null;

		this.options =
		{
			element			: null
			,removeOnPop	: false
			,template		: null
		};

		if( options )
			this._initOptions( options );

		this._isInitialized	= false;
	}

	_initOptions(options)
	{

		let keys = Object.keys( options );

		for(let key in options )
		{
			if( key in this.options )
				this.options[ key ] = options[ key ];
		}

		if("element" in options )
		{
			if( typeof options.element === "string" )
			{
				this._selector	= options.element;
				this._element	= document.querySelector( this._selector );

				if( this._element  === null )
				{
					throw 'Initializator for new Nage('+domOrSelector+')  is a bad selector';
				}
			}
			else if( options.element instanceof HTMLElement )
			{
				this._element = options.element;
			}
		}
		else if( "template" in options )
		{
			let element = window.document.createElement('div');
			element.classList.add( 'page' );
			element.innerHTML = options.template;
			document.body.appendChild( element );
			this._element = element;
		}
	}

	getId()
	{
		return this._element.getAttribute('id');
	}

	setId( id )
	{
		if( this._element.getAttribute('id') === null )
		{
			this._element.setAttribute('id', id );
		}
	}

	onHide()
	{
		console.log('onHide', this.getId() );
	}

	setOnInit( func )
	{
		this._onInit = func;
	}

	onInit()
	{
		if( this._onInit )
		{
			this._onInit();
		}
		else
		{
			console.log('onInit', this.getId() );
		}
	}
	onRemove()
	{
		console.log('onRemove', this.getId() );
	}

	onload()
	{
		console.log('PageLoad', this.getId() );
	}


	setOnShow(func)
	{
		this._onShow = func;
	}
	onShow()
	{
		if( this._onShow  )
			this._onShow();
		else
			console.log('PageShow', this.getId() );
	}
}

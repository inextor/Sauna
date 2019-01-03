const template = document.createElement('template');

template.innerHTML = `
  <style>

    :host {
  		position				: fixed;
  		top						: 0;
  		left					: 0;
  		right					: 0;
  		bottom					: 0;
  		/*width					: 100%;*/
  		overflow				: hidden;
  		z-index					: 1;
  		box-sizing			: border-box;
  		transition				: all 0.5s ease;
    }

	:host([animation="enabled"][disabled])
	{
  		-moz-transition-property: none;
  		-webkit-transition-property: none;
  		-o-transition-property: none;
  		transition-property: none;
		transition				: unset;
	}

	:host([status="previous"])
	{
	  position				: fixed;
	  z-index					: 1;
	  -webkit-transform		: translate3d(-100%,0,0);
	  transform				: translate3d(-100%,0,0);
	}

	:host([status="active"])
	{
	  z-index					: 3;
	  display					: block;
	  -webkit-transform		: translate3d(0,0,0);
	  transform				: translate3d(0,0,0);
	}

	.wrapper
	{
		display: -ms-flexbox;
    	display: -webkit-flex;
    	display: flex;
    	-webkit-flex-direction: column;
    	-ms-flex-direction: column;
    	flex-direction: column;
    	-webkit-flex-wrap: nowrap;
    	-ms-flex-wrap: nowrap;
    	flex-wrap: nowrap;
    	-webkit-justify-content: flex-start;
    	-ms-flex-pack: start;
    	justify-content: flex-start;
    	-webkit-align-content: stretch;
    	-ms-flex-line-pack: stretch;
    	align-content: stretch;
    	-webkit-align-items: flex-start;
    	-ms-flex-align: start;
    	align-items: flex-start;

		width: 100%;
		height: 100%
	}

	.wrapper>.main
	{

		-webkit-order: 0;
    	-ms-flex-order: 0;
    	order: 0;
    	-webkit-flex: 1 0 auto;
    	-ms-flex: 1 0 auto;
    	flex: 1 0 auto;

   		-webkit-align-self: stretch;
    	-ms-flex-item-align: stretch;
    	align-self: stretch;


		overflow-y				: auto;
		overflow-x				: hidden;
	}
/*
	:host.noanimation
	{
	  z-index					: 2;
	  transition				: all 0s linear;
	  -moz-transition-property: none;
	  -webkit-transition-property: none;
	  -o-transition-property: none;
	  transition-property: none;
	}

	:host.previous.noanimation
	{

	  z-index					: 1;
	  transition				: all 0s linear;
	  transform				: translate3d(100%,0,0);
	  -moz-transition-property: none;
	  -webkit-transition-property: none;
	  -o-transition-property: none;
	  transition-property: none;

	}

	:host
	,:host.start.previous
	{
	  transform				: translate3d(-100%,0,0);
	  -webkit-transform		: translate3d(-100%,0,0);
	  display					: block;
	}

	:host header
	{
	  height					: 45px;
	  position				: absolute;
	  top						: 0;
	  right					: 0;
	  left					: 0;
	}
*/

  </style>
  <div class="wrapper">
	<div class="main">
		<slot></slot>
	</div>
  </div>
`;

class Page extends HTMLElement
{
	/*
	*/
	constructor()
	{
		super();

		this.debug = true;

		let shadowRoot = this.attachShadow({mode: 'open'});
    	shadowRoot.appendChild(template.content.cloneNode(true));
	}

	connectedCallback()
	{
		console.log('connected');
	}

	disconnectedCallback()
	{
		console.log('disconnected');
	}

	attributeChangedCallback(attrName, oldVal, newVal)
	{
		if( this.debug )
		{
			console.log( 'Changing var '+attrName,oldVal,newVal );
		}
  	}

	pushIn()
	{
		console.log('pushIn'+this.getAttribute('id'));
		if( this.getAttribute("status") == "previous" && this.getAttribute("animation") == "enabled" )
		{
			//this.removeAttribute("animation");
			this.setAttribute("disabled","");
			this.removeAttribute("status");
			this.removeAttribute("disabled");
		}
		this.setAttribute("status","active");
	}

	pushOut()
	{
		console.log('pushOut '+this.getAttribute('id'));
		if( this.getAttribute("status") !== "previous" && this.getAttribute("animation") == "enabled" )
		{
			console.log('No Status');
			this.setAttribute("disabled","");
			this.setAttribute("status","previous");
			this.removeAttribute("disabled");
		}
		this.setAttribute("status","active");
	}
	popIn()
	{
		console.log('popIn '+this.getAttribute('id'));
		this.setAttribute("status","previous");
	}
	popOut()
	{
		console.log('popOut '+this.getAttribute('id'));
		this.removeAttribute("status");
	}
}

customElements.define('sauna-page', Page);

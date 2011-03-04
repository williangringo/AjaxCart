setLocation = function(url){
    if(window.location.href.match('https://') && !url.match('https://')){
        url = url.replace('http://','https://')
    }
    if(url.search('in_cart=1') != -1){
        in_cart = 'in_cart=1';
    } else{
        in_cart = '';
    }

    if(searchUrl(url,'ptype','simple')){
        if(url.search('checkout/cart/add') != -1){
            ajaxcartsend(url,'url','');
        }else if(searchUrl(url,'acwishlist','1')){
            ajaxcartsendwishlist(url,'url','');
        }
    }else if(searchUrl(url,'ptype','configurable')){
        if(searchUrl(url,'acwishlist','1')){
            ajaxcartsendwishlist(url, 'url', '');
        }else{
            ajaxcartsendconfigurable(url);
        }
    }else if(url.search('options=cart') != -1){
        ajaxcartsendconfigurable(url);
    }
    else
    {
        window.location.href = url;
    }
}

function searchUrl(url,parametr,value){
    var str1 = parametr+"/"+value;
    var str2 = parametr+"="+value;
    if((url.search(str1) != -1) || (url.search(str2) != -1)){
        return true;
    }else{
        return false;
    }
}

function setPLocation(url, setFocus){
    window.opener.focus();
    window.opener.setLocation(url);
}
function ajaxcartsend(url, type, obj){
    url = getCommonUrl(url)
	showProgressAnimation();

	if (type == 'form'){
		var aForm = $('product_addtocart_form_acp') ? $('product_addtocart_form_acp') : $('product_addtocart_form');
        aForm.action += url;
        aForm.request({
            onComplete:  function(resp){
                if (typeof(resp.responseText) == 'string'){
					try{
						eval('resp = ' + resp.responseText);
					}catch(e){
						return obj.form.submit();
					}
				}
				hideProgressAnimation();
				if (resp.error != 'success'){
                    setLocation(resp.redirect);
				}
				else{
                    updateTopLinkCart(resp);
                    updateCartView(resp);
                    restartScript(resp.block);
				}
			}
        })
	}
	if (type == 'url'){
        new Ajax.Request(url, {
            method: 'post',
            onSuccess: function(resp){
                try{
                    if (typeof(resp.responseText) == 'string') eval('resp = ' + resp.responseText);
                }catch(e){
                    hideProgressAnimation();
                    window.location=url;
                    return;
                }
                hideProgressAnimation();
                if (resp.error != 'success'){
                    hideProgressAnimation();
                    setLocation(resp.redirect);
                }
                updateTopLinkCart(resp);
                updateCartView(resp);
                restartScript(resp.block);
            }
        });

	}
}

function ajaxcartdelete(url){
    ajaxcartsend(url+'&ajaxcart=1','url','');
}

function ajaxcartsendconfigurable(url)
{
    showProgressAnimation();
    urlToSend = url + '&ajaxcart=1';
    new Ajax.Request(urlToSend, {
          onSuccess: function(resp){
                if (resp.responseText == 'false')
                {
                    window.location = url;
                }
                else
                {
                    try{
                        if (typeof(resp.responseText) == 'string') {
                            eval('resp = ' + resp.responseText);
                        }
                    }catch(e){
                        hideProgressAnimation();
                        window.location=url;
                        return;
                    }
                    if (resp.error != 'success'){
                        if (resp.redirect){
                            setLocation(resp.redirect);
                        } else
                            setLocation(resp.redirect);
                            win.location.href=url;
                    }

                    var obj = $$('#ajaxcart-config #options')[0];
                    var contentall = resp.block_top + resp.block_form + resp.block_bottom ;
                    var content = contentall.stripScripts();
                    obj.update(content);

                    hideProgressAnimation();
                    showOptionsDialog();
                    decorateGeneric($$('#product-options-wrapper dl'), ['last']);
                    restartScript(contentall);
                }
			}
        });
}

function ajaxcartsendwishlist(url, type, obj){
    url = getCommonUrl(url);
    showProgressAnimation();
    new Ajax.Request(url, {
          onSuccess: function(resp){
                try{
                    if (typeof(resp.responseText) == 'string') eval('resp = ' + resp.responseText);
				}catch(e){
					win.location.href=url;
					hideProgressAnimation();
					return;
				}
				if (resp.error != 'success'){
                    if (resp.redirect){
                        setLocation(resp.redirect);
                        updateWishlistSidebar(resp);
                        updateWishlistBlock(resp);
                        updateTopLinkWishlist(resp);

                    } else{
                        hideProgressAnimation();
                        win.location.href=url;
                    }
                }
				else{
                    hideProgressAnimation();
                    updateWishlistSidebar(resp);
                    updateWishlistBlock(resp);
                    updateTopLinkWishlist(resp);
                    updateTopLinkCart(resp);
                    updateCartView(resp)
				}
			}
        });

}

function getCommonUrl(url){
	if(window.location.href.match('www.') && url.match('http://') && !url.match('www.')){
		url = url.replace('http://', 'http://www.');
	}else if(!window.location.href.match('www.') && url.match('http://') && url.match('www.')){
		url = url.replace('www.', '');
	}
	return url += '?ajaxcart=1' + '&'+in_cart;
}

function showProgressAnimation(){
    var element = 'ajaxcart_progress';
    var windowHeight = parseFloat($(element).getHeight())/2;
    var windowWidth = parseFloat($(element).getWidth())/2;
    var scrollTop= self.pageYOffset || (document.documentElement && document.documentElement.scrollTop) || (document.body && document.body.scrollTop);

    if(typeof window.innerHeight != 'undefined') {
        $(element).style.top = Math.round(document.body.offsetTop + ((window.innerHeight - $(element).getHeight()))/2)+'px';
        $(element).style.left = Math.round(document.body.offsetLeft + ((window.innerWidth - $(element).getWidth()))/2)+'px';
    } else {
        $(element).style.top = Math.round(document.body.offsetTop + ((document.documentElement.offsetHeight - $(element).getHeight()))/2)+'px';
        $(element).style.left = Math.round(document.body.offsetLeft + ((document.documentElement.offsetWidth - $(element).getWidth()))/2)+'px';
    }
    h = (window.innerHeight ? window.innerHeight : (document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body.offsetHeight));
     $(element).style.top = Math.round(scrollTop  + h/2- windowHeight)+'px';

    if (parseInt($(element).style.top) < 50)
        $(element).style.top = '50px';

    $(element).style.display = 'block';
}

function hideProgressAnimation(){
    var element = 'ajaxcart_progress';
    $(element).style.display = 'none';
}

function showOptionsDialog(){
    ajaxcartLb.open();
}

function hideOptionsDialog(){
    ajaxcartLb.close();
}

function updateCartView(resp){
    if($$('.cart').length){
        $$('.cart')[0].update(resp.block);

    } else if($$('.block-cart').length){
        $$('.block-cart')[0].update(resp.block);
    }
    var wrapper1 = createWrapper($$('div.truncated')[0], 'mouseover', (truncateOptions()));
}


function createWrapper(element, eventName, handler) {
    var id = getEventID(element);
    var c = getWrappersForEventName(id, eventName);
    if (c.pluck("handler").include(handler)) return false;

    var wrapper = function(event) {
      if (!Event || !Event.extend ||
        (event.eventName && event.eventName != eventName))
          return false;

      Event.extend(event);
      handler.call(element, event);
    };

    wrapper.handler = handler;
    c.push(wrapper);
    return wrapper;
}



function updateWishlistSidebar(resp){
    if($$('.block-wishlist').length){
        $$('.block-wishlist')[0].update(resp.wishlist);
    }
}
function updateWishlistBlock(resp){
    if($$('.my-account').length){
        $$('.my-account')[0].update(resp.wishlist);
    }
}

function updateTopLinkCart(resp){
    if($$('.top-link-cart').length){
        $$('.top-link-cart')[0].title = $$('.top-link-cart')[0].innerHTML = resp.links;
    }
}

function updateTopLinkWishlist(resp){
    $$('.links > li > a')[1].title = $$('.links > li > a')[1].innerHTML = resp.linkwishlist;
}

function addSubmitEvent()
{
    if (typeof productAddToCartForm != 'undefined')
    {
        productAddToCartForm.submit = function(url){
            if(this.validator && this.validator.validate()){
                hideOptionsDialog();
                ajaxcartsend('', 'form', this);
            }
            return false;
        }

        productAddToCartForm.form.onsubmit = function() {
            productAddToCartForm.submit();
            return false;
        };
    }
}
in_cart = '';
if(!Prototype.Browser.IE6){
    var cnt1 = 20;
	__intId = setInterval(
		function(){
			cnt1--;
			if(typeof productAddToCartForm != 'undefined'){
				try {
					// This fix is applied to magento <1.3.1
                    $$('#product_addtocart_form '+'.form-button').each(function(el){
                        el.setAttribute('type', 'button')
                    })
				}catch(err){

				}
                addSubmitEvent();
				clearInterval(__intId);
			}
			if(!cnt1) clearInterval(__intId);
		},
		500
	);
}

var optionsPrice;

function restartScript(contentall){
    var scripts = contentall.extractScripts();
    for (var i=0; i<scripts.length; i++)
    {
        if (typeof(scripts[i]) != 'undefined')
        {
            try{
                eval(scripts[i]);
            } catch(e){

            }
        }
    }
}

function formSubmit(form)
{
    ajaxcartsend('','form',form);
}

var LightboxA = Class.create();
window.globalLightboxZIndexCounter=105;
window.globalOpenedLightboxCounter=0;
LightboxA.prototype = {
	open : function () {
        window.document.observe('keydown',this._closeOnEscapeHandler);
        this._centerWindow(this.container);
        this.container.fire('lb:beforeopen',this);
        this.container.style.zIndex = 1 + (++window.globalLightboxZIndexCounter);
        this._fade('open', this.container);
        window.globalOpenedLightboxCounter++;
        /*Feature imeni Jaroslava Kravchuka*/
        //if(!Prototype.Browser.IE)
            //this.container.getElementsByTagName('input')[0].focus();
        /*Spasibo, pojaluista*/

        this.container.fire('lb:afteropen',this);
        window.document.fire('somelb:opened',this);
	},

    observe : function(event,handler){
        this.container.observe(event,handler);
    },

    stopObserving : function(event, handler){
    	this.container.stopObserving(event, handler);
    },

	close : function () {
        window.globalOpenedLightboxCounter--;
        window.document.stopObserving('keydown',this._closeOnEscapeHandler);
        this.container.fire('lb:beforeclose',this);
		this._fade('close', this.container);
		this.container.fire('lb:afterclose',this);
	},

	_fade : function fadeBg(userAction,whichDiv){
		if(userAction=='close'){
            if(window.globalOpenedLightboxCounter==0){
                new Effect.Fade(this.bgFade,
                                       {duration:.5,
                                        from:0.4,
                                        to:0,
                                        afterFinish:this._makeInvisible.bind(this),
                                        afterUpdate:this._hideLayer(whichDiv)});
            }else{
                this._hideLayer(whichDiv);
            }
        }else{
            if(this.bgFade.style.visibility=="visible")
                this._showLayer(whichDiv);
            else
                new Effect.Appear(this.bgFade,
                           {duration:.5,
                            from:0,
                            to:0.4,
                            beforeUpdate:this._makeVisible.bind(this),
                            afterFinish:this._showLayer(whichDiv)});
		}
	},

	_makeVisible : function makeVisible(){
        this.bgFade.style.visibility="visible";
        this.bgFade.style.zIndex = "102";
	},

	_makeInvisible : function makeInvisible(){
		this.bgFade.style.visibility="hidden";
	},

	_showLayer : function showLayer(userAction){
		$(userAction).style.display="block";
	},

	_hideLayer : function hideLayer(userAction){
		$(userAction).style.display="none";
	},

	_centerWindow : function centerWindow(element) {
		var windowHeight = parseFloat($(element).getHeight())/2;
		var windowWidth = parseFloat($(element).getWidth())/2;
        var scrollTop= self.pageYOffset || (document.documentElement && document.documentElement.scrollTop) || (document.body && document.body.scrollTop);

		if(typeof window.innerHeight != 'undefined') {
			$(element).style.top = Math.round(document.body.offsetTop + ((window.innerHeight - $(element).getHeight()))/2)+'px';
			$(element).style.left = Math.round(document.body.offsetLeft + ((window.innerWidth - $(element).getWidth()))/2)+'px';
		} else {
			$(element).style.top = Math.round(document.body.offsetTop + ((document.documentElement.offsetHeight - $(element).getHeight()))/2)+'px';
			$(element).style.left = Math.round(document.body.offsetLeft + ((document.documentElement.offsetWidth - $(element).getWidth()))/2)+'px';
		}
		h = (window.innerHeight ? window.innerHeight : (document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body.offsetHeight));
         $(element).style.top = Math.round(scrollTop  + h/2- windowHeight)+'px';

        if (parseInt($(element).style.top) < 50)
            $(element).style.top = '50px';

	},

    _closeOnEscape : function(event){
        if(event.keyCode == 27)
        {
            this.close()
        }
    },
	initialize : function(containerDiv, draggable, saveDomPosition) {
		this.container = containerDiv;
        this.container.style.zIndex = 1 + (++window.globalLightboxZIndexCounter);
        this._hideLayer(this.container);
        this._closeOnEscapeHandler = this._closeOnEscape.bind(this);
        if(!saveDomPosition)
        {
		    document.body.insertBefore(this.container, document.body.firstChild);
        }
        var bgFade = $('bg_fade');
		if(!bgFade) {
			bgFade = $(document.createElement('div'));
			bgFade.id = 'bg_fade';
			bgFade.addClassName('bg-fade');
			bgFade.innerHTML="<!--[if lte IE 6.5]><iframe></iframe><![endif]-->";
			document.body.insertBefore(bgFade, document.body.firstChild);
		}
//        var bgFade = new Element('div', {'id': 'bg-fade', 'class': 'bg-fade'});
//        document.body.appendChild(bgFade);

		this.bgFade = bgFade;
		if(draggable) {
			new Draggable(this.container);
		}
	}
};


Product.OptionsPrice = Class.create();
Product.OptionsPrice.prototype = {
    initialize: function(config) {
        this.productId          = config.productId;
        this.priceFormat        = config.priceFormat;
        this.includeTax         = config.includeTax;
        this.defaultTax         = config.defaultTax;
        this.currentTax         = config.currentTax;
        this.productPrice       = config.productPrice;
        this.showIncludeTax     = config.showIncludeTax;
        this.showBothPrices     = config.showBothPrices;
        this.productPrice       = config.productPrice;
        this.productOldPrice    = config.productOldPrice;
        this.skipCalculate      = config.skipCalculate;
        this.duplicateIdSuffix  = config.idSuffix;

        this.oldPlusDisposition = config.oldPlusDisposition;
        this.plusDisposition    = config.plusDisposition;

        this.oldMinusDisposition = config.oldMinusDisposition;
        this.minusDisposition    = config.minusDisposition;

        this.optionPrices    = {};
        this.containers      = {};

        this.displayZeroPrice   = true;

        this.initPrices();
    },

    setDuplicateIdSuffix: function(idSuffix) {
        this.duplicateIdSuffix = idSuffix;
    },

    initPrices: function() {
        this.containers[0] = 'product-price-' + this.productId;
        this.containers[1] = 'bundle-price-' + this.productId;
        this.containers[2] = 'price-including-tax-' + this.productId;
        this.containers[3] = 'price-excluding-tax-' + this.productId;
        this.containers[4] = 'old-price-' + this.productId;
    },

    changePrice: function(key, price) {
        //$$('.lightboxA .price')[0].update(price); 
        this.optionPrices[key] = price;
        try{
            $$('.lightboxA .price')[0].update('$'+eval(this.productPrice+price.price).toFixed(2));
        }catch(e){

        }
        //debugger;
    },

    getOptionPrices: function() {
        var price = 0;
        var nonTaxable = 0;
        var oldPrice = 0;
        $H(this.optionPrices).each(function(pair) {
            if ('undefined' != typeof(pair.value.price) && 'undefined' != typeof(pair.value.oldPrice)) {
                price += parseFloat(pair.value.price);
                oldPrice += parseFloat(pair.value.oldPrice);
            } else if (pair.key == 'nontaxable') {
                nonTaxable = pair.value;
            } else {
                price += parseFloat(pair.value);
                oldPrice += parseFloat(pair.value);
            }
        });
        var result = [price, nonTaxable, oldPrice];
        return result;
    },

    reload: function() {
        var price;
        var formattedPrice;
        var optionPrices = this.getOptionPrices();
        var nonTaxable = optionPrices[1];
        var optionOldPrice = optionPrices[2];
        optionPrices = optionPrices[0];
        $H(this.containers).each(function(pair) {
            var _productPrice;
            var _plusDisposition;
            var _minusDisposition;
            if ($(pair.value)) {
                if (pair.value == 'old-price-'+this.productId && this.productOldPrice != this.productPrice) {
                    _productPrice = this.productOldPrice;
                    _plusDisposition = this.oldPlusDisposition;
                    _minusDisposition = this.oldMinusDisposition;
                } else {
                    _productPrice = this.productPrice;
                    _plusDisposition = this.plusDisposition;
                    _minusDisposition = this.minusDisposition;
                }

                var price = 0;
                if (pair.value == 'old-price-'+this.productId && optionOldPrice !== undefined) {
                    price = optionOldPrice+parseFloat(_productPrice);
                } else {
                    price = optionPrices+parseFloat(_productPrice);
                }
                if (this.includeTax == 'true') {
                    // tax = tax included into product price by admin
                    var tax = price / (100 + this.defaultTax) * this.defaultTax;
                    var excl = price - tax;
                    var incl = excl*(1+(this.currentTax/100));
                } else {
                    var tax = price * (this.currentTax / 100);
                    var excl = price;
                    var incl = excl + tax;
                }

                excl += parseFloat(_plusDisposition);
                incl += parseFloat(_plusDisposition);
                excl -= parseFloat(_minusDisposition);
                incl -= parseFloat(_minusDisposition);

                //adding nontaxlable part of options
                excl += parseFloat(nonTaxable);
                incl += parseFloat(nonTaxable);

                if (pair.value == 'price-including-tax-'+this.productId) {
                    price = incl;
                } else if (pair.value == 'old-price-'+this.productId) {
                    if (this.showIncludeTax || this.showBothPrices) {
                        price = incl;
                    } else {
                        price = excl;
                    }
                } else {
                    if (this.showIncludeTax) {
                        price = incl;
                    } else {
                        if (!this.skipCalculate || _productPrice == 0) {
                            price = excl;
                        } else {
                            price = optionPrices+parseFloat(_productPrice);
                        }
                    }
                }

                if (price < 0) price = 0;

                if (price > 0 || this.displayZeroPrice) {
                    formattedPrice = this.formatPrice(price);
                } else {
                    formattedPrice = '';
                }

                if ($(pair.value).select('.price')[0]) {
                    $(pair.value).select('.price')[0].innerHTML = formattedPrice;
                    if ($(pair.value+this.duplicateIdSuffix) && $(pair.value+this.duplicateIdSuffix).select('.price')[0]) {
                        $(pair.value+this.duplicateIdSuffix).select('.price')[0].innerHTML = formattedPrice;
                    }
                } else {
                    $(pair.value).innerHTML = formattedPrice;
                    if ($(pair.value+this.duplicateIdSuffix)) {
                        $(pair.value+this.duplicateIdSuffix).innerHTML = formattedPrice;
                    }
                }
            };
        }.bind(this));
    },
    formatPrice: function(price) {
        return formatCurrency(price, this.priceFormat);
    }
}

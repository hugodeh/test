/*
 * responsive in_jMenu
 *
 * Copyright (c) 2012 Inouit.
 *
 * Methods :
 *
 *  open() : display in_jMenu
 *  close() : hide in_jMenu
 *
 *  unFold(jQuery Object $elem) : display element's children
 *  fold(jQuery Object $elem) : hide element's children
 *
 *  setUI(String UI) : set UI to handle events and placement properly
 *
 *
 *  Example :
 *  $('#mainNav').in_jMenu();
 *  $(window).resize(function(){
 *      // switch UI handler for the main in_menu
 *      if ( $(this).width() <= 660) {
 *          $('#mainNav').in_jMenu("setUI", 'smallscreen');
 *      }
 *      else if ( $(this).width() > 660) {
 *          $('#mainNav').in_jMenu("setUI", 'desktop');
 *      }
 *  })
 *
 *
 * main Object data :
 *
 *  boilerplateActive Boolean - is the plugin active on this object
 *  isOpen Boolean - in_jMenu open state
 *
 * Node data :
 *
 *  isNode Boolean - li node has child or not 
 *  nodeAccess Boolean - is follow node's link is allowed
 * 
 * 
 * Events :
 * 
 *  beforeCreate.in_jMenu
 *  create.in_jMenu
 *
 *  fold.in_jMenu
 *       event.target - the node which closed
 *  unFold.in_jMenu
 *       event.target - the node which open
 *  
 *  open.in_jMenu
 *  close.in_jMenu
 *
 *
 *
 *
 */
jQuery.fn.reverse = [].reverse;
(function($) {
        var pluginName = "in_jMenu",

        o = {
            activeClass : pluginName + "-active",
            secondLvlClass : "secondLevel",
            secondLvlContainerClass : pluginName + "-secondLevel",
            itemClass   : pluginName + "-item",
            openClass   : pluginName + "-open",
            nodeClass   : pluginName + "-node",
            lvlClass    : pluginName + "-lvl",
            lastClass   : pluginName + "-last",
            summaryClass : pluginName + "-summary",
            backClass : pluginName + "-back",
            listenerClass : pluginName + "-listener",
            containerClass : pluginName + "-container",
            toggleOpenClass : pluginName + "-toggle-open",
            mobileClass : pluginName + "-mobile",
            columnClass : pluginName + "-column",
            backLabel : "Retour",
            nodeAccess  : false,
            transitionDuration: 200,
            firstUnfold: true,
            columnsTemplate: [],
            $toggleBtn  : $('<a href="" class="in_jMenu-toggleBtn">></a>'),
            userInterfaces : {
                smallscreen : "$('#header').append(this);",
                desktop : "$('#header').append(this);",
                toggleBtn : "$('#header h1')after(o.$toggleBtn);"
            }
        },

        methods = {
            _create: function(){
                // to be catch, creation events must be binded with element before initialisation
                $( this )
                    .trigger( "beforeCreate." + pluginName )
                    [ pluginName ]( "_init" )
                    .trigger( "create." + pluginName );
            },

            _init: function(){
                //wrap menu with a container
                var $this = $(this);
                $this.wrapAll($('<div/>').addClass(o.containerClass));

                $( this )[ pluginName ]( "setUI", { UI : 'desktop'} );
                $( this )
                    .data('level', 0)
                    .addClass(o.lvlClass+'_0')
                    .addClass(pluginName)
                    .find('li')
                    .addClass(o.itemClass)
                    .addClass(o.listenerClass)
                    .each(function(){
                        $( this )
                            .data('level', $( this ).parents('ul').length)
                            .addClass(o.lvlClass+'_'+$( this ).parents('ul').length)
                            .parent('ul').closest('li')
                            .addClass(o.nodeClass)
                            .data({
                                'isNode': true,
                                'isOpen': false,
                                'o.nodeAccess': o.nodeAccess
                            });
                        
                        
                        var $ul =  $( this ).children('ul');
                        if($( this ).children('a').attr('title')!=undefined && $( this ).find('ul').length > 0){
                           /*
                           $ul.each(function(){
                                $(this).prepend(
                                    $('<li/>').addClass(o.summaryClass)
                                        .addClass(o.itemClass)
                                        .append($a.clone()
                                            .addClass(o.itemClass)
                                            .addClass(o.listenerClass)
                                            .attr('title','')
                                            .html($a.attr('title')))
                                );
                            });
                            */
                        }
                    })
                    .last()
                    .children('a')
                    .addClass(o.lastClass);



                    //manage back button and shortcut to current page
                    $(this).find('ul').each(function(){
                        var $li = $(this).closest('li');
                        var $a = $li.children('a').first();
                        
                        //shortcut to current link
                        if($a.attr('title')!=undefined && $( this ).children().length > 0){
                            $(this).prepend(
                                $('<li/>').addClass(o.summaryClass)
                                    .addClass(o.itemClass)
                                    .append($a.clone()
                                        .addClass(o.itemClass)
                                        .addClass(o.listenerClass)
                                        .attr('title','')
                                        .html($a.attr('title')))
                            );
                        }
                    });

                
                // add a toggle button for smallscreen at start
                //To improve
                if(o.$toggleBtn && ( typeof(o.$toggleBtn) === 'object' || typeof(o.$toggleBtn) === 'string' ) ) {
                    eval(o.userInterfaces['toggleBtn']);
                }
                else {
                    o.$toggleBtn = null;
                }

                return $( this );
            },

            slide: function(){
                if($( this ).data('UI') == 'smallscreen'){
                    $( this ).animate({'left': -($(this).data('level') * 100 )+'%'}, o.transitionDuration);
                }else{
                    $( this ).css({'left': '0%'});
                }
            },

            //unfold to a target Child
            unFoldTo: function(a){
                if(o.firstUnfold) {
                    if($(this).find('.current').html()) {
                        var _this = this;
                        var $current = $(this).find('.current').first();    
                        $current.parents('li').reverse().each(function(){
                            $(_this)[ pluginName ]( "unFold", { $elem: $(this) } );    
                        })
                        if($current.hasClass(o.nodeClass)) {
                            $(_this)[ pluginName ]( "unFold", { $elem: $current } );
                        }
                    }
                    o.firstUnfold = false;
                }
            },

            // Show node's children
            unFold: function(a){
                if( !a || typeof( a ) != "object"  || typeof( a.selector ) == "string" ) throw "Missing argument in function unFold(a) ! argument must be an object - { $elem : jQuery object } // "+ typeof( a )+" given";
                if( !a.$elem || typeof( a.$elem ) != "object" || typeof( a.$elem.selector ) != "string" ) throw "Can't unFold an undefined element ! $elem must be an jQuery object - { $elem : jQuery object } // "+ typeof( a )+" given";

                a.$elem
                .data( 'isOpen',true)
                .addClass(o.openClass)
                .siblings('.'+o.nodeClass)
                .each(function(){
                    if ( $( this ).data( 'isOpen' ) ) {
                        $this[ pluginName ]("fold", { $elem : $( this ) } );
                    }
                });
                var newLvl = a.$elem.data( 'level');

                $this = $(this)
                .removeClass(o.lvlClass+'_'+$(this).data('level'))
                .addClass(o.lvlClass+'_'+newLvl)
                .data('level', newLvl)
                .trigger({
                    type : 'unFold.' + pluginName,
                    target : a.$elem
                });

                $this[ pluginName ]("slide");
            },

            // Hide node's children
            fold: function(a){
                if( !a || typeof( a ) != "object"  || typeof( a.selector ) == "string" ) throw "Missing argument in function fold(a) ! argument must be an object - { $elem : jQuery object } // "+ typeof( a )+" given";
                if( !a.$elem || typeof( a.$elem ) != "object" || typeof( a.$elem.selector ) != "string" ) throw "Can't fold an undefined element ! $elem must be an jQuery object - { $elem : jQuery object } // "+ typeof( a )+" given";

                a.$elem
                .data( 'isOpen',false)
                
                // fold every children
                .find('.'+o.nodeClass)
                .each(function(){
                    if ( $( this ).data( 'isOpen' ) ) {
                        $this[ pluginName ]("fold", { $elem : $( this ) } );
                    }
                });
                if($( this ).data('UI', a.UI) == 'smallscreen') {
                    setTimeout(function(){
                        a.$elem.removeClass(o.openClass)
                    }, o.transitionDuration);
                }else {
                    a.$elem.removeClass(o.openClass);
                }

                var newLvl = (a.$elem.data( 'level')-1 > 0 ? a.$elem.data( 'level')-1 : 0) ;

                $this = $(this)
                .removeClass(o.lvlClass+'_'+$(this).data('level'))
                .addClass(o.lvlClass+'_'+newLvl)
                .data('level', newLvl)
                .trigger({
                    type : 'fold.' + pluginName,
                    target : a.$elem
                });

                $this[ pluginName ]("slide");
            },

            // Show the in_jMenu (smallscreen)
            open: function(){
                $(this)
                .data( 'isOpen',true)
                .trigger('open.' + pluginName);

                $(this).parent().addClass(o.openClass)

                o.$toggleBtn.addClass(o.toggleOpenClass);
            },

            // Hide the in_jMenu (smallscreen)
            close: function(){
                $(this)
                .data( 'isOpen',false)
                .trigger('close.' + pluginName);

                $(this).parent().removeClass(o.openClass)

                o.$toggleBtn.removeClass(o.toggleOpenClass);
            },

            // call the right open/close, fold/ unfold function
            toggle: function(a){
                if( !a || typeof( a ) != "object"  || typeof( a.selector ) == "string" ) throw "Missing argument in function toggle(a) ! argument must be an object - { $elem : jQuery object } // "+ typeof( a )+" given";

                if( !a.$elem || typeof( a.$elem ) != "object" || typeof( a.$elem.selector ) != "string" ) throw "Can't toggle an undefined element ! $elem must be an jQuery object - { $elem : jQuery object } // "+ typeof( a )+" given";

                $this = $(this);

                if( a.$elem.is(o.$toggleBtn) ) {
                    $this[ pluginName ]( $this.data( 'isOpen' ) ? "close" : "open" );
                }

                if( a.$elem.is('.'+o.itemClass) && a.$elem.data( "isNode" )) {
                    $this[ pluginName ]( a.$elem.data( 'isOpen' ) ? "fold" : "unFold", { $elem : a.$elem } );
                }
                else {
                    a.$elem
                    .siblings('.'+o.nodeClass)
                    .each(function(){
                        if ( $( this ).data( 'isOpen' ) ) {
                            $this[ pluginName ]("fold", { $elem : $( this ) } );
                        }
                    });
                }
            },

            buildColumnsStructure: function(){
                if(!$(this).hasClass(o.columnClass)){
                    if(!$(this).find('.'+o.secondLvlClass).parent().hasClass(o.secondLvlContainerClass)){
                        $(this).find('.'+o.secondLvlClass).wrap($('<div/>').addClass(o.secondLvlContainerClass));
                    }

                    var i = 0;
                    var templates = o.columnsTemplate;
                    var columns = [];
                    var $target = {};
                    var $items = {};
                    var $ul = {};
                    var $this = $(this);

                    //move columns
                    for(var i in templates){
                        columns = templates[i];
                        $target = $this.find('> li:eq('+i+') .'+o.secondLvlClass).first();

                        if($target.length){
                            for(var j in columns){
                                if(columns[j] != '*'){
                                    $items = $target.find('> li:nth-child(-n+'+columns[j]+')');
                                }else {
                                    $items = $target.find('> li');
                                }

                                if($items.length){
                                    $ul = $('<ul/>').attr('class', $target.attr('class'))
                                        .append($items);
                                    $target.parent().append($ul);
                                }
                            }

                            $target.remove();
                        }

                    }

                }
                $(this).addClass(o.columnClass);
            },

            removeColumnsStructure: function(){
                if($(this).hasClass(o.columnClass)){
                    var $this = $(this);
                    $this.find('> li').each(function(){
                        var firstList = $(this).find('.'+o.secondLvlClass).first();

                        $(this).find('.'+o.secondLvlClass).slice(1).children().appendTo(firstList);
                        $(this).find('.'+o.secondLvlClass).slice(1).remove();    
                    });
                }

                if($(this).find('.'+o.secondLvlClass).parent().hasClass(o.secondLvlContainerClass)) {
                    $(this).find('.'+o.secondLvlClass).unwrap();
                }

                $(this).removeClass(o.columnClass);
            },

            buildMobileStructure: function(){
                
                $(this).addClass(o.mobileClass);
            },

            removeMobileStructure: function(){
                
                $(this).removeClass(o.mobileClass);
            },

            buildBackButton: function(){
                //manage back button
                $(this)[ pluginName ]("removeBackButton");    
                $(this).find('ul').each(function(){
                    $(this).prepend(
                        $('<li/>').addClass(o.backClass)
                        .addClass(o.itemClass)
                        .append(
                            $('<a/>').attr('href','#')
                                .html(o.backLabel)
                    ));
                });
            },

            removeBackButton: function(){
                $( this ).find('.'+o.backClass).remove();
            },

            // set how the in_jMenu is handled 
            setUI: function(a){
                if( !a || typeof( a ) != "object"  || typeof( a.selector ) == "string" ) throw "Missing argument in function setUI(a) ! argument must be an object - { UI : 'string' } // "+ typeof( a )+" given";
                if( !a.UI || typeof( a.UI ) != "string" ) throw "Can't set UI to an undefined userInterface ! UI must be a string available in o.userInterfaces object  - { UI : string } // "+ typeof( a )+" given";

                $( this )[ pluginName ]( "_move", { UI : a.UI } );
                $( this ).data('UI', a.UI);
                $( this )[ pluginName ]( "_unbindEventListeners" );
                $( this )[ pluginName ]( "_bindEventListeners" );

                $(this)[ pluginName ]("slide");

                //Change environment
                if($( this ).data('UI') == 'smallscreen') {
                    $(this)[ pluginName ]("removeColumnsStructure");
                    $(this)[ pluginName ]("buildBackButton");
                    $(this)[ pluginName ]("buildMobileStructure");

                    // unfold active element and its parents
                    $(this)[ pluginName ]( "unFoldTo" );
                }else {
                    $(this)[ pluginName ]("removeBackButton");
                    $(this)[ pluginName ]("removeMobileStructure");                        
                    $(this)[ pluginName ]("buildColumnsStructure");
                }
            },

            // move in_jMenu to manage UI switch 
            _move: function(a){
                if( !a || typeof( a ) != "object"  || typeof( a.selector ) == "string" ) throw "Missing argument in function setUI(a) ! argument must be an object - { UI : 'string' } // "+ typeof( a )+" given";

                if( o.userInterfaces && typeof( o.userInterfaces ) === "object" ){
                    if( !a.UI || typeof( a.UI ) != "string" ) throw "Can't set UI to an undefined userInterface ! UI must be a string available in o.userInterfaces object  - { UI : string } // "+ typeof( a )+" given";
                    eval(o.userInterfaces[a.UI]);
                }
            },

            _unbindEventListeners: function() {
                $('.'+o.listenerClass).unbind();
                $( this ).unbind('click')
                    .unbind('mouseleave')
                    .unbind('mouseenter')
                    .unbind('focus')
                    .unbind('blur')
                    .find('.'+o.nodeClass+' a').unbind();
            },

            _bindEventListeners: function() {
                // call toggle on click event on target / bind only at initialisation
                if( !$( this ).data( pluginName + "Active" ) && o.$toggleBtn){
                    var $this = $( this );

                    $( this )
                        .find('a.'+o.lastClass)
                        // .bind( 'blur', function(e){
                        //     $this.trigger({
                        //         type: 'mouseleave',
                        //         origin: 'blur'
                        //     });
                        // });

                    o.$toggleBtn
                        .bind( 'click', function( e ){
                            e.preventDefault();
                            $this[ pluginName ]("toggle", { $elem : $( this ) } );
                        });
                }

                // Handle events on active screen mode
                $( this )[ pluginName ]("_bind."+$( this ).data('UI'));
            },

            _bind: {
                smallscreen : function(){
                    // call toggle on click event on target 
                    var $this = $( this )
                        .bind( 'click', function( e ){
                            var $elem = $( e.target ).closest('.'+o.listenerClass);
                            if($elem.data('isNode') || $elem.is(o.$toggleBtn)){
                                e.preventDefault();
                                $this[ pluginName ]("toggle", { $elem : $elem });
                            }
                        });
                },
                desktop : function(){
                    // unbind click event on nodes and bind mouseleave on in_jMenu
                    var $this = $( this )
                        .bind( 'click', function( e ){
                            var $elem = $( e.target ).closest('.'+o.listenerClass);
                            if( $elem.data('isNode') && !$elem.data('o.nodeAccess') ){
                                e.preventDefault();
                            }
                        })
                        .bind( 'mouseleave', function(e){
                                $this[ pluginName ]("fold", { $elem : $this });
                        });

                    // call toggle on hover and focus event on target 
                    var $elem = $('.'+o.listenerClass)
                        .bind( 'mouseenter', function(e){
                            $this[ pluginName ]("toggle", { $elem : $( this ) } );
                            if(e.origin && e.origin == 'focus') {
                                e.stopPropagation();
                            }
                        })
                        .children('a')
                        .bind( 'focus', function(){
                            $( this ).trigger({
                                type: 'mouseenter',
                                target: $( this ),
                                origin: 'focus'
                            });
                        });
                }
            }
        };

    // Collection method.
    $.fn[ pluginName ] = function( method, options ) {
        return this.each(function() {
            // if it's a method
            if( method && typeof( method ) === "string" ){
                var methods = method.split('.');

                switch (methods.length) {
                    case 1 :
                    return $.fn[ pluginName ].prototype[ methods[0] ].call( this, options );

                    case 2 :
                    return $.fn[ pluginName ].prototype[ methods[0] ][ methods[1] ].call( this, options );

                    case 3 :
                    return $.fn[ pluginName ].prototype[ methods[0] ][ methods[1] ][ methods[2] ].call( this, options );

                    case 4 :
                    return $.fn[ pluginName ].prototype[ methods[0] ][ methods[1] ][ methods[2] ][ methods[3] ].call( this, options );
                }
            }

            // don't re-init
            if( $( this ).data( pluginName + "Active" ) ){
                return $( this );
            }

            // if it's a object
            if( method && typeof( method ) === "object" ){
                // allow to extend methods
                $.extend( $.fn[ pluginName ].prototype, method );
            }

            // if second argument it's a object merge options
            if( options && typeof( options ) === "object" ){
                // allow to edit options at initialization
                //TODO merge options
                $.extend(o, options );
            }

            // init
            $( this ).bind( "create." + pluginName, function(){
                $( this ).data( pluginName + "Active", true );
            });

            $.fn[ pluginName ].prototype._create.call( this );

        });
    };

    // add methods
    $.extend( $.fn[ pluginName ].prototype, methods );

}(jQuery));
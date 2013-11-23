(function($) {

    // ## getHash
    $.getHash = function(url){
        // return the HashTag of the given url : parameter or current
        return url ? url.substring(url.indexOf('#')+1) : window.location.hash;
    }

    // ## placeholder
    // Must only be called for browser not supporting placeholder attribute

    $.fn.placeholder = function() {
        // Store placeholder value and fill the input
        $(this).data('placeholder', $(this).attr('placeholder'));
        $(this).val(jQuery(this).attr('placeholder'));
        // empty the previous value on focus
        $(this).focus(emptyMe);
        // reset the value if nothing is found in the input on blur
        $(this).blur(fullMe);

        function emptyMe() {
            $(this).data('placeholder', $(this).val());
            $(this).val('')
        }

        function fullMe() {
            if ($(this).val() == '') $(this).val($(this).data('placeholder'));
        }

        return this;
    };

    // ## hoverSrc
    // Emulate a hover state for images
    $.fn.hoverSrc = function(on, off) {
        $(this).each(function(){
            // Use hover / off suffixes or those given
            var suffixeOn = on ? on : '-hover';
            var suffixeOff = off ? off : '-off';
            // bind events
            $(this).bind('focus mouseenter', hoverIn);
            $(this).bind('blur mouseleave', hoverOut);
            (new Image()).src = $(this).attr('src').replace('-off', '-hover');
        })

        // Add the on suffixe to the image name
        function hoverIn() {
            if (!$(this).hasClass('active')) {
                var srcName = $(this).attr('src');
                srcName = srcName.replace(suffixeOff, suffixeOn);
                $(this).attr({
                    src: srcName
                });
            }
        }

        // Add the off suffixe to the image name
        function hoverOut() {
            if (!$(this).hasClass('active')) {
                var srcName = $(this).attr('src');
                srcName = srcName.replace(suffixeOn, suffixeOff);
                $(this).attr({
                    src: srcName
                });
            }
        }
        return this;
    };

    // ## fixToTop
    // fix any element to the top when scroll pass it
    $.fn.fixToTop = function(gap) {
        var $that = $(this),
            origin = gap ? $that[0].offsetTop + gap : $that[0].offsetTop;
            originOffSet = parseFloat($that.next().css('marginTop'));
            offSet = parseFloat($that.height()) + parseFloat($that.next().css('marginTop'));

        $(window).scroll(function() {
            if ($that.css('visibility') != 'hidden' && $(window).scrollTop() > origin) {
                    fix();
            }
            else {
                free();
            }
        });
        function fix() {
            if( !$that.hasClass('fixed') ){
                offSet = parseFloat($that.height()) + parseFloat($that.next().css('marginTop'));
                $that.addClass('fixed');
                $that.next().css('marginTop', offSet+'px');
            }
        };

        function free() {
            $that.removeClass('fixed');
            $that.next().css('marginTop', originOffSet+'px');
        };

        return this;
    };

    // ##Pulldown
    // Show/Hide content of pulldown element on click on the first child (button) of each elements
    // Use css to do the toggle.
    $.fn.pulldown = function() {
        // initialize
        var $list = $(this),
            $items = $list.children(),
            $buttons = $items.find('> *:first-child');
        $items.addClass('close');
        $buttons.addClass('pulldownButton');
        $buttons.bind('focus', function(e){
            e.preventDefault();
            $(this).parent().trigger('click');
        });

        // Add class to hide non-button elements
        $items.children().not($buttons).addClass('pulldownContent');

        // bind click and focus event
        $items.bind('click', function(e){
            e.preventDefault();
            var $item = $(this);
            if($item.data('state')){
                // close
                $item
                    .addClass('close')
                    .data('state', 0);
            } else {
                // open
                $item
                    .removeClass('close')
                    .data('state', 1);
                $items.not($item)
                    .addClass('close')
                    .data('state', 0);
            }
        });

        $list.data('pulldown', 1);
        return this;
    }

    // ## backToTop
    // display / hide a *back to top* button when scrolling under the gap
    $.fn.backToTop = function(gap) {
        var $that = $(this)
        gap = gap ? gap : 0;

        $(this).unbind('click');
        $(this).bind('click', function(e) {
            e.preventDefault();
            $('html').scrollTo(0,{ duration: 800 });
        });

        $(this).unbind('backToTop.scroll');
        $(this).bind('backToTop.scroll', function() {
            if ($(window).scrollTop() >= gap) {
                $that.fadeIn();
            }
            else {
                $that.fadeOut();
            }
        });

        // if backToTop isn't initiated we trigger a scroll event on the element
        if (!$(this).data('backToTop')){
            $(window).scroll(function() {
                $that.trigger('backToTop.scroll');
            });
        }

        $(this).data('backToTop', 1);
        return this;
    };

    // ## smoothAnchors
    // Add an automatic smooth Scroll to the section menu of typo3 or any child link matching ** a[href*="#c"] **
    $.fn.smoothAnchors = function(offsetTop, screenOffset) {

        var $anchors = $(this).find('a[href*="#c"]'),
            anchorsOffsets = [];

        offsetTop = offsetTop ? offsetTop : 50;
        screenOffset = screenOffset ? screenOffset : $(window).height()/6;

        $anchors.each(function(){
            anchorsOffsets.push($(('#'+$.getHash($(this).attr('href')))).offset().top)
        });
        var anchorsOffsetsLength = anchorsOffsets.length;

        $anchors.unbind('click');
        $anchors.click(function(e){
            e.preventDefault();
            $('html').scrollTo($(('#'+$.getHash($(this).attr('href')))),{ offset :  {top:-offsetTop}, duration: 800 });
        });

        var timeWindow = 500,
            lastExecution = new Date((new Date()).getTime());

        $(window).scroll(function(e){
            if ((lastExecution.getTime() + timeWindow) <= (new Date()).getTime()) {
                var scrollTop = $(window).scrollTop()+offsetTop + screenOffset;
                $anchors.removeClass("active");
                for ( var i = 0; i < anchorsOffsetsLength; i++ ) {
                    var j = i+1;
                    if ( scrollTop >= anchorsOffsets[i] && !anchorsOffsets[j] ) {
                        $anchors.not($anchors[i]).removeClass("active");
                        $($anchors[i]).addClass("active");
                        lastExecution = new Date((new Date()).getTime());
                        return;
                    }
                    else if ( scrollTop >= anchorsOffsets[i] && scrollTop < anchorsOffsets[j] ) {
                        $anchors.not($anchors[i]).removeClass("active");
                        $($anchors[i]).addClass("active");
                        lastExecution = new Date((new Date()).getTime());
                        return;
                    }
                }
            }
        });

        return this;
    };

})(jQuery);
(function($) {
    $(document).ready(function(){
        // ## Handle src update on hover event
        $('.no-touch img.hover').hoverSrc();
        // ## Enable placeholder management for updated browsers
        if(!Modernizr.input.placeholder) {
            $('input').each(function(){
                if ($(this).attr('placeholder') != ''){
                    $(this).placeholder();
                }
            })
        }

        // ## Add backToTop anchor when half a screen  is scrolled
        // $('body').append('<a id="backToTop" href="#">Back to top</a>');
        // $('#backToTop').backToTop($(window).height()/2);

        // ## Handle pulldown
        // $('.pulldown').pulldown();
    });

    // ## Refresh scroll offset of backToTop button appearance
    // $(window).bind('resize', function(){
    //     $('#backToTop').backToTop($(window).height()/2);
    // });
})(jQuery);
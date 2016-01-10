var $ = window.jQuery;

swipes.onReady(function() {
    var gridShowCode = $('.grid-show-code-btn');
    var displayDemo = $('.display-demo');
    var codeDemo = $('.code-demo');
    var gridDemo = $('.grid-demo');
    
    $.swFloatingLabelInput();
    $.swInputRange();
    $.swDropdown();
    $.swContextMenu();

    gridDemo.each(function() {
        var colWidth = $(this).css('width');
        var colWidthClean = colWidth.replace('px', '')
        var rowWidth = $(this).parent('.row').width();
        var colPercentage = colWidthClean * 100 / rowWidth
        $(this).html(Math.round(colPercentage) + '%')
    });

    $(window).resize(function() {
        gridDemo.each(function() {
            var colWidth = $(this).css('width');
            var colWidthClean = colWidth.replace('px', '')
            var rowWidth = $(this).parent('.row').width();
            var colPercentage = colWidthClean * 100 / rowWidth
            $(this).html(Math.round(colPercentage) + '%')
        })
    });

    gridShowCode.on('click', function() {
        if (!displayDemo.hasClass('hide-demo')) {
            gridShowCode.html("Show demo")
        } else {
            gridShowCode.html("Show code")
        }
        displayDemo.toggleClass('hide-demo');
        codeDemo.toggleClass('show-code');
    })
})
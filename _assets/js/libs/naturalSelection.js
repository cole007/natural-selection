jQuery.fn.naturalSelection = function() {
    // total;
    var total = this.length;
    return this.each(function(i) {

        // Do something to each element here.
        var self = $(this);
        var id = self.attr('id');
        var name = self.attr('name');

        // get select field and create hidden equivalent
        self.after('<div class="naturalSelection-wrapper"></div>');
        var wrapper = self.next('.naturalSelection-wrapper');

        // create select placeholder and selector
        wrapper.prepend('<a href="" class="naturalSelection-active"></a>');
        wrapper.append('<ul class="naturalSelection-inner"></ul>');
        wrapper.append('<input type="hidden" class="naturalSelection-hidden" name="'+name+'"/>')

        var naturalSelection = wrapper.find('.naturalSelection-inner');
        var label = naturalSelection.find('.naturalSelection-active');
        var input = naturalSelection.find('.naturalSelection-hidden');

        naturalSelection.addClass('naturalSelection--hide');
        naturalSelection.css('z-index',(total-i)*10);
        // loop through select options
        self.find('option').each(function(i) {
            var value = $(this).val();
            var j=i;
            var text = $(this).text();
            if (value.length == 0) value = text;
            var selected = $(this).attr('selected');
            if(selected && selected.length > 0) {
                label.text(text);
                input.val(value);
            }
            else if (i == 0) $('.naturalSelection-active').text(text);
            var classIs = [];
            var output = '<li';
            if (i == 0) classIs.push('first');
            if ((i+1) == self.find('option').length) classIs.push('last');
            if(selected && selected.length > 0) classIs.push('active');
            output +=  ' class="'+classIs.join(' ')+'"'
            output += '><a href="#" class="naturalSelection-item" data-value="'+value+'">'+text+'</a></li>'
            naturalSelection.append(output);
        });

        // bind click/keyup event to trigger
        naturalSelection.prev('.naturalSelection-active').on('click',function(e) {
            e.preventDefault();
            $(this).next('.naturalSelection-inner').toggleClass('naturalSelection--hide').find('.active').find('.naturalSelection-item').focus();
            $(this).parents('.content-wrapper').siblings('.content-wrapper').find('.naturalSelection-inner').addClass('naturalSelection--hide');
        }).on('keyup',function(e) {
            if (e.keyCode == 38 || e.keyCode == 40) {
                $(this).next('.naturalSelection-inner').toggleClass('naturalSelection--hide').find('.active').find('.naturalSelection-item').focus();
                $(this).parents('.content-wrapper').siblings('.content-wrapper').find('.naturalSelection-inner').addClass('naturalSelection--hide');
            }
        });

        // bind click event to item
        naturalSelection.on('click','.naturalSelection-item',function(e) {
            e.preventDefault();
            var value = $(this).data('value');
            var text = $(this).text();
            naturalSelection.prev('.naturalSelection-active').text(text);
            $(this).parents('.naturalSelection-inner').next('.naturalSelection-hidden').val(value);
            $(this).parents('.naturalSelection-inner').addClass('naturalSelection--hide');
            $(this).parents('li').addClass('active').siblings('li').removeClass('active');
        });
        // bind click event off target areas (label, dropdown and active area)
        $('body').on('click',function(e) {
            var target = $(e.target);
            // TO DO: if other parent is active then hide and make this active
            if(target.parents('.naturalSelection-inner').length == 0 && !target.is('.naturalSelection-active') && !target.is('label[for='+id+']')) {
                naturalSelection.addClass('naturalSelection--hide');
            }
        });

        // remove select field
        self.remove();

        // bind arrows (up/down) on select/active
        naturalSelection.on('keyup','.naturalSelection-item',function(e) {
            var parent = $(this).parent('li');
            var index = parent.index();
            var count = parent.siblings('li').length;
            // up
            if (e.keyCode == 38 && index > 0) parent.removeClass('active').prev('li').addClass('active').find('.naturalSelection-item').focus();
            // down
            else if (e.keyCode == 40 && index < count) parent.removeClass('active').next('li').addClass('active').find('.naturalSelection-item').focus();

        });
        // bind return on chosen

        // tie label click
        $('label[for='+id+']').on('click',function(e) {
            naturalSelection.toggleClass('naturalSelection--hide');
            if (!naturalSelection.is('.naturalSelection--hide')) {
                naturalSelection.find('.active').find('.naturalSelection-item').focus();
            }
        });
    });

};
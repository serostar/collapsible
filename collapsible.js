/*
 * Toggle widget
 * https://github.com/filamentgroup/toggle
 * Copyright (c) 2013 Filament Group, Inc.
 * Licensed under the MIT, GPL licenses.
 */

// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ($, window, document, undefined) {

    // undefined is used here as the undefined global variable in ECMAScript 3 is
    // mutable (ie. it can be changed by someone else). undefined isn't really being
    // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
    // can no longer be modified.

    // window and document are passed through as local variable rather than global
    // as this (slightly) quickens the resolution process and can be more efficiently
    // minified (especially when both are regularly referenced in your plugin).

    // Defaults
    var pluginName = "collapsible";
    // overrideable defaults
    var defaults = {
        pluginClass: pluginName,
        collapsedClass: pluginName + "-collapsed",
        headerClass: pluginName + "-header",
        contentClass: pluginName + "-content",
        instructions: "Interact to toggle content",
        collapsed: true
    };


    // The actual plugin constructor
    function Plugin(element, options) {
        this.element = $( element );
        var self = this,
        dataOptions = {};

        // Allow data-attr option setting
        if( this.element.is( "[data-config]" ) ){
            $.each( defaults, function( option ) {

                var value = self.element.attr( "data-" + option.replace( /[A-Z]/g, function( c ) {
                    return "-" + c.toLowerCase();
                }));

                if ( value !== undefined ) {
                    if( value === "true" || value === "false" ){
                        dataOptions[ option ] = value === "true";
                    }
                    else {
                        dataOptions[ option ] = value;
                    }
                }
            });
        }

        this.options = $.extend( {}, defaults, dataOptions, options );
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    Plugin.prototype = {

        init: function () {
            this.header = this.element.children().eq( 0 );
            this.content = this.header.next();
            this._addAttributes();
            this._bindEvents();
        },

        destroy: function () {
            this._removeAttributes();
            this._unBindEvents();
            self.collapsed = true;
        },

        _addAttributes: function(){
            this.element.addClass( this.options.pluginClass );
            this.header.addClass( this.options.headerClass );
            this.header.attr( "title", this.options.instructions );
            this.header.attr( "role", "button" );
            this.header.attr( "aria-expanded", "true" );
            this.header.attr( "tabindex", "0" );
            this.content.addClass( this.options.contentClass );
        },

        _removeAttributes: function() {
            //this.element.removeClass( this.options.pluginClass );
            this.header.removeClass( this.options.headerClass );
            this.header.removeAttr( "title");
            this.header.removeAttr( "role" );
            this.header.removeAttr( "aria-expanded" );
            this.header.removeAttr( "tabindex" );
            this.content.removeClass( this.options.contentClass );
        },

        _bindEvents: function(){
            var self = this;

            this.element
            .on( "expand", this.expand )
            .on( "collapse", this.collapse )
            .on( "toggle", this.toggle );

            this.header
            .on( "mouseup", function(){
                self.element.trigger( "toggle" );
            })
            .on( "keyup", function( e ){
                if( e.which === 13 || e.which === 32 ){ 
                    self.element.trigger( "toggle" );
                }
            });

            if( this.options.collapsed ){
                this.collapse();
            }
        },

        _unBindEvents: function(){
            var self = this;

            this.element
            .off( "expand" )
            .off( "collapse" )
            .off( "toggle" );

            this.header
            .off( "mouseup" )
            .off( "keyup" );
        },

        collapsed: false,

        expand: function () {
            var self = $.data( this, "plugin_" + pluginName ) || this;
            self.element.removeClass( self.options.collapsedClass );
            self.collapsed = false;
            self.header.attr( "aria-expanded", "true" );
        },

        collapse: function() {
            var self = $.data( this, "plugin_" + pluginName ) || this;
            self.element.addClass( self.options.collapsedClass );
            self.collapsed = true;
            self.header.attr( "aria-expanded", "false" );
        },

        toggle: function(){
            var self = $.data( this, "plugin_" + pluginName );
            self.element.trigger( self.collapsed ? "expand" : "collapse" );
        },
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function (options) {
        var args = arguments;

        return this.each(function () {
            var _plugin = "plugin_" + pluginName,
            data = $.data(this, _plugin),
            method = data ? data[options] : '';

            // Instance the plugin
            if (!data) {
                $.data(this, _plugin, (data = new Plugin(this, options)));

            // Tests that there's already a plugin-instance
            // and checks that the requested public method exists
            // performs a method passing parameters if necessary
        } else if (data instanceof Plugin && typeof method === 'function') {
            method.apply(data, Array.prototype.slice.call(args, 1));

            // Allow instances to be destroyed via the 'destroy' method
            if (options === 'destroy') {
                $.data(this, 'plugin_' + pluginName, null);
            }

        // Get the error if the method does not exist or is private
        } else if (!method || options.charAt(0) === '_') {
            $.error('Method ' + options + ' does not exist on jQuery.' + pluginName);
        }
    });
};

})(jQuery, window, document);

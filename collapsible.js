/*
 * Toggle widget
 * https://github.com/filamentgroup/toggle
 * Copyright (c) 2013 Filament Group, Inc.
 * Licensed under the MIT, GPL licenses.
 */

;(function ($, window, document, undefined) {

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

    // plugin constructor
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
            this.element.removeClass( this.options.pluginClass );
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

    } 

    Plugin.prototype.init = function () {
        this.header = this.element.children().eq( 0 );
        this.content = this.header.next();
        this._addAttributes();
        this._bindEvents();
    };

    Plugin.prototype.destroy = function () {
        this._removeAttributes();
        this._unBindEvents();        
    };

    // You don't need to change something below:
    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations and allowing any
    // public function (ie. a function whose name doesn't start
    // with an underscore) to be called via the jQuery plugin,
    // e.g. $(element).defaultPluginName('functionName', arg1, arg2)
    $.fn[pluginName] = function ( options ) {
        var args = arguments;

        // Is the first parameter an object (options), or was omitted,
        // instantiate a new instance of the plugin.
        if (options === undefined || typeof options === 'object') {
            return this.each(function () {

                // Only allow the plugin to be instantiated once,
                // so we check that the element has no plugin instantiation yet
                if (!$.data(this, 'plugin_' + pluginName)) {

                    // if it has no instance, create a new one,
                    // pass options to our plugin constructor,
                    // and store the plugin instance
                    // in the elements jQuery data object.
                    $.data(this, 'plugin_' + pluginName, new Plugin( this, options ));
                }
            });

        // If the first parameter is a string and it doesn't start
        // with an underscore or "contains" the `init`-function,
        // treat this as a call to a public method.
    } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {

            // Cache the method call
            // to make it possible
            // to return a value
            var returns;

            this.each(function () {
                var instance = $.data(this, 'plugin_' + pluginName);

                // Tests that there's already a plugin-instance
                // and checks that the requested public method exists
                if (instance instanceof Plugin && typeof instance[options] === 'function') {

                    // Call the method of our plugin instance,
                    // and pass it the supplied arguments.
                    returns = instance[options].apply( instance, Array.prototype.slice.call( args, 1 ) );
                }

                // Allow instances to be destroyed via the 'destroy' method
                if (options === 'destroy') {
                  $.data(this, 'plugin_' + pluginName, null);
              }
          });

            // If the earlier cached method
            // gives a value back return the value,
            // otherwise return this to preserve chainability.
            return returns !== undefined ? returns : this;
        }
    };

})(jQuery, window, document);
/**
 * Whether to use pjax page swithing
 * @type {boolean}
 */
window.PJAX_ENABLED = true;
/**
 * Whether to print some log information
 * @type {boolean}
 */
window.DEBUG = false;

/**
 * Plugins configuration options
 */

/**
 * Setting Widgster's body selector to theme specific
 * @type {string}
 */
$.fn.widgster.Constructor.DEFAULTS.bodySelector = '.widget-body';

$(function(){

    /**
     * Main app class that handles page switching, async script loading, resize & pageLoad callbacks.
     * Events:
     *   sing-app:loaded - fires after pjax request is made and ALL scripts are trully loaded
     *   sing-app:content-resize - fires when .content changes its size (e.g. switching between static & collapsing
     *     navigation states)
     * @constructor
     */
    var SingAppView = function(){

        this.pjaxEnabled = window.PJAX_ENABLED;
        this.debug = window.DEBUG;
        this.navCollapseTimeout = 2500;
        this.$sidebar = $('#sidebar');
        this.$content = $('#content');
        this.$loaderWrap = $('.loader-wrap');
        this.settings = window.SingSettings;
        this.pageLoadCallbacks = {};
        this.resizeCallbacks = [];
        this.screenSizeCallbacks = {
            xs:{enter:[], exit:[]},
            sm:{enter:[], exit:[]},
            md:{enter:[], exit:[]},
            lg:{enter:[], exit:[]},
            xl:{enter:[], exit:[]}
        };
        this.loading = false;

        this._resetResizeCallbacks();
        this._initOnResizeCallbacks();
        this._initOnScreenSizeCallbacks();


        if (this.pjaxEnabled){
            /**
             * Initialize pjax & attaching all related events
             */
            this.$sidebar.find('.sidebar-nav a:not([data-toggle=collapse], [data-no-pjax], [href=#])').on('click', $.proxy(this._checkLoading, this));
            $(document).pjax('#sidebar .sidebar-nav a:not([data-toggle=collapse], [data-no-pjax], [href=#], .no-pjax)', '#content', {
                fragment: '#content',
                type: 'GET', //this.debug ? 'POST' : 'GET' //GET - for production, POST - for debug.
                timeout: 4000
            });

            $(document).on('pjax:start', $.proxy(this._changeActiveNavigationItem, this));
            $(document).on('pjax:start', $.proxy(this._resetResizeCallbacks, this));
            $(document).on('pjax:send', $.proxy(this.showLoader, this));
            $(document).on('pjax:success', $.proxy(this._loadScripts, this));
            //custom event which fires when all scripts are actually loaded
            $(document).on('sing-app:loaded', $.proxy(this._loadingFinished, this));
            $(document).on('sing-app:loaded', $.proxy(this._collapseNavIfSmallScreen, this));
            $(document).on('sing-app:loaded', $.proxy(this.hideLoader, this));
            $(document).on('pjax:end', $.proxy(this.pageLoaded, this));
        }


        /* reimplementing bs.collapse data-parent here as we don't want to use BS .panel*/
        this.$sidebar.find('.collapse').on('show.bs.collapse', function(e){
            // execute only if we're actually the .collapse element initiated event
            // return for bubbled events
            if (e.target != e.currentTarget) return;

            var $triggerLink = $(this).prev('[data-toggle=collapse]');
            $($triggerLink.data('parent')).find('.collapse.show').not($(this)).collapse('hide');
        })
            /* adding additional classes to navigation link li-parent for several purposes. see navigation styles */
            .on('show.bs.collapse', function(e){
                // execute only if we're actually the .collapse element initiated event
                // return for bubbled events
                if (e.target != e.currentTarget) return;

                $(this).closest('li').addClass('open');
            }).on('hide.bs.collapse', function(e){
                // execute only if we're actually the .collapse element initiated event
                // return for bubbled events
                if (e.target != e.currentTarget) return;

                $(this).closest('li').removeClass('open');
            });

        window.onerror = $.proxy(this._logErrors, this);
    };

    /**
     * Initiates an array of throttle onResize callbacks.
     * @private
     */
    SingAppView.prototype._initOnResizeCallbacks = function(){
        var resizeTimeout,
            view = this;

        $(window).on('resize sing-app:content-resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function(){
                view._runPageCallbacks(view.pageResizeCallbacks);
                view.resizeCallbacks.forEach(function(fn){
                    fn();
                });
            }, 100);
        });
    };

    /**
     * Initiates an array of throttle onScreenSize callbacks.
     * @private
     */
    SingAppView.prototype._initOnScreenSizeCallbacks = function(){
        var resizeTimeout,
            view = this,
            prevSize = Sing.getScreenSize();

        $(window).resize(function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function(){
                var size = Sing.getScreenSize();
                if (size != prevSize){ //run only if something changed
                    //run exit callbacks first
                    view.screenSizeCallbacks[prevSize]['exit'].forEach(function(fn){
                        fn(size, prevSize);
                    });
                    //run enter callbacks then
                    view.screenSizeCallbacks[size]['enter'].forEach(function(fn){
                        fn(size, prevSize);
                    });
                    view.log('screen changed. new: ' + size + ', old: ' + prevSize);
                }
                prevSize = size;
            }, 100);
        });
    };

    SingAppView.prototype._resetResizeCallbacks = function(){
        this.pageResizeCallbacks = {};
    };

    /**
     * Changes active navigation item depending on current page.
     * Should be executed before page load
     * @param event
     * @param xhr
     * @param options
     * @private
     */
    SingAppView.prototype._changeActiveNavigationItem = function(event, xhr, options){
        var $newActiveLink = this.$sidebar.find('a[href*="' + this.extractPageName(options.url) + '"]').filter(function(){
            return this.href === options.url;
        });

        // collapse .collapse only if new and old active links belong to different .collapse
        if (!$newActiveLink.is('.active > .collapse > li > a')){
            this.$sidebar.find('.active .active').closest('.collapse').collapse('hide');
        }
        this.$sidebar.find('.active').removeClass('active');

        $newActiveLink.closest('li').addClass('active')
            .parents('li').addClass('active');
    };


    /**
     * Checks whether screen is md or lg and opens navigation if closed
     * @private
     */

    SingAppView.prototype.showLoader = function(){
        var view = this;
        this.showLoaderTimeout = setTimeout(function(){
            view.$loaderWrap.removeClass('hide');
            setTimeout(function(){
                view.$loaderWrap.removeClass('hiding');
            }, 0)
        }, 200);
    };

    SingAppView.prototype.hideLoader = function(){
        clearTimeout(this.showLoaderTimeout);
        this.$loaderWrap.addClass('hiding');
        var view = this;
        this.$loaderWrap.one(Util.TRANSITION_END, function () {
            view.$loaderWrap.addClass('hide');
        }).emulateTransitionEnd(200)
    };

    /**
     * Specify a function to execute when window was resized or .content size was changed (e.g. sidebar static/collapsed).
     * Runs maximum once in 100 milliseconds (throttle).
     * Page dependent. So `fn` will be executed only when at the page it was added.
     * Cleaned after page left.
     * @param fn A function to execute
     * @param allPages whether to keep callback after leaving page
     */
    SingAppView.prototype.onResize = function(fn, /**Boolean=*/ allPages){
        allPages = typeof allPages !== 'undefined' ? allPages : false;
        if (allPages){
            this.resizeCallbacks.push(fn);
        } else {
            this._addPageCallback(this.pageResizeCallbacks, fn);
        }
    };

    /**
     * Specify a function to execute when a page was reloaded with pjax.
     * @param fn A function to execute
     */

    SingAppView.prototype.onPageLoad = function(fn){
        this._addPageCallback(this.pageLoadCallbacks, fn);
    };

    /**
     * Specify a function to execute when window entered/exited particular size.
     * Page independent. Runs regardless of current page (on every page).
     * @param size ('xs','sm','md','lg','xl')
     * @param fn callback(newScreenSize, prevScreenSize)
     * @param onEnter whether to run a callback when screen enters `size` or exits. true by default @optional
     */
    SingAppView.prototype.onScreenSize = function(size, fn, /**Boolean=*/ onEnter){
        onEnter = typeof onEnter !== 'undefined' ? onEnter : true;
        if (typeof size === 'object'){
            for (var i=0; i < size.length; i++){
                this.screenSizeCallbacks[size[i]][onEnter ? 'enter' : 'exit'].push(fn)
            }
        }
        else {
            this.screenSizeCallbacks[size][onEnter ? 'enter' : 'exit'].push(fn)
        }

    };

    /**
     * Runs page loaded callbacks
     */
    SingAppView.prototype.pageLoaded = function(){
        this._runPageCallbacks(this.pageLoadCallbacks);
    };

    /**
     * Convenient private method to add app callback depending on current page.
     * @param callbacks
     * @param fn callback to execute
     * @private
     */
    SingAppView.prototype._addPageCallback = function(callbacks, fn){
        var pageName = this.extractPageName(location.href);
        if (!callbacks[pageName]){
            callbacks[pageName] = [];
        }
        callbacks[pageName].push(fn);
    };

    /**
     * Convenient private method to run app callbacks depending on current page.
     * @param callbacks
     * @private
     */
    SingAppView.prototype._runPageCallbacks = function(callbacks){
        var pageName = this.extractPageName(location.href);
        if (callbacks[pageName]){
            callbacks[pageName].forEach(function(fn){
                fn();
            })
        }
    };

    /**
     * Parses entire body response in order to find & execute script tags.
     * This has to be done because it's only .content attached to the page after ajax request.
     * Usually content does not contain all scripts required from page loading, so need to additionally extract them from body response.
     * @param event
     * @param data
     * @param status
     * @param xhr
     * @param options
     * @private
     */
    SingAppView.prototype._loadScripts = function(event, data, status, xhr, options){
        var $bodyContents = $($.parseHTML(data.match(/<body[^>]*>([\s\S.]*)<\/body>/i)[0], document, true)),
            $scripts = $bodyContents.filter('script[src]').add($bodyContents.find('script[src]')),
            $templates = $bodyContents.filter('script[type="text/template"]').add($bodyContents.find('script[type="text/template"]')),
            $existingScripts = $('script[src]'),
            $existingTemplates = $('script[type="text/template"]');

        //append templates first as they are used by scripts
        $templates.each(function() {
            var id = this.id;
            var matchedTemplates = $existingTemplates.filter(function() {
                //noinspection JSPotentiallyInvalidUsageOfThis
                return this.id === id;
            });
            if (matchedTemplates.length) return;

            var script = document.createElement('script');
            script.id = $(this).attr('id');
            script.type = $(this).attr('type');
            script.innerHTML = this.innerHTML;
            document.body.appendChild(script);
        });

        //ensure synchronous loading
        var $previous = {
            load: function(fn){
                fn();
            }
        };

        $scripts.each(function() {
            var src = this.src;
            var matchedScripts = $existingScripts.filter(function() {
                //noinspection JSPotentiallyInvalidUsageOfThis
                return this.src === src;
            });
            if (matchedScripts.length) return;

            var script = document.createElement('script');
            script.src = $(this).attr('src');
            $previous.load(function(){
                document.body.appendChild(script);
            });

            $previous = $(script);
        });

        var view = this;
        $previous.load(function(){
            $(document).trigger('sing-app:loaded');
            view.log('scripts loaded.');
        })
    };

    SingAppView.prototype.extractPageName = function(url){
        //credit: http://stackoverflow.com/a/8497143/1298418
        var pageName = url.split('#')[0].substring(url.lastIndexOf("/") + 1).split('?')[0];
        return pageName === '' ? 'index.html' : pageName;
    };

    SingAppView.prototype._checkLoading = function(e){
        var oldLoading = this.loading;
        this.loading = true;
        if (oldLoading){
            this.log('attempt to load page while already loading; preventing.');
            e.preventDefault();
        } else {
            this.log(e.currentTarget.href + ' loading started.');
        }
        //prevent default if already loading
        return !oldLoading;
    };

    SingAppView.prototype._loadingFinished = function(){
        this.loading = false;
    };

    SingAppView.prototype._logErrors = function(){
        var errors = JSON.parse(localStorage.getItem('lb-errors')) || {};
        errors[new Date().getTime()] = arguments;
        localStorage.setItem('sing-errors', JSON.stringify(errors));
        this.debug && alert('check errors');
    };

    SingAppView.prototype.log = function(message){
        if (this.debug){
            console.log("SingApp: "
                    + message
                    + " - " + arguments.callee.caller.toString().slice(0, 30).split('\n')[0]
                    + " - " + this.extractPageName(location.href)
            );
        }
    };


    window.SingApp = new SingAppView();


    initAppPlugins();
    initAppFunctions();
    initAppFixes();
    initSidebarLogic();
});

/**
 * Theme functions extracted to independent plugins.
 */
function initAppPlugins(){
    /* ========================================================================
     * Handle transparent input groups focus
     * ========================================================================
     */
    !function($){

        $.fn.transparentGroupFocus = function () {
            return this.each(function () {
                $(this).find('.input-group-addon + .form-control').on('blur focus', function(e){
                    $(this).parents('.input-group')[e.type=='focus' ? 'addClass' : 'removeClass']('focus');
                });
            })
        };

        $('.input-group-transparent, .input-group-no-border').transparentGroupFocus();
    }(jQuery);

    /* ========================================================================
     * Ajax Load links, buttons & inputs
     * loads #data-ajax-target from url provided in data-ajax-load
     * ========================================================================
     */
    !function($){
        $(document).on('click change', '[data-ajax-load], [data-ajax-trigger^=change]', function(e){
            var $this = $(this),
                $target = $($this.data('ajax-target'));
            if ($target.length > 0 ){
                e = $.Event('ajax-load:start', {originalEvent: e});
                $this.trigger(e);

                !e.isDefaultPrevented() && $target.load($this.data('ajax-load'), function(){
                    $this.trigger('ajax-load:end');
                });
            }
            return false;
        });
        $(document).on('click', '[data-toggle^=button]', function (e) {
            return $(e.target).find('input').data('ajax-trigger') != 'change';
        })
    }(jQuery);


    /* ========================================================================
     * Table head check all checkboxes
     * ========================================================================
     */
    !function($){
        $(document).on('click', 'table th [data-check-all]', function () {
            $(this).closest('table').find('input[type=checkbox]')
                .not(this).prop('checked', $(this).prop('checked'));
        });
    }(jQuery);

    /* ========================================================================
     * Animate Progress Bars
     * ========================================================================
     */
    !function($){

        $.fn.animateProgressBar = function () {
            return this.each(function () {
                var $bar = $(this);
                $bar.css('width', $bar.data('width'));
            })
        };

        $('.js-progress-animate').animateProgressBar();
    }(jQuery);
}

/**
 * Sing required js functions
 */
function initAppFunctions(){
    !function($){
        /**
         * Change to loading state when fetching notifications
         */
        var $loadNotificationsBtn = $('#load-notifications-btn');
        $loadNotificationsBtn.on('ajax-load:start', function (e) {
            $loadNotificationsBtn.button('loading');
        });
        $loadNotificationsBtn.on('ajax-load:end', function () {
            $loadNotificationsBtn.button('reset');
        });

        /**
         * Move notifications dropdown to sidebar when/if screen goes sm
         * and back when leaves sm
         */
        function moveNotificationsDropdown(){
            $('.sidebar-status .dropdown-toggle').after($('#notifications-dropdown-menu').detach());
        }

        function moveBackNotificationsDropdown(){
            $('#notifications-dropdown-toggle').after($('#notifications-dropdown-menu').detach());
        }

        SingApp.onScreenSize(['sm','xs'], moveNotificationsDropdown);
        SingApp.onScreenSize(['sm','xs'], moveBackNotificationsDropdown, false);

        Sing.isScreen('sm') && moveNotificationsDropdown();
        Sing.isScreen('xs') && moveNotificationsDropdown();

        /**
         * Set Sidebar zindex higher than .content and .page-controls so the notifications dropdown is seen
         */
        $('.sidebar-status').on('show.bs.dropdown', function(){
            $('#sidebar').css('z-index', 2);
        }).on('hidden.bs.dropdown', function(){
            $('#sidebar').css('z-index', '');
        });

        /**
         * Show help tooltips
         */
        $('[data-toggle="tooltip"]').tooltip();

        function initSidebarScroll(){
            var $sidebarContent = $('.js-sidebar-content');
            if ($('#sidebar').find('.slimScrollDiv').length != 0){
                $sidebarContent.slimscroll({
                    destroy: true
                })
            }
            $sidebarContent.slimscroll({
                height: '100vh',
                size: '5px',
                opacity: 0.1
            });
        }

        SingApp.onResize(initSidebarScroll, true);
        initSidebarScroll();

        /*
         When widget is closed remove its parent if it is .col-*
         */
        $(document).on('close.widgster', function(e){
            var $colWrap = $(e.target).closest('.content > .row > [class*="col-"]:not(.widget-container)');

            // remove colWrap only if there are no more widgets inside
            if (!$colWrap.find('.widget').not(e.target).length){
                $colWrap.remove();
            }
        });

    }(jQuery);

}
function initSidebarLogic(){
    !function($){

        const mainSidebar = $('#sidebar');
        const toggleSidebar = $('#toggleSidebar');

        $('.content-wrap').on('click', (e) => {
            if ($('.toggle-sidebar').hasClass('open')) {
                mainSidebar.removeClass('sidebar-open');
                $('.toggle-sidebar').removeClass('open');
            }
        });

        toggleSidebar.on('click', (e) => {
            mainSidebar.toggleClass('sidebar-open');
            $('.toggle-sidebar').toggleClass('open');
        });
    }(jQuery);
}
/**
 * Sing browser fixes. It's always something broken somewhere
 */
function initAppFixes(){
    var isWebkit = 'WebkitAppearance' in document.documentElement.style;
    if (isWebkit){
    }
}


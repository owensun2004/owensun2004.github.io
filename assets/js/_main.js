/* ==========================================================================
   jQuery plugin settings and other scripts
   ========================================================================== */

$(document).ready(function(){

  /*
   * Theme toggle.
   *
   * NOTE: The live site also inlines a standalone copy of this handler in
   * _includes/scripts.html so that the toggle works even if main.min.js has
   * not been rebuilt from _main.js. Kept here for parity so that anyone who
   * runs `npm run uglify` still gets a working handler.
   *
   * Everything is guarded with null checks: previously this block would throw
   * a TypeError when #theme-toggle was not in the DOM, which aborted the
   * rest of $(document).ready (breaking smooth scroll, lightbox, etc.).
   */
  var themeToggle = document.getElementById('theme-toggle');
  var prefersDarkScheme = window.matchMedia
    ? window.matchMedia('(prefers-color-scheme: dark)')
    : null;

  var storedTheme = null;
  try { storedTheme = localStorage.getItem('theme'); } catch (e) { /* ignore */ }
  var initialTheme = storedTheme ||
    (prefersDarkScheme && prefersDarkScheme.matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', initialTheme);

  function updateToggleIcon(theme) {
    if (!themeToggle) return;
    var icon = themeToggle.querySelector('.theme-toggle__icon');
    if (!icon) return;
    icon.className = theme === 'dark'
      ? 'fas fa-sun theme-toggle__icon'
      : 'fas fa-moon theme-toggle__icon';
  }

  updateToggleIcon(initialTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var cur = document.documentElement.getAttribute('data-theme');
      var next = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) { /* ignore */ }
      updateToggleIcon(next);
    });
  }

  if (prefersDarkScheme && typeof prefersDarkScheme.addEventListener === 'function') {
    prefersDarkScheme.addEventListener('change', function (e) {
      var hasExplicit = false;
      try { hasExplicit = !!localStorage.getItem('theme'); } catch (err) { /* ignore */ }
      if (hasExplicit) return;
      var next = e.matches ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      updateToggleIcon(next);
    });
  }

  // Sticky footer
  var bumpIt = function() {
      $("body").css("margin-bottom", $(".page__footer").outerHeight(true));
    },
    didResize = false;

  bumpIt();

  $(window).resize(function() {
    didResize = true;
  });
  setInterval(function() {
    if (didResize) {
      didResize = false;
      bumpIt();
    }
  }, 250);
  // FitVids init
  $("#main").fitVids();

  // init sticky sidebar
  $(".sticky").Stickyfill();

  var stickySideBar = function(){
    var show = $(".author__urls-wrapper button").length === 0 ? $(window).width() > 1024 : !$(".author__urls-wrapper button").is(":visible");
    // console.log("has button: " + $(".author__urls-wrapper button").length === 0);
    // console.log("Window Width: " + windowWidth);
    // console.log("show: " + show);
    //old code was if($(window).width() > 1024)
    if (show) {
      // fix
      Stickyfill.rebuild();
      Stickyfill.init();
      $(".author__urls").show();
    } else {
      // unfix
      Stickyfill.stop();
      $(".author__urls").hide();
    }
  };

  stickySideBar();

  $(window).resize(function(){
    stickySideBar();
  });

  // Follow menu drop down

  $(".author__urls-wrapper button").on("click", function() {
    $(".author__urls").fadeToggle("fast", function() {});
    $(".author__urls-wrapper button").toggleClass("open");
  });

  // init smooth scroll with responsive offset
  function updateSmoothScroll() {
    var offset = $(window).width() > 768 ? -100 : -20; // PC: -100px, Mobile: -20px
    $("a").smoothScroll({offset: offset});
  }
  
  updateSmoothScroll();
  $(window).resize(function() {
    updateSmoothScroll();
  });

  // add lightbox class to all image links
  $("a[href$='.jpg'],a[href$='.jpeg'],a[href$='.JPG'],a[href$='.png'],a[href$='.gif']").addClass("image-popup");

  // Magnific-Popup options
  $(".image-popup").magnificPopup({
    // disableOn: function() {
    //   if( $(window).width() < 500 ) {
    //     return false;
    //   }
    //   return true;
    // },
    type: 'image',
    tLoading: 'Loading image #%curr%...',
    gallery: {
      enabled: true,
      navigateByImgClick: true,
      preload: [0,1] // Will preload 0 - before current, and 1 after the current image
    },
    image: {
      tError: '<a href="%url%">Image #%curr%</a> could not be loaded.',
    },
    removalDelay: 500, // Delay in milliseconds before popup is removed
    // Class that is added to body when popup is open.
    // make it unique to apply your CSS animations just to this exact popup
    mainClass: 'mfp-zoom-in',
    callbacks: {
      beforeOpen: function() {
        // just a hack that adds mfp-anim class to markup
        this.st.image.markup = this.st.image.markup.replace('mfp-figure', 'mfp-figure mfp-with-anim');
      }
    },
    closeOnContentClick: true,
    midClick: true // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.
  });

});

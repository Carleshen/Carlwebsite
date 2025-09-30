/*
  Big Picture by HTML5 UP
  html5up.net | @ajlkn
  Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function ($) {

  var $window = $(window),
      $body   = $('body'),
      $header = $('#header'),
      $all    = $body.add($header);

  // Breakpoints.
  breakpoints({
    xxlarge: [ '1681px',  '1920px' ],
    xlarge:  [ '1281px',  '1680px' ],
    large:   [ '1001px',  '1280px' ],
    medium:  [ '737px',   '1000px' ],
    small:   [ '481px',   '736px'  ],
    xsmall:  [ null,      '480px'  ]
  });

  // Play initial animations on page load.
  $window.on('load', function () {
    setTimeout(function () {
      $body.removeClass('is-preload');
    }, 100);
  });

  // Touch mode.
  if (browser.mobile) {
    $body.addClass('is-touch');
  } else {
    breakpoints.on('<=small', function () { $body.addClass('is-touch'); });
    breakpoints.on('>small',  function () { $body.removeClass('is-touch'); });
  }

  // Fix: IE flexbox fix.
  if (browser.name == 'ie') {
    var $main = $('.main.fullscreen'),
        IEResizeTimeout;

    $window
      .on('resize.ie-flexbox-fix', function () {
        clearTimeout(IEResizeTimeout);
        IEResizeTimeout = setTimeout(function () {
          var wh = $window.height();
          $main.each(function () {
            var $this = $(this);
            $this.css('height', '');
            if ($this.height() <= wh)
              $this.css('height', (wh - 50) + 'px');
          });
        });
      })
      .triggerHandler('resize.ie-flexbox-fix');
  }

  // Gallery.
  $window.on('load', function () {

    var $gallery = $('.gallery');

    $gallery.poptrox({
      baseZIndex: 10001,
      useBodyOverflow: false,
      usePopupEasyClose: false,
      overlayColor: '#1f2328',
      overlayOpacity: 0.65,
      usePopupDefaultStyling: false,
      usePopupCaption: true,
      popupLoaderText: '',
      windowMargin: 50,

      // Don’t turn the whole popup into a “next” button
      usePopupNav: false,

      // Build caption HTML from data-* on the <a>
      // Example on each thumb <a>:
      //   data-title="..." data-desc="..." data-url="https://..."
      caption: function ($a) {
        var t = $a.attr('data-title') || '';
        var d = $a.attr('data-desc')  || '';
        var u = $a.attr('data-url')   || '';
        var out = '';
        if (t) out += '<h3>' + t + '</h3>';
        if (d) out += '<p>' + d + '</p>';
        if (u) out += '<p><a class="popup-link" href="' + u + '" target="_blank" rel="noopener">Open project</a></p>';
        return out || '';
      },

      popupBlankCaptionText: ''
    });

    // Make small screens tighter.
    breakpoints.on('>small', function () {
      $gallery.each(function () { $(this)[0]._poptrox.windowMargin = 50; });
    });
    breakpoints.on('<=small', function () {
      $gallery.each(function () { $(this)[0]._poptrox.windowMargin = 5; });
    });

    /* --- Caption width sync: make the white caption exactly match the image width --- */
    function syncCaptionWidth() {
      var $popup = $('.poptrox-popup');
      if (!$popup.length) return;

      var $img = $popup.find('.pic img:visible');
      var $cap = $popup.find('.caption');
      if (!$img.length || !$cap.length) return;

      var imgRect = $img[0].getBoundingClientRect();
      var popRect = $popup[0].getBoundingClientRect();
      if (!imgRect.width) return;

      // Left edge of image relative to popup, and its width
      var left = Math.max(0, Math.round(imgRect.left - popRect.left));
      var width = Math.round(imgRect.width);

      // Apply exact geometry so the white bar lines up with the image edges
      $cap.css({ left: left + 'px', width: width + 'px' });
    }

    // Call it repeatedly right after open (covers lazy sizing & cached images).
    function syncAfterOpen() {
      var n = 0;
      var timer = setInterval(function () {
        syncCaptionWidth();
        if (++n > 20) clearInterval(timer);   // ~1s of retries
      }, 50);
    }

    // When a thumb opens the popup…
    $(document).on('click', '.gallery a', function () {
      setTimeout(syncAfterOpen, 0);
    });

    // When the full image actually loads…
    $(document).on('load', '.poptrox-popup .pic img', syncCaptionWidth);

    // On resize / orientation change, keep it aligned.
    $(window).on('resize orientationchange', syncCaptionWidth);
    /* --- /caption width sync --- */

  });

  // Section transitions.
  if (browser.canUse('transition')) {

    var on = function () {

      // Galleries.
      $('.gallery').scrollex({
        top: '30vh',
        bottom: '30vh',
        delay: 50,
        initialize: function () { $(this).addClass('inactive'); },
        terminate:  function () { $(this).removeClass('inactive'); },
        enter:      function () { $(this).removeClass('inactive'); },
        leave:      function () { $(this).addClass('inactive'); }
      });

      // Generic sections.
      $('.main.style1').scrollex({
        mode: 'middle',
        delay: 100,
        initialize: function () { $(this).addClass('inactive'); },
        terminate:  function () { $(this).removeClass('inactive'); },
        enter:      function () { $(this).removeClass('inactive'); },
        leave:      function () { $(this).addClass('inactive'); }
      });

      $('.main.style2').scrollex({
        mode: 'middle',
        delay: 100,
        initialize: function () { $(this).addClass('inactive'); },
        terminate:  function () { $(this).removeClass('inactive'); },
        enter:      function () { $(this).removeClass('inactive'); },
        leave:      function () { $(this).addClass('inactive'); }
      });

      // Contact.
      $('#contact').scrollex({
        top: '50%',
        delay: 50,
        initialize: function () { $(this).addClass('inactive'); },
        terminate:  function () { $(this).removeClass('inactive'); },
        enter:      function () { $(this).removeClass('inactive'); },
        leave:      function () { $(this).addClass('inactive'); }
      });

    };

    var off = function () {
      $('.gallery').unscrollex();
      $('.main.style1').unscrollex();
      $('.main.style2').unscrollex();
      $('#contact').unscrollex();
    };

    breakpoints.on('<=small', off);
    breakpoints.on('>small', on);

  }

  // Events.
  var resizeTimeout;

  $window
    .on('resize', function () {

      // Disable animations/transitions.
      $body.addClass('is-resizing');

      clearTimeout(resizeTimeout);

      resizeTimeout = setTimeout(function () {

        // Update scrolly links.
        $('a[href^="#"]').scrolly({
          speed: 1500,
          offset: $header.outerHeight() - 1
        });

        // Re-enable animations/transitions.
        setTimeout(function () {
          $body.removeClass('is-resizing');
          $window.trigger('scroll');
        }, 0);

      }, 100);

    })
    .on('load', function () {
      $window.trigger('resize');
    });
  /* ---------- Formspree hook (contact form) ---------- */
  $(function () {
    var $form = $('#contact-form');
    if (!$form.length) return;

    var $status = $('#form-status');

    $form.on('submit', function (e) {
      e.preventDefault();
      $status.text('Sending…');

      $.ajax({
        url: $form.attr('action'),
        method: 'POST',
        data: $form.serialize(),
        dataType: 'json',
        headers: { 'Accept': 'application/json' }
      })
      .done(function () {
        $status.text('Thanks! I’ll get back to you soon.');
        $form[0].reset();
      })
      .fail(function (xhr) {
        var msg = 'Oops, something went wrong. Please try again.';
        if (xhr.responseJSON && xhr.responseJSON.errors) {
          msg = $.map(xhr.responseJSON.errors, function (e) { return e.message; }).join(', ');
        }
        $status.text(msg);
      });
    });
  });
  /* ---------- /Formspree hook ---------- */

})(jQuery);

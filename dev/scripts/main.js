(function($){
  
  'use strict';

  $(document).ready(function(){

    var body = $('body');
    
    var mobile = function(){
      return elemWidth(body) > 768 ? false : true;
    };

    var elemWidth = function(elem){
      return elem.width();
    };
    
    var getNav = function(){
      return mobile() ?  $('nav#mobile-nav') : $('nav#standard-nav');
    };



    // D O M   R E F E R E N C E

    var dom = {
      win               : $(window),
      html              : $('html'),
      bod               : $('body'),
      htmlBody          : $('html, body'), // Necessary for IE - see goTo()
      nav               : getNav(),
      navLinks          : $('nav a'),
      header            : $('header'),
      allSections       : $(['section#home', 'section#about', 'section#things', 'section#contact']),
      about             : $('div#about'),
      projects          : $('div#project'),
      contact           : $('div#contact'),
      navHome           : $(this.nav).find('a').attr('href'),
      navAbout          : $(this.nav).find('#about'),
      navProjects       : $(this.nav).find('#things'),
      navContact        : $(this.nav).find('#contact'),
      headerOverlay     : $('header .header-overlay2'),
      title             : $('header h1'),
      logo              : $('header .logo'),
      projectThumb      : $('div.thumb'),
      projectView       : $('div.project-view'),
      projectClose      : $('div.close-button'),
      contactForm       : $('form#contact-form')
    };
    
    var domData = {
      navOverhang: mobile() ? document.getElementById('menu').clientHeight : 10,
      headerHeight: dom.header.height()
    };

    var scroll = (function(){
      
      return {
        prevPosition: dom.bod.scrollTop() || dom.html.scrollTop(),

        getPosition: function(){
          return dom.bod.scrollTop() || dom.html.scrollTop();
        },

        position: function(){
          return this.getPosition() < 0 ? 0 : this.getPosition(); // Prevent negative scroll positions for bouncy browsers (osx safari, etc)
        },
        
        newPosition: function(){
          return this.position() !== this.prevPosition;
        },

        prevDirection: null,

        direction: function(){
          return this.prevPosition < this.position() ? 'down' : 'up';
        },

        newDirection: function(){
          return this.direction() !== this.prevDirection;
        },

        isInside: function(elem, offset){ // elem must be jquery object
          // return ( this.position() >= (elem.offset().top - dom.nav.height()) && this.position() < (elem.offset().top + elem.height()) ) ? true : false;
          return ( this.position() >= (elem.offset().top - offset) && this.position() < (elem.offset().top + elem.height()) ) ? true : false;
        },
        
        isAbove: function(elem){ 
          var top = elem.offset().top;
          return this.position() < top;
        },
        
        isBelow: function(elem){
          var bottom = elem.offset().top + elem.height();
          return this.position() > bottom;
        }
      };
    })();



    // P A G E   S E T U P

    dom.bod.animate({opacity: 1});
    $('nav a[href=#home]').addClass('active');
    $('h2').fitText(1, {maxFontSize: '48px'});



    // D O M   M A N I P U L A T I O N

    function hideNav(){
      dom.nav.css({top: (-dom.nav.height() + domData.navOverhang)});
    }

    function showNav(){
      dom.nav.css({top: 0});
    }

    function toggleNav(){
      if(parseInt(dom.nav.css('top')) < 0){
        showNav();
      }else{
        hideNav();
      }
    }
    
    function goTo(section){
      dom.htmlBody.animate({scrollTop: $(section).offset().top}); //This selects 'html, body' for IE page navigation.
      if(mobile()){ hideNav(); }
    }
      
    function setNavColors(){
      dom.allSections.each(function(i, elem){
        if(scroll.isInside($(elem), domData.navOverhang)){
          $('nav a[href="#'+ $(elem)[0].id +'"]').addClass('active')
            .siblings('a').removeClass('active');
        }
      });
    }

    function revealHeadings(){
      dom.allSections.each(function(i, elem){
        if(scroll.isInside($(elem), 300)){
          $(this).find('h2').addClass('active')
            .parent().siblings().find('h2').removeClass('active');
        }
      });
    }

    function scrollToggleNav(){
      var dir = scroll.direction();
      if(dir !== scroll.prevDirection && !mobile()){
        if(dir === 'down'){
          hideNav();
        }else{
          showNav();
        }
      }
      scroll.prevDirection = dir;
      scroll.prevPosition = scroll.position(); // Update last scroll position to equal new scroll position
    }



    // E V E N T   H A N D L E R S

    var handle = {
      windowResize: function(){
        dom.nav = getNav();
        domData.navOverhang = mobile() ? document.getElementById('menu').clientHeight : 10;
        // updateCSS(bodyWidth());
      },
      windowScroll: function(){
        scrollToggleNav();
        setNavColors();
        revealHeadings();
      },
      bodyClick: function(){
        if(mobile()){
          if(parseInt(dom.nav.css('top')) > -dom.nav.find('a').height()){
            hideNav();
          }
        }
      },
      navClick: function(e){
        e.preventDefault();
        var self = $(this);
        if(this.id !== 'menu'){
          goTo(self.attr('href'));
        }else{
          toggleNav();
        }
      },
      projectThumbMouseover: function(){
        var $this = $(this);
        $this.find('.hover-card').addClass('mouseover');
        $this.find('img.project-thumb-hover').addClass('mouseover');
      },
      projectThumbMouseout: function(){
        var $this = $(this);
        $this.find('.hover-card').removeClass('mouseover');
        $this.find('img.project-thumb-hover').removeClass('mouseover');
      },
      projectThumbClick: function(e){
        dom.projectView.addClass('show');
        getProjectImages(e);
      },
      projectCloseClick: function(){
        dom.projectView.removeClass('show');
        $('div.project-view div.img-container').html('');
      }
    };

    (function updateScrolling() {
      if(scroll.newPosition()){
        window.requestAnimationFrame(function(){
          handle.windowScroll();
          updateScrolling();
        });
      }else{
        setTimeout(updateScrolling, 17);
      }
    })();



    // E V E N T S

    dom.win.on('resize', handle.windowResize);
    dom.bod.on('click', handle.bodyClick);
    dom.navLinks.on('click', handle.navClick);
    dom.projectThumb.on('mouseover', handle.projectThumbMouseover);
    dom.projectThumb.on('mouseout', handle.projectThumbMouseout);
    dom.projectThumb.on('click', handle.projectThumbClick);
    dom.projectClose.on('click', handle.projectCloseClick);



    // A J A X

    // function emailFail(status, statusText){
    //   return '<p>Uh oh...<br>! ' + status + ' ' + statusText + '<br>Please reload the page and try again. If this problem continues you can email me directly. Thank you.</p>';
    // }

    function sendMail(e){

      e.preventDefault();
      goTo('#contact');
      
      $.ajax({

        type: 'post',
        url: 'mail',
        data: dom.contactForm.serialize(),

        error: function(response){
          $('div#form-messages').html(response);
        },
        success: function(response, textStatus, xhr){
          
          // '/mail' route will send a status code of 206 if further validation is required.
          // otherwise get rid of the form
          
          if(xhr.status === 200) {
            dom.contactForm.hide();
          }
          $('div#form-messages').html(response);
        }

      });
    }
    
    dom.contactForm.on('submit', function(e){
      sendMail(e);
    });

    function getProjectImages(e){
      
      e.preventDefault();
      
      $.ajax({

        type: 'get',
        url: 'partials/metro.json',

        error: function(response){
          console.log(response);
        },
        success: function(response){
          var images = response.images;
          $('div.project-view div.img-container').html('<img src="' + images[0] + '" alt="">');
        }     
      });
    
    }

  });
})(jQuery);

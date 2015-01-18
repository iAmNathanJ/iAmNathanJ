'use strict';

$(document).ready(function(){

  var body = $('body');

  var bodyWidth = function(){
    return body.width();
  };

  var mobile = function(){
    return bodyWidth() > 768 ? false : true;
  };
  
  var getNav = function(){
    return mobile() ?  $('nav#mobile-nav') : $('nav#standard-nav');
  };

  var dom = {
    win               : $(window),
    html              : $('html'),
    bod               : $('body'),
    htmlBody          : $('html, body'), // Necessary for IE - see goTo()
    nav               : getNav(),
    navLinks          : $('nav a'),
    header            : $('header'),
    allSections       : $('section'),
    about             : $('div#about'),
    projects          : $('div#project'),
    contact           : $('div#contact'),
    navHome           : $(this.nav).find('a').attr('href'),
    navAbout          : $(this.nav).find('#about'),
    navProjects       : $(this.nav).find('#projects'),
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
    navOverhang       : mobile() ? document.getElementById('menu').clientHeight : 10,
    headerHeight      : dom.header.height()
  };
  
  var scroll = {
    
    position: function(){
      var pos = dom.bod.scrollTop() || dom.html.scrollTop();
      return pos < 0 ? 0 : pos; // Prevent negative scroll positions for bouncy browsers (osx safari, etc)
    },

    prevPosition: dom.bod.scrollTop() || dom.html.scrollTop(),
    
    newPosition: function(){
      return this.position() !== this.prevPosition;
    },

    direction: function(){
      return this.prevPosition < this.position() ? 'down' : 'up';
    },

    prevDirection: null,

    newDirection: function(){
      return this.direction() !== this.prevDirection;
    },

    isInside: function(elem){ // elem must be jquery object
      var position = this.position(),
        range = {
          top: elem.offset().top - dom.nav.height(),
          bottom: elem.offset().top + elem.height()
        };

      return ( position >= range.top && position < range.bottom ) ? true : false;
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

  

  //--- Page Setup ---//

  dom.bod.animate({opacity: 1});
  $('nav a[href=#home]').css({'background': 'rgba(201, 68, 197, 0.2)'});
  $('h2').fitText(1, {maxFontSize: '48px'});



  //--- General Functions ---//

  var hideNav = function(){
    dom.nav.css({top: (-dom.nav.height() + domData.navOverhang)});
  };

  var showNav = function(){
    dom.nav.css({top: 0});
  };

  var toggleNav = function(){
    if(parseInt(dom.nav.css('top')) < 0){
      showNav();
    }else{
      hideNav();
    }
  };
  
  var goTo = function(section){
    dom.htmlBody.animate({scrollTop: $(section).offset().top}); //This selects 'html, body' for IE page navigation.
    if(mobile()){ hideNav(); }
  };
    
  var setNavColors = function(){
    dom.allSections.each(function(i, elem){
      var self = $(elem);
      if(scroll.isInside(self, domData.navOverhang)){
        $('nav a[href=#'+ self[0].id +']').css({'background-color': 'rgba(201, 68, 197, 0.2)'})
          .siblings('a').css({'background-color': 'rgba(201, 68, 91, 0)'});
      }
    });
  };

  var scrollToggleNav = function(){
    var direction = scroll.direction(),
      position = scroll.position();
    if(direction !== scroll.prevDirection && !mobile()) {
      if(direction === 'down'){
        hideNav();
      }else if(direction === 'up'){
        showNav();
      }
    }
    scroll.prevDirection = direction;
    scroll.prevPosition = position; // Update last scroll position to equal new scroll position
  };

  var parallaxHeader = function(scrollPos, intensity){
    var curve = scrollPos * intensity,
      topMargin = 40 - curve;
      // dom.title.css({magrinTop: topMargin});
      dom.title.css({marginTop: topMargin});
      dom.logo.css({marginTop: topMargin});
  };

  var updateCSS = function(bodyWidth){
    if(bodyWidth > 768){
      dom.title.css({left: 40});
      domData.titleOffsetLeft = 40;
      dom.logo.css({right: 40});
      domData.logoOffsetRight = 40;
    }else{
      dom.title.css({left: 0});
      domData.titleOffsetLeft = 0;
      dom.logo.css({right: 0});
      domData.logoOffsetRight = 0;
    }
  };



  //--- Event Handlers---//

  var handle = {
    windowResize: function(){
      dom.nav = getNav();
      domData.navOverhang = mobile() ? document.getElementById('menu').clientHeight : 10;
      updateCSS(bodyWidth());
    },
    windowScroll: function(){
      scrollToggleNav();
      setNavColors();
      if(scroll.isInside(dom.header)){
        parallaxHeader(scroll.position(), 2);
      }
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
    }
  };

  var updateScrolling = function() {
    if(scroll.newPosition()){
      window.requestAnimationFrame(function(){
        handle.windowScroll();    
      });
    } 
    setTimeout(updateScrolling, 17);
  };
  updateScrolling();

  //--- Events ---//

  dom.win.on('resize', handle.windowResize);
  // dom.win.on('scroll', handle.windowScroll);
  dom.bod.on('click', handle.bodyClick);
  dom.navLinks.on('click', handle.navClick);
  dom.projectThumb.on('mouseover', handle.projectThumbMouseover);
  dom.projectThumb.on('mouseout', handle.projectThumbMouseout);
  dom.projectThumb.on('click', handle.projectThumbClick);
  dom.projectClose.on('click', handle.projectCloseClick);



  //--- Ajax ---//

  var emailFail = function(status, statusText){
    return '<p>Uh oh...<br>! ' + status + ' ' + statusText + '<br>Please reload the page and try again. If this problem continues you can email me directly. Thank you.</p>';
  };

  var sendMail = function(e){

    e.preventDefault();
    goTo('#contact');
    
    $.ajax({

      type: 'post',
      url: 'contact.php',
      data: dom.contactForm.serialize(),

      error: function(response){
        $('div#form-messages').html(emailFail(response.status, response.statusText));
      },
      success: function(response, textStatus, xhr){
        
        // contact.php will send a status code of 206 if further validation is required.
        // otherwise get rid of the form
        
        if(xhr.status === 200) {
          dom.contactForm.hide();
        }
        $('div#form-messages').html(response);
      }

    });
  };
  
  dom.contactForm.on('submit', function(e){
    sendMail(e);
  });

  var getProjectImages = function(e){
    
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
  
  };

});
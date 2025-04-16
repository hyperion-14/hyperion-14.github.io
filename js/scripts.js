/*!
* Start Bootstrap - Resume v7.0.2 (https://startbootstrap.com/theme/resume)
* Copyright 2013-2021 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-resume/blob/master/LICENSE)
*/
//
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Activate Bootstrap scrollspy on the main nav element
    const sideNav = document.body.querySelector('#sideNav');
    if (sideNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#sideNav',
            offset: 74,
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

});












// Anim Morph

var morphing = anime({
    targets: '.morph',
      points: [
          //Debut
          { value: '460.677372 125.296036 108.040017 24.8652344 112.454079 125.296036' },
          //Fin
          { value: '460.677372 157.296036 112.758683 38.9677241 119.111306 145.719727' },
      ],
    easing: 'easeInOutQuad',
    duration: 3000,
    loop: true
  });
  
  var morphing = anime({
    targets: '.morph2',
      points: [
          //Debut
          { value: '108.040017 24.8652344 168.780251 0 460.677372 125.296036' },
          //Fin
          { value: '112.758683 38.9677241 184.146186 0 460.677372 157.296036' },
      ],
    easing: 'easeInOutQuad',
    duration: 3000,
    loop: true
  });
  
  var morphing = anime({
    targets: '.morph3',
      points: [
          //Debut
          { value: '75.3147561 38.1354167 460.677372 125.296036 0 68.5184024' },
          //Fin
          { value: '78.250435 57.8044647 460.677372 157.296036 0 100.518402' },
      ],
    easing: 'easeInOutQuad',
    duration: 3000,
    loop: true
  });
  
  
  

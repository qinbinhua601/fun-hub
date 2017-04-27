// detecting if touch mobile device
var touch =
  'ontouchstart' in document.documentElement ||
  navigator.maxTouchPoints > 0 ||
  navigator.msMaxTouchPoints > 0;

// for disabling the hover css effect
if (!touch) {
  document.body.setAttribute('class', 'pc');
}

document.body.onscroll = _.debounce(
  () => {
    let $toTop = document.getElementById('to-top');
    if (document.body.scrollTop > 100) {
      $toTop.style.display = 'block';
    } else {
      $toTop.style.display = 'none';
    }
  },
  200,
  {
    leading: true
  }
);

document.getElementById('to-top').onclick = function(e) {
  e.stopPropagation();
  this.style.display = 'none';
  document.body.scrollTop = 0;
};

// prevent add to home screen app, A link to open by safari
if ('standalone' in window.navigator && window.navigator.standalone) {
  var noddy, remotes = false;
  document.addEventListener(
    'click',
    function(event) {
      noddy = event.target;
      while (noddy.nodeName !== 'A' && noddy.nodeName !== 'HTML') {
        noddy = noddy.parentNode;
      }
      if (
        'href' in noddy &&
        noddy.href.indexOf('http') !== -1 &&
        (noddy.href.indexOf(document.location.host) !== -1 || remotes)
      ) {
        event.preventDefault();
        document.location.href = noddy.href;
      }
    },
    false
  );
}

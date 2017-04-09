import * from 'dom';

export default (function scroll(){
  return {
    prevPosition: dom.bod.scrollTop() || dom.html.scrollTop(),
    getPosition() {
      return dom.bod.scrollTop() || dom.html.scrollTop();
    },
    position() {
      return this.getPosition() < 0 ? 0 : this.getPosition(); // Prevent negative scroll positions for bouncy browsers (osx safari, etc)
    },
    newPosition() {
      return this.position() !== this.prevPosition;
    },
    prevDirection: null,
    direction() {
      return this.prevPosition < this.position() ? 'down' : 'up';
    },
    newDirection() {
      return this.direction() !== this.prevDirection;
    },
    isInside($elem, topAdjust, bottomAdjust)  {
      var currentLocation = this.position()
        , top = $elem.offset().top + (topAdjust || 0)
        , bottom = $elem.offset().top + $elem.height() +  (bottomAdjust || 0);

      return ( currentLocation >= top && currentLocation < bottom ) ? true : false;
    },
    isAbove(elem) {
      var top = elem.offset().top;
      return this.position() < top;
    },
    isBelow(elem) {
      var bottom = elem.offset().top + elem.height();
      return this.position() > bottom;
    }
  };
})();

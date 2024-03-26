import EventEmitter from "./events";
import { INSTANCE_CLASSES } from "./configs";
import {
  init,
  setPosition,
  getScrollPosition,
  getScrollSpeed,
} from "./helpers";
import Listeners from "./listeners";
import { lerp } from "./utils";

export default class Instance {
  constructor(options) {
    this.options = options;

    // DOM elements
    this.target = options.target;
    this.scrollableElement = options.scrollableElm;

    // easing
    this.scrollEase = options.scrollEase;
    this.speedEase = options.speedEase;

    this.autoRender = options.autoRender;

    // already initialized
    if (this.target.classList.contains(INSTANCE_CLASSES.enabled)) {
      console.error("The target has already initialized!");
      return null;
    }

    // instance variable
    this.windowScrollY = 0;
    this.scrollableHeight = 0;

    // position
    this.scrollPositionInLerp = 0;
    this.scrollPosition = 0;

    // speed
    this.speed = 0;
    this.speedInLerp = 0;

    // events emitter
    this.events = new EventEmitter();

    // event listeners for destroy method
    // contains: name, target, handler
    this.listeners = new Listeners();

    // init
    this.hasInitialized = init(this);
    if (!this.hasInitialized) return null;

    // add enabled class
    this.target.classList.add(INSTANCE_CLASSES.enabled);
  }

  /**
   * Register callback
   * @param name {String}
   * @param callback {Function}
   * @return {void}
   * */
  on(name, callback) {
    this.events.on(name, callback);
  }

  /**
   * Render the scrollable element to fit with the position
   */
  render() {
    // calculate the speed, limit the distance on each scroll by 200px
    this.speed = getScrollSpeed(this);
    this.speedInLerp = +lerp(
      this.speedInLerp,
      this.speed,
      this.speedEase
    ).toFixed(3);

    this.scrollPosition = getScrollPosition();
    this.scrollPositionInLerp = +lerp(
      this.scrollPositionInLerp,
      this.scrollPosition,
      this.scrollEase
    ).toFixed(3);

    // translate the scrollable element
    setPosition(this);

    // trigger render event
    this.events.trigger("onRender", [this]);

    // auto render
    if (this.autoRender) requestAnimationFrame(this.render.bind(this));
  }

  /**
   * Destroy the instance
   * */
  destroy() {
    // kill the event listener
    this.listeners.destroyAll();

    // remove enabled class
    this.target.classList.remove(INSTANCE_CLASSES.enabled);

    return Scroll.destroy(this);
  }
}

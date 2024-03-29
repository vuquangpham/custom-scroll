import { isFunction, setCSS } from "./utils";

/**
 * Validate DOM element
 * @param {HTMLElement | String} target
 * @return {object || boolean}
 * */
export function validateTarget(target) {
  // validate target
  let targetErrorMessage = `Target element not found! Please use correct DOM element!`;

  // target is string
  if (typeof target === "string") {
    target = document.querySelector(target);

    // check if the target element doesn't exist
    targetErrorMessage = `Target string is not valid! Please use correct CSS selector!`;
  }

  // target not found
  if (!target) {
    console.error(targetErrorMessage);
    return false;
  }
  return target;
}

/**
 * Init options
 * @param {Object} context
 * @return {Boolean}
 * */
export function init(context) {
  // validate the id
  context.id = context.options.id;

  // init scroll variables
  initScrollVariables(context);

  // check auto render option
  if (context.options.autoRender) {
    context.render();
  }

  // init events
  initEvents(context);

  // revoke init event
  context.events.trigger("onInit", [context]);

  return true;
}

/**
 * Init vars
 */
export function initScrollVariables(context) {
  // update the current position
  context.scrollPosition = context.scrollPositionInLerp = getScrollPosition();

  // set scrollable height
  context.scrollableHeight = context.scrollableElement.scrollHeight;
  setScrollableHeight(context.scrollableHeight);

  // fixed height for the scrollable element
  initStyleForScrollableElement(context);
}

/**
 * Init events
 * @param {Object} context
 * @return {void}
 */
function initEvents(context) {
  // init event
  if (context.options.onInit && isFunction(context.options.onInit))
    context.events.on("onInit", context.options.onInit);

  // render event
  if (context.options.onRender && isFunction(context.options.onRender))
    context.events.on("onRender", context.options.onRender);
}

/**
 * Set scrollable height
 * @param {Number} height
 * @return {void}
 */
function setScrollableHeight(height) {
  setCSS(document.body, { height: height + "px" });
}

/**
 * Init style for the scrollable element
 * @param {Object} context
 * @return {void}
 */
function initStyleForScrollableElement(context) {
  const element = context.target;
  setCSS(element, {
    position: "fixed",
    top: 0,
    overflow: "hidden",
    height: "100%",
    width: "100%",
  });

  // update the position
  setPosition(context, true);
}

/**
 * Set position for the scroll vars
 * @param {Object} context
 * @param {Boolean} forceUpdate
 * @return {void}
 */
export function setPosition(context, forceUpdate = false) {
  // translates the scrollable element
  if (
    forceUpdate ||
    Math.round(context.scrollPositionInLerp) !==
      Math.round(context.scrollPosition)
  ) {
    context.scrollableElement.style.transform = `translate3d(0,${
      -1 * context.scrollPositionInLerp
    }px,0)`;
  }
}

/**
 * Get scroll position
 * @param {Object} context
 * @return {Number}
 */
export function getScrollPosition(context) {
  return window.scrollY || document.documentElement.scrollTop;
}

/**
 * Get scroll speed
 * Limit the distance by 200px
 * @param {Object} context
 * @return {Number}
 */
export function getScrollSpeed(context) {
  return (
    Math.min(
      Math.abs(context.scrollPosition - context.scrollPositionInLerp),
      200
    ) / 200
  );
}

// style
import "./style.scss";

// library
import "@/_index.js";

// package info
import packageInfo from "../package.json";

// update project information
const dataTitles = document.querySelectorAll("[data-title]");
const dataDescriptions = document.querySelectorAll("[data-description]");

// update information
dataTitles.forEach((e) => (e.innerHTML = packageInfo["prettyName"]));
dataDescriptions.forEach((e) => (e.innerHTML = packageInfo.description));

// custom code
Scroll.create({
  target: "main",
  scrollableElm: "[data-scrollable]",
  autoRender: true,

  onInit: (self) => {
    console.log("init", self);
  },
  onRender: (self) => {
    console.log("render", self);
  },
});

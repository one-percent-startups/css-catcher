var MOUSE_VISITED_CLASSNAME = "crx_mouse_visited";
var prevDOM = null;

function mainFunction(e) {
  var srcElement = e.target;
  if (prevDOM != null) {
    prevDOM.classList.remove(MOUSE_VISITED_CLASSNAME);
  }
  srcElement.classList.add(MOUSE_VISITED_CLASSNAME);
  prevDOM = srcElement;
}

function filterChildNodes(childNodes = []) {
  return childNodes
    .filter(
      (node) => !(node.nodeName === "#text" && node.textContent.match(/\\*/))
    )
    .map((node) => ({
      nodeName: node.nodeName,
      textContent: node.textContent,
    }));
}

function getChildren(element) {
  let {
    draggable,
    children,
    childNodes,
    innerText,
    title,
    textContent,
    nodeName,
  } = element;
  let computedstyles = window.getComputedStyle(element);
  let style = {};
  Object.keys(computedstyles).forEach((key) => {
    if (isNaN(parseInt(key))) {
      style[key] = computedstyles[key];
    }
  });
  let childArray = [],
    nodes = [];
  if (Object.keys(children).length > 0) {
    childArray = Object.values(children).map((el) => {
      return getChildren(el);
    });
    nodes = filterChildNodes(Object.values(childNodes));
  }
  return {
    draggable,
    children: childArray,
    childNodes: nodes,
    innerText,
    title,
    textContent,
    nodeName,
    style,
  };
}

function onClick(e) {
  e.preventDefault();
  e.stopPropagation();
  let element = e.target;
  console.dir(element);
  let {
    draggable,
    children,
    childNodes,
    innerText,
    title,
    textContent,
    nodeName,
  } = element;
  let childArray = [],
    nodes = [];
  if (Object.keys(children).length > 0) {
    Object.values(children).forEach((el) => {
      childArray.push(getChildren(el));
    });
    nodes = filterChildNodes(Object.values(childNodes));
  }
  let computedstyles = window.getComputedStyle(element);
  let style = {};
  Object.keys(computedstyles).forEach((key) => {
    if (isNaN(parseInt(key))) {
      style[key] = computedstyles[key];
    }
  });
  let data = {
    draggable,
    children: childArray,
    childNodes: nodes,
    innerText,
    title,
    textContent,
    style,
    nodeName,
  };
  console.log("data", data);
  // chrome.runtime.sendMessage({ data });
  prevDOM.classList.remove(MOUSE_VISITED_CLASSNAME);
  document.removeEventListener("mousemove", mainFunction);
  chrome.storage.local.set({ selected: false });
}

chrome.storage.local.get(["selected"], function (result) {
  if (result.selected) {
    document.addEventListener("mousemove", mainFunction, false);
    document.addEventListener("click", onClick);
  }
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
  for (let [key, { newValue }] of Object.entries(changes)) {
    if (key === "selected" && newValue) {
      document.addEventListener("mousemove", mainFunction, false);
      document.addEventListener("click", onClick);
    } else if (key === "selected")
      document.removeEventListener("click", onClick);
  }
});

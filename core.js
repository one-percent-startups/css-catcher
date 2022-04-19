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

function getChildren(element) {
  let { children, childNodes, innerText, title, textContent, nodeName } =
    element;
  let style = {},
    childArray = [],
    nodes = [];
  try {
    let computedstyles = window.getComputedStyle(element);
    Object.keys(computedstyles).forEach((key) => {
      if (isNaN(parseInt(key))) {
        style[key] = computedstyles[key];
      }
    });
    if (Object.keys(childNodes).length > 0) {
      nodes = Object.values(childNodes).map((el) => getChildren(el));
    }
    if (Object.keys(children).length > 0)
      childArray = Object.values(children).map((el) => getChildren(el));
  } catch {
    // do nothing
  } finally {
    return {
      children: childArray,
      childNodes: nodes,
      innerText,
      title,
      textContent,
      nodeName,
      style,
    };
  }
}

function onClick(e) {
  e.preventDefault();
  e.stopPropagation();
  let element = e.target;
  console.dir(element);
  let { children, childNodes, innerText, title, textContent, nodeName } =
    element;
  let childArray = [],
    nodes = [];
  if (Object.keys(children).length > 0)
    Object.values(children).forEach((el) => {
      childArray.push(getChildren(el));
    });
  if (Object.keys(childNodes).length > 0)
    Object.values(childNodes).forEach((el) => {
      nodes.push(getChildren(el));
    });
  let computedstyles = window.getComputedStyle(element);
  let style = {};
  Object.keys(computedstyles).forEach((key) => {
    if (isNaN(parseInt(key))) {
      style[key] = computedstyles[key];
    }
  });
  let data = {
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

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
  let { childNodes, innerText, title, textContent, nodeName } = element;
  let style = {},
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
  } catch {
    // do nothing
  } finally {
    return {
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
  prevDOM.classList.remove(MOUSE_VISITED_CLASSNAME);
  let element = e.target;
  let { childNodes, innerText, title, textContent, nodeName } = element;
  let nodes = [];
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
    childNodes: nodes,
    innerText,
    title,
    textContent,
    style,
    nodeName,
  };
  chrome.runtime.sendMessage({ data });
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

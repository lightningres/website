(function () {
  var q = document.querySelector(".ask-demo [data-ask-type]");
  if (!q || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var full = q.textContent;
  var done = document.createElement("span");
  var rest = document.createElement("span");
  done.className = "typed";
  rest.className = "untyped";
  q.textContent = "";
  q.append(done, rest);
  rest.textContent = full;
  q.classList.add("is-typing");
  var i = 0;
  var timer = window.setInterval(function () {
    i += 1;
    done.textContent = full.slice(0, i);
    rest.textContent = full.slice(i);
    if (i < full.length) return;
    window.clearInterval(timer);
    q.classList.remove("is-typing");
    q.textContent = full;
  }, 16);
})();

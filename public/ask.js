(function () {
  var card = document.querySelector(".ask-demo");
  var q = card && card.querySelector("[data-ask-type]");
  if (!card || !q || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var full = q.textContent;
  var done = document.createElement("span");
  var rest = document.createElement("span");
  var step = 0;
  var loop = 0;
  done.className = "typed";
  rest.className = "untyped";
  q.textContent = "";
  q.append(done, rest);
  rest.textContent = full;
  card.classList.add("is-ready");

  function type() {
    var i = 0;
    window.clearInterval(step);
    q.classList.add("is-typing");
    step = window.setInterval(function () {
      i += 1;
      done.textContent = full.slice(0, i);
      rest.textContent = full.slice(i);
      if (i < full.length) return;
      window.clearInterval(step);
      q.classList.remove("is-typing");
    }, 16);
  }

  function play() {
    card.classList.remove("is-playing");
    void card.offsetWidth;
    done.textContent = "";
    rest.textContent = full;
    card.classList.add("is-playing");
    type();
  }

  function stop() {
    window.clearInterval(step);
    window.clearInterval(loop);
    loop = 0;
    card.classList.remove("is-playing");
    q.classList.remove("is-typing");
    done.textContent = "";
    rest.textContent = full;
  }

  new window.IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting) {
      if (loop) return;
      play();
      loop = window.setInterval(play, 35000);
      return;
    }
    if (loop) stop();
  }, { threshold: 0.2 }).observe(card);
})();

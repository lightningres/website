(function () {
  var open = document.querySelector("[data-waitlist-open]");
  var dialog = document.getElementById("waitlist");
  var form = dialog && dialog.querySelector("form");
  if (!open || !dialog || !form || typeof dialog.showModal !== "function") return;

  var title = document.getElementById("waitlist-title");
  var lead = dialog.querySelector("[data-waitlist-lead]");
  var fields = dialog.querySelector("[data-waitlist-fields]");
  var error = dialog.querySelector("[data-waitlist-error]");
  var done = dialog.querySelector(".waitlist-done");
  var submit = form.querySelector("[type=submit]");
  var titleText = title.textContent;
  var leadText = lead.textContent;
  var submitText = submit.textContent;
  var sending = false;

  function reset() {
    form.reset();
    sending = false;
    title.textContent = titleText;
    lead.textContent = leadText;
    lead.hidden = false;
    fields.hidden = false;
    error.hidden = true;
    done.hidden = true;
    submit.disabled = false;
    submit.textContent = submitText;
  }

  function shut() {
    reset();
    dialog.close();
  }

  open.addEventListener("click", function (event) {
    event.preventDefault();
    if (dialog.open) return;
    reset();
    dialog.showModal();
  });

  dialog.addEventListener("click", function (event) {
    if (event.target === dialog) shut();
  });

  dialog.querySelectorAll("[data-waitlist-close]").forEach(function (button) {
    button.addEventListener("click", shut);
  });

  dialog.addEventListener("close", reset);
  dialog.addEventListener("cancel", reset);

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (sending) return;
    sending = true;
    error.hidden = true;
    submit.disabled = true;
    submit.textContent = "Sending…";

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(new FormData(form)).toString()
    }).then(function (response) {
      if (!response.ok) throw new Error("status");
      title.textContent = "You’re on the list.";
      lead.textContent = "We’ll write to the address you gave.";
      fields.hidden = true;
      done.hidden = false;
      done.focus();
    }).catch(function () {
      sending = false;
      submit.disabled = false;
      submit.textContent = submitText;
      error.hidden = false;
    });
  });
})();

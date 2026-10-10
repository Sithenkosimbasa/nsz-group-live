/* NSZ Group — contact form
   Submits to Netlify Forms. If that fails (e.g. form detection is off), falls back to a
   prefilled email so no enquiry is lost. */
(function () {
  "use strict";
  var form = document.getElementById("contact-form");
  if (!form) return;

  var EMAIL = "nszgroupbussines@gmail.com";
  var WHATSAPP = "https://wa.me/27634371374";
  var status = document.getElementById("form-status");
  var button = form.querySelector('button[type="submit"]');
  var buttonHTML = button.innerHTML;
  var submitted = false;

  /* Prefill "What do you need?" from ?service= (links on service and pricing pages) */
  var params = new URLSearchParams(window.location.search);
  var wanted = params.get("service");
  if (wanted) {
    var select = document.getElementById("f-service");
    var match = Array.prototype.find.call(select.options, function (o) { return o.text === wanted; });
    if (!match) {
      match = new Option(wanted, wanted);
      select.add(match, 0);
    }
    match.selected = true;
  }

  var rules = [
    { id: "f-name", test: function (v) { return v.length > 0; }, msg: "Please enter your name." },
    { id: "f-email", test: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }, msg: "Please enter a valid email address, like name@company.co.za, so we can reply." },
    { id: "f-message", test: function (v) { return v.length > 0; }, msg: "Please tell us a little about your project." },
  ];

  function check(rule) {
    var input = document.getElementById(rule.id);
    var err = document.getElementById(rule.id + "-err");
    var ok = rule.test(input.value.trim());
    input.setAttribute("aria-invalid", ok ? "false" : "true");
    err.hidden = ok;
    err.textContent = ok ? "" : rule.msg;
    return ok;
  }

  rules.forEach(function (rule) {
    document.getElementById(rule.id).addEventListener("blur", function () {
      if (submitted) check(rule);
    });
  });

  function setStatus(html, kind) {
    status.className = "form-status " + kind;
    status.innerHTML = html;
  }

  function mailtoFallback() {
    var get = function (id) { return (document.getElementById(id).value || "").trim(); };
    var subject = "Website enquiry from " + get("f-name") + " — " + get("f-service");
    var body = [
      "Name: " + get("f-name"),
      "Business: " + (get("f-company") || "-"),
      "Email: " + get("f-email"),
      "Phone: " + (get("f-phone") || "-"),
      "Service: " + get("f-service"),
      "",
      get("f-message"),
    ].join("\n");
    var href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    setStatus(
      'We couldn’t send the form just now. <a href="' + href + '">Send it by email instead</a> or <a href="' + WHATSAPP + '" rel="noopener">message us on WhatsApp</a>.',
      "err"
    );
    window.location.href = href;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    submitted = true;
    var firstBad = null;
    rules.forEach(function (rule) {
      if (!check(rule) && !firstBad) firstBad = document.getElementById(rule.id);
    });
    if (firstBad) {
      setStatus("Please fix the highlighted fields.", "err");
      firstBad.focus();
      return;
    }

    button.disabled = true;
    button.textContent = "Sending…";
    setStatus("", "");

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(new FormData(form)).toString(),
    })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        window.location.href = "/contact/thanks/";
      })
      .catch(function () {
        button.disabled = false;
        button.innerHTML = buttonHTML;
        mailtoFallback();
      });
  });
})();

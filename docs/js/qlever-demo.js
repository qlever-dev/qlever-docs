document$.subscribe(function() {
  var codeblocks = document.querySelectorAll(".highlight[data-demo-engine]")
  codeblocks.forEach(function(el) {
    mountRunDemoButton(el)
  })
})

function mountRunDemoButton(el) {
    var code = el.querySelector('code')
    var content = code.textContent.trim()
    var engine = el.getAttribute('data-demo-engine')
    var parent = code.closest('pre')

    const button = renderRunDemoButton(engine, content)
    parent.insertBefore(button, code)

}

function renderRunDemoButton(engine, operation) {
  // Create the button element instead of returning an HTML string
  const button = document.createElement("a");
  button.className = "md-run md-icon";
  button.title = "Run";
  button.setAttribute("href", `http://qlever.dev/${engine}?query=${encodeURIComponent(operation)}&exec=true`);
  button.setAttribute("target", "_blank");
  button.setAttribute("rel", "noopener noreferrer");

  return button;
}
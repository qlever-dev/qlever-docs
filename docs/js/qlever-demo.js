document$.subscribe(function() {
  var codeblocks = document.querySelectorAll(".highlight[data-demo-engine]")
  codeblocks.forEach(function(el) {
    mountRunDemoButton(el)
  })
})

function mountRunDemoButton(el) {
    var code = el.querySelector('code')
    var nav = el.querySelector('nav')
    var content = code.textContent.trim()
    var engine = el.getAttribute('data-demo-engine')

    const button = renderRunDemoButton(engine, content)
    nav.prepend(button)

}

function renderRunDemoButton(engine, operation) {
  const button = document.createElement("a");
  button.className = "md-run";
  button.title = "Run query";
  button.setAttribute("href", `https://qlever.dev/${engine}?query=${encodeURIComponent(operation)}&exec=true`);
  button.setAttribute("target", "_blank");
  button.setAttribute("rel", "noopener noreferrer");

  return button;
}
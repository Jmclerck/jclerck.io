function changeEventHandler({ matches }) {
  const icon = document.head.querySelector("[sizes]");

  if (matches) {
    icon.href = "dark.ico";
  } else {
    icon.href = "light.ico";
  }
}

const match = matchMedia("(prefers-color-scheme: dark)");
match.addEventListener("change", changeEventHandler);
changeEventHandler(match);

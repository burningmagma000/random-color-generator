document.fonts.ready.then(() =>
{
  const webFrame = require("electron").webFrame;
  webFrame.setZoomLevel(0);
  webFrame.setZoomLevelLimits(1, 1);
  webFrame.setVisualZoomLevelLimits(1, 1);
});

const params = new URLSearchParams(window.location.search);
const resolvedVersion = params.get("version");
const versionSpan = document.getElementById("versionNumber");

if (versionSpan)
{
  versionSpan.textContent = resolvedVersion ? resolvedVersion.replace(/^v/, "") : "";
}

let hashtagApplied = false;
let hashtag = "";
let analyzedColor = "";
let pressOriginatedOnButton = false;
let rgb = {};
rgb.r = 255;
rgb.g = 255;
rgb.b = 255;

window.addEventListener("contextmenu", (e) =>
{
  e.preventDefault();
});

window.addEventListener("beforeunload", (e) =>
{
  if (performance.getEntriesByType("navigation")[0]?.type === "reload")
  {
    e.preventDefault();
    e.returnValue = false;
  }
});

document.addEventListener("DOMContentLoaded", () =>
{
  document.querySelectorAll("button").forEach((button) =>
  {
    button.addEventListener("mouseenter", () =>
    {
      if (!pressOriginatedOnButton)
      {
        const span = button.querySelector("span");
        if (span) span.classList.add("hovering");
      }
    });

    button.addEventListener("mouseleave", () =>
    {
      const span = button.querySelector("span");
      if (span) span.classList.remove("hovering");
      if (span) span.classList.remove("holding");
    });

    button.addEventListener("touchstart", () =>
    {
      const span = button.querySelector("span");
      if (span) span.classList.add("holding");
      if (span) span.classList.remove("hovering");
    });
  });
});

document.addEventListener("mousedown", (e) =>
{
  const button = e.target.closest("button");
  if (button)
  {
    pressOriginatedOnButton = true;
    const span = button.querySelector("span");
    if (span)
    {
      span.classList.add("holding");
      span.classList.remove("hovering");
    }
  }
  else
  {
    pressOriginatedOnButton = false;
  }
});

document.addEventListener("mouseup", (e) =>
{
  pressOriginatedOnButton = false;

  document.querySelectorAll("button").forEach((button) =>
  {
    const span = button.querySelector("span");
    if (span) span.classList.remove("holding");

    const rect = button.getBoundingClientRect();
    const inBounds =
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom;

    if (inBounds)
    {
      const span = button.querySelector("span");
      if (span) span.classList.add("hovering");
    }
    else
    {
      const span = button.querySelector("span");
      if (span) span.classList.remove("hovering");
    }
  });
});

document.addEventListener("touchend", () =>
{
  document.querySelectorAll("button").forEach((button) =>
  {
    const span = button.querySelector("span");
    if (span) span.classList.remove("holding");
    const span2 = button.querySelector("span");
    if (span2) span2.classList.remove("hovering");
  });
});

document.addEventListener("touchcancel", () =>
{
  document.querySelectorAll("button").forEach((button) =>
  {
    const span = button.querySelector("span");
    if (span) span.classList.remove("holding");
    const span2 = button.querySelector("span");
    if (span2) span2.classList.remove("hovering");
  });
});

function GetRandomColor()
{
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++)
  {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function Generate()
{
  const color = GetRandomColor();
  hex = color;
  analyzedColor = color.replace(/#/g, "");
  Update();
}

function HexToRGB(analyzedColor)
{
  let r = parseInt(analyzedColor.substring(0, 2), 16);
  let g = parseInt(analyzedColor.substring(2, 4), 16);
  let b = parseInt(analyzedColor.substring(4, 6), 16);
  return { r: r, g: g, b: b };
}

function HashtagOnOrOff()
{
  if (document.getElementById("hashtagCheckbox").checked)
  {
    hashtagApplied = true;
  }
  else
  {
    hashtagApplied = false;
  }

  if (hashtagApplied)
  {
    hashtag = "#";
  }
  else
  {
    hashtag = "";
  }

  if (analyzedColor == "")
  {
    analyzedColor = "FFFFFF";
  }

  Update();
}

function Update()
{
  rgb = HexToRGB(analyzedColor);
  let inverted = "rgb(" + (255 - rgb.r) + ", " + (255 - rgb.g) + ", " + (255 - rgb.b) + ")";
  let normal = "rgb(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ")";
  let hexText = hashtag + analyzedColor;
  let rgbText = rgb.r + ", " + rgb.g + ", " + rgb.b;

  document.getElementById("window").style.backgroundColor = "#" + analyzedColor;
  document.getElementById("color").innerText = hexText + "\n" + rgbText;
  document.getElementById("color").style.color = inverted;
  document.getElementById("title").style.color = inverted;
  document.getElementById("version").style.color = inverted;
  document.getElementById("copyright").style.color = inverted;
  document.getElementById("hashtagCheckboxLabel").style.color = inverted;
  document.getElementById("hashtagCheckbox").style.accentColor = inverted;

  document.querySelectorAll("button").forEach((button) =>
  {
    button.style.color = normal;
    button.style.backgroundColor = inverted;
  });
}

function CopyHEXCode()
{
  if (analyzedColor != "")
  {
    navigator.clipboard.writeText(hashtag + analyzedColor);
  }
  else
  {
    navigator.clipboard.writeText("FFFFFF");
  }
}

function CopyRGBValues()
{
  navigator.clipboard.writeText(rgb.r + ", " + rgb.g + ", " + rgb.b);
}

function CopyRValue()
{
  navigator.clipboard.writeText(rgb.r);
}

function CopyGValue()
{
  navigator.clipboard.writeText(rgb.g);
}

function CopyBValue()
{
  navigator.clipboard.writeText(rgb.b);
}

window.addEventListener("blur", () =>
{
  document.querySelectorAll("button span").forEach((span) =>
  {
    span.classList.remove("hovering");
    span.classList.remove("holding");
  });
  pressOriginatedOnButton = false;
});
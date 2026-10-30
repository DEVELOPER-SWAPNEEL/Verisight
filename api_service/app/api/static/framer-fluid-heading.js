import React from "react";
import { createRoot } from "react-dom/client";
import FluidImage from "https://framerusercontent.com/modules/FGulkuxlFs9TUlpFjoIw/OnzxeJHBv5svzF26KWFj/FluidImage.js";

const heading = document.getElementById("hero-heading");
const mount = document.getElementById("fluid-heading-mount");
const lines = heading ? [...heading.querySelectorAll(".hero-heading-line")] : [];
const fallback = () => heading.classList.add("fluid-heading-fallback");

if (!heading || !mount || !lines.length || !window.WebGLRenderingContext) {
  if (heading) fallback();
} else {
  const root = createRoot(mount);
  let disposed = false;
  let resizeFrame = 0;
  let readyFrame = 0;
  let readyAttempts = 0;
  let currentTexture = "";
  let context = null;
  let textureCanvas = null;
  const pixelRatio = () => Math.min(window.devicePixelRatio || 1, 1.6);

  function paintHeadingTexture() {
    const bounds = heading.getBoundingClientRect();
    if (bounds.width < 2 || bounds.height < 2) return;
    const scale = pixelRatio();
    const width = Math.max(1, Math.round(bounds.width * scale));
    const height = Math.max(1, Math.round(bounds.height * scale));
    if (!textureCanvas) {
      textureCanvas = document.createElement("canvas");
      context = textureCanvas.getContext("2d", { alpha: true });
    }
    textureCanvas.width = width;
    textureCanvas.height = height;
    context.clearRect(0, 0, width, height);
    context.save();
    context.scale(scale, scale);
    context.textAlign = "left";
    context.textBaseline = "middle";
    context.fontKerning = "normal";
    const supportsCanvasLetterSpacing = "letterSpacing" in context;

    for (const line of lines) {
      const lineBox = line.getBoundingClientRect();
      const xOffset = lineBox.left - bounds.left;
      const y = lineBox.top - bounds.top + lineBox.height / 2;
      const runs = [...line.childNodes].map((node) => ({
        text: node.textContent || "",
        style: getComputedStyle(node.nodeType === Node.ELEMENT_NODE ? node : line),
        gradient: node.nodeType === Node.ELEMENT_NODE && node.matches("em"),
      })).filter((run) => run.text.length);
      const measuredRuns = runs.map((run) => {
        context.font = run.style.font;
        const spacing = Number.parseFloat(run.style.letterSpacing) || 0;
        context.letterSpacing = `${spacing}px`;
        const width = context.measureText(run.text).width + (supportsCanvasLetterSpacing ? 0 : spacing * Math.max(0, run.text.length - 1));
        return { ...run, spacing, width };
      });
      const totalWidth = measuredRuns.reduce((sum, run) => sum + run.width, 0);
      const fitScale = totalWidth > lineBox.width ? lineBox.width / totalWidth : 1;
      context.save();
      context.translate(xOffset + (lineBox.width - totalWidth * fitScale) / 2, y);
      context.scale(fitScale, 1);
      let x = 0;
      for (const run of measuredRuns) {
        context.font = run.style.font;
        context.letterSpacing = `${run.spacing}px`;
        if (run.gradient) {
          const gradient = context.createLinearGradient(x, lineBox.height * 0.42, x + run.width, -lineBox.height * 0.42);
          gradient.addColorStop(0, "#16a34a");
          gradient.addColorStop(1, "#0d9488");
          context.fillStyle = gradient;
        } else {
          context.fillStyle = getComputedStyle(heading).color;
        }
        context.fillText(run.text, x, 0);
        x += run.width;
      }
      context.restore();
    }
    context.restore();
    const nextTexture = textureCanvas.toDataURL("image/png");
    if (nextTexture !== currentTexture) {
      currentTexture = nextTexture;
      render();
    }
  }

  function handleCanvasReady() {
    if (disposed) return;
    const canvas = mount.querySelector("canvas");
    if (canvas && canvas.style.opacity === "1") {
      heading.classList.add("fluid-ready");
      cancelAnimationFrame(readyFrame);
      return;
    }
    if (mount.textContent.includes("Fluid Image:") || (!canvas && readyAttempts > 240)) {
      fallback();
      cancelAnimationFrame(readyFrame);
      root.unmount();
      canvasObserver.disconnect();
      return;
    }
    readyAttempts += 1;
    readyFrame = requestAnimationFrame(handleCanvasReady);
  }

  function checkCanvasReady() {
    readyAttempts = 0;
    cancelAnimationFrame(readyFrame);
    readyFrame = requestAnimationFrame(handleCanvasReady);
  }

  function render() {
    if (disposed || !currentTexture) return;
    const isSmallScreen = matchMedia("(max-width: 560px)").matches;
    root.render(React.createElement(FluidImage, {
      image: currentTexture,
      objectFit: "contain",
      effect: {
        showGradient: false,
        radius: isSmallScreen ? 0.12 : 0.14,
        strength: 0.72,
        distortion: 0.38,
        hueShift: 0,
        colorCycle: 0,
      },
      animation: { speed: 0.42, persistence: 0.94, pointerSmooth: 0.1 },
      advanced: {
        fadeIn: true,
        fadeInDuration: 0.22,
        maxDpr: isSmallScreen ? 1 : 1.45,
        overflowPadding: 14,
        quality: isSmallScreen ? "low" : "high",
      },
    }));
    checkCanvasReady();
  }

  const schedulePaint = () => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(paintHeadingTexture);
  };
  const resizeObserver = new ResizeObserver(schedulePaint);
  resizeObserver.observe(heading);
  window.addEventListener("resize", schedulePaint, { passive: true });
  document.fonts?.ready.then(schedulePaint);
  paintHeadingTexture();

  const canvasObserver = new MutationObserver(checkCanvasReady);
  canvasObserver.observe(mount, { childList: true, subtree: true, attributes: true, attributeFilter: ["style"] });

  window.addEventListener("pagehide", () => {
    disposed = true;
    cancelAnimationFrame(resizeFrame);
    cancelAnimationFrame(readyFrame);
    resizeObserver.disconnect();
    canvasObserver.disconnect();
    window.removeEventListener("resize", schedulePaint);
    root.unmount();
  }, { once: true });
}

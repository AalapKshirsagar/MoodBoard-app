const upload = document.getElementById("imageUpload");
const canvas = document.getElementById("canvas");
const exportBtn = document.getElementById("exportBtn");

/* -----------------------
   IMAGE UPLOAD
------------------------*/
upload.addEventListener("change", (e) => {
  const files = e.target.files;

  Array.from(files).forEach((file) => {
    const wrapper = document.createElement("div");
    wrapper.style.position = "absolute";
    wrapper.style.top = "50px";
    wrapper.style.left = "50px";

    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    img.classList.add("mood-img");

    const del = document.createElement("button");
    del.className = "delete-btn";
    del.textContent = "×";

    const resizeHandle = document.createElement("div");
    resizeHandle.className = "resize-handle";

    wrapper.appendChild(img);
    wrapper.appendChild(del);
    wrapper.appendChild(resizeHandle);
    canvas.appendChild(wrapper);

    makeDraggable(wrapper);
    makeResizable(wrapper, resizeHandle);

    del.addEventListener("click", () => wrapper.remove());
  });
});

/* -----------------------
   DRAGGABLE IMAGES
------------------------*/
function makeDraggable(el) {
  let offsetX, offsetY;

  el.addEventListener("mousedown", (e) => {
    if (e.target.classList.contains("resize-handle")) return; // avoid conflict

    offsetX = e.clientX - el.offsetLeft;
    offsetY = e.clientY - el.offsetTop;

    function move(e) {
      el.style.left = e.clientX - offsetX + "px";
      el.style.top = e.clientY - offsetY + "px";
    }

    function stop() {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", stop);
    }

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", stop);
  });
}

/* -----------------------
   RESIZE IMAGES
------------------------*/
function makeResizable(wrapper, handle) {
  handle.addEventListener("mousedown", function (e) {
    e.stopPropagation();

    const img = wrapper.querySelector("img");
    const startX = e.clientX;
    const startWidth = img.offsetWidth;

    function resize(e) {
      img.style.width = startWidth + (e.clientX - startX) + "px";
    }

    function stopResize() {
      document.removeEventListener("mousemove", resize);
      document.removeEventListener("mouseup", stopResize);
    }

    document.addEventListener("mousemove", resize);
    document.addEventListener("mouseup", stopResize);
  });
}

/* -----------------------
   EXPORT AS PNG
------------------------*/
exportBtn.addEventListener("click", () => {
  html2canvas(canvas).then((canvasImage) => {
    const link = document.createElement("a");
    link.download = "moodboard.png";
    link.href = canvasImage.toDataURL("image/png");
    link.click();
  });
});

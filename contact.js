// ============================================================
// THE CONTACT DETAILS, BEHIND A CAPTCHA — contact.html
//
// The owner, 2026-09-26: "in contact, add a captcha that hides the
// contact information (let it be filer contact information)" — and
// then "keep this: Get in touch, send a carrier pigeon. Below it add :or
// just send an email: and there add the stuff". So the check stands
// under the owner's "or just send an email:", and what it shows is the
// (filler) email.
//
// WHAT IT IS: six characters drawn in specks — the site's own way of
// drawing — each turned a little and set a little off its line, over a
// scatter of stray specks and two hairlines, on a canvas; a box to type
// them back into; and, once they are typed, the details. Upper or lower
// case both do. A wrong answer draws new characters. "New characters"
// draws new ones on request, for a set that cannot be read.
//
// WHAT IT KEEPS OUT: programs that read pages for addresses. The details
// are not in the page in the clear — they are scrambled in `data-sealed`
// and unscrambled here only once the check is passed. It is a check made
// in the browser: a site with no server of its own cannot do the kind a
// server confirms, and a program that runs the page's script could still
// get past it. It stops the ordinary harvesting that reads a page and
// takes whatever looks like an address, which is what it is for.
//
// WITHOUT THIS SCRIPT the page is its sentence, the owner's line under
// it, and a line saying the email needs JavaScript.
// ============================================================
(function () {
  const lock = document.querySelector(".contact-lock");
  if (!lock) return;
  const form = lock.querySelector(".contact-check");
  const canvas = lock.querySelector(".contact-captcha-canvas");
  const field = lock.querySelector(".contact-captcha-field");
  const say = lock.querySelector(".contact-captcha-say");
  const again = lock.querySelector(".contact-captcha-new");
  const list = lock.querySelector(".contact-details");
  const g = canvas && canvas.getContext("2d");
  if (!form || !g || !field) return;

  lock.classList.add("is-scripted");
  form.hidden = false;

  // No O and 0, no I, 1 and l, no S and 5, no B and 8, no G, Q or Z:
  // nothing that can be read as something else.
  const LETTERS = "ACDEFHJKLMNPRTUVWXY34679";
  const COUNT = 6;
  const W = 300, H = 96;
  const INK = "21, 21, 15";

  let answer = "";

  function unseal(sealed) {
    const key = "aldehydes";
    const bytes = atob(sealed);
    let out = "";
    for (let i = 0; i < bytes.length; i++) out += String.fromCharCode(bytes.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    return JSON.parse(out);
  }

  /** New characters, drawn. */
  function draw() {
    answer = "";
    for (let i = 0; i < COUNT; i++) answer += LETTERS[Math.floor(Math.random() * LETTERS.length)];
    render();
  }

  /** The characters there are, drawn in specks. */
  function render() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * ratio);
    canvas.height = Math.round(H * ratio);
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    g.setTransform(ratio, 0, 0, ratio, 0, 0);
    g.clearRect(0, 0, W, H);

    // Each character drawn big on a card of its own, and read back as
    // the places a speck may stand.
    const card = document.createElement("canvas");
    card.width = 70; card.height = 80;
    const c = card.getContext("2d", { willReadFrequently: true });
    const step = (W - 36) / COUNT;
    for (let i = 0; i < COUNT; i++) {
      c.clearRect(0, 0, 70, 80);
      c.save();
      c.translate(35, 42);
      c.rotate((Math.random() - 0.5) * 0.7);
      const size = 46 + Math.random() * 12;
      c.font = "600 " + size.toFixed(0) + "px Archivo, 'Helvetica Neue', Arial, sans-serif";
      c.textAlign = "center";
      c.textBaseline = "middle";
      c.fillStyle = "#000";
      c.fillText(answer[i], 0, 0);
      c.restore();
      const d = c.getImageData(0, 0, 70, 80).data;
      const ox = 18 + i * step + (Math.random() - 0.5) * 6 - 35 + step / 2;
      const oy = (H - 80) / 2 + (Math.random() - 0.5) * 12;
      for (let y = 0; y < 80; y += 2) {
        for (let x = 0; x < 70; x += 2) {
          if (d[(y * 70 + x) * 4 + 3] < 128) continue;
          const z = 1.1 + Math.random() * 0.9;
          g.fillStyle = "rgba(" + INK + "," + (0.55 + Math.random() * 0.45).toFixed(2) + ")";
          g.fillRect(ox + x + (Math.random() - 0.5) * 1.6 - z / 2, oy + y + (Math.random() - 0.5) * 1.6 - z / 2, z, z);
        }
      }
    }
    // Strays, and two hairlines across it.
    for (let k = 0; k < 420; k++) {
      const z = 0.8 + Math.random() * 1.2;
      g.fillStyle = "rgba(" + INK + "," + (0.12 + Math.random() * 0.3).toFixed(2) + ")";
      g.fillRect(Math.random() * W, Math.random() * H, z, z);
    }
    g.strokeStyle = "rgba(" + INK + ",0.45)";
    g.lineWidth = 0.9;
    for (let k = 0; k < 2; k++) {
      g.beginPath();
      const y0 = 20 + Math.random() * (H - 40);
      g.moveTo(0, y0);
      g.bezierCurveTo(W * 0.33, y0 + (Math.random() - 0.5) * 60, W * 0.66, y0 + (Math.random() - 0.5) * 60, W, 20 + Math.random() * (H - 40));
      g.stroke();
    }
    lock.dataset.drawn = String((Number(lock.dataset.drawn) || 0) + 1);
  }

  function open() {
    let details;
    try { details = unseal(lock.dataset.sealed || ""); } catch (e) { details = []; }
    list.innerHTML = "";
    details.forEach(([label, value, href]) => {
      const dt = document.createElement("dt");
      dt.textContent = label;
      const dd = document.createElement("dd");
      if (href) {
        const a = document.createElement("a");
        a.href = href;
        a.textContent = value;
        dd.appendChild(a);
      } else dd.textContent = value;
      list.append(dt, dd);
    });
    form.hidden = true;
    list.hidden = false;
    lock.classList.add("is-open");
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const typed = field.value.replace(/\s+/g, "").toUpperCase();
    if (!typed) { say.textContent = "Type the characters in the picture first."; field.focus(); return; }
    if (typed === answer) { say.textContent = ""; open(); return; }
    say.textContent = "Not quite — here are new characters.";
    field.value = "";
    draw();
    field.focus();
  });
  again.addEventListener("click", () => { say.textContent = ""; field.value = ""; draw(); field.focus(); });

  // Drawn once the site's own face has arrived, so the characters are in
  // it; drawn at once if it is slow, and again when it comes.
  draw();
  if (document.fonts && document.fonts.load) {
    // The same characters again, in it — someone may have begun typing.
    document.fonts.load("600 48px Archivo").then(() => { if (!lock.classList.contains("is-open")) render(); }).catch(() => {});
  }
})();

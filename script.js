(function () {
  const header = document.querySelector("[data-header]");
  const toggle = document.querySelector("[data-menu-toggle]");
  const nav = document.querySelector("[data-nav]");
  const form = document.querySelector("[data-quote-form]");
  const status = document.querySelector("[data-form-status]");
  const instagramUrl = "https://www.instagram.com/glosshouse.studio/";
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function setHeaderState() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  }

  function closeMenu() {
    if (!toggle || !nav) return;
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  setHeaderState();
  window.addEventListener("scroll", setHeaderState, { passive: true });

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      const open = !nav.classList.contains("is-open");
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
    });

    nav.addEventListener("click", function (event) {
      if (event.target instanceof HTMLAnchorElement) closeMenu();
    });
  }

  const revealItems = Array.from(document.querySelectorAll(".reveal-on-scroll, [data-reveal-media]"));

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
  } else {
    const revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    }, {
      root: null,
      rootMargin: "0px 0px -10% 0px",
      threshold: 0.16
    });

    revealItems.forEach(function (item) {
      revealObserver.observe(item);
    });
  }

  if (form && status) {
    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      const data = new FormData(form);
      const name = String(data.get("name") || "").trim();
      const vehicle = String(data.get("vehicle") || "").trim();
      const service = String(data.get("service") || "").trim();
      const notes = String(data.get("notes") || "").trim();

      const message = [
        "Oi, Glosshouse! Quero um orçamento.",
        name ? "Nome: " + name : "",
        vehicle ? "Veiculo: " + vehicle : "",
        service ? "Servico: " + service : "",
        notes ? "Observacoes: " + notes : ""
      ].filter(Boolean).join("\n");

      try {
        await navigator.clipboard.writeText(message);
        status.textContent = "Mensagem copiada. Abrindo o Instagram da Glosshouse...";
      } catch (error) {
        status.textContent = "Mensagem pronta. O Instagram vai abrir em seguida.";
      }

      window.setTimeout(function () {
        window.open(instagramUrl, "_blank", "noopener");
      }, 450);
    });
  }
})();

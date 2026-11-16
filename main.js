const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;

/* ---- EDIT YOUR CONTENT ---- */
const projects = [
    {
        id: "brd",
        title: "Blue Ridge Dynamics",
        tag: "UI/UX and software internship, 2023",
        color: "#d8482f",
        cats: ["Design", "Engineering"],
        blurb: "Designed a web app prototype in Figma, then built text summarizers and sentiment analysis.",
        body: "<p>As a UI/UX intern I designed a prototype web application. As a software developer intern I built and tested text summarizers and sentiment analyses.</p><p><a href='brd.html'>Read the full case study</a></p>"
    },
    {
        id: "site",
        title: "This website",
        tag: "Front-end, personal",
        color: "#f2b632",
        cats: ["Engineering", "Design"],
        blurb: "A home for my work and my photography.",
        body: "<p>Plain HTML, CSS and JavaScript on GitHub Pages. Add your problem, process and what you would change.</p>"
    }
];

/* src: image path like "images/photo1.webp". Leave "" for a color placeholder. */
const photos = [
    { src: "", alt: "Photo 1", cat: "Travel", c: "#f2b632", h: 300 },
    { src: "", alt: "Photo 2", cat: "Portraits", c: "#d8482f", h: 380 },
    { src: "", alt: "Photo 3", cat: "Film", c: "#3f9a8c", h: 260 },
    { src: "", alt: "Photo 4", cat: "Travel", c: "#2b50c8", h: 340 },
    { src: "", alt: "Photo 5", cat: "Portraits", c: "#f1a7b9", h: 300 },
    { src: "", alt: "Photo 6", cat: "Film", c: "#f2b632", h: 360 }
];

const words = ["write code.", "take photographs.", "edit videos."];

/* --------------------------- */
const page = location.pathname.split("/").pop() || "index.html";
const link = (h, t) => `<a href="${h}" ${page === h ? 'class="on"' : ""}>${t}</a>`;
document.body.insertAdjacentHTML("afterbegin", [
    `<div id="bar"></div>`,
    `<header>`,
    `  <a class="logo" href="index.html"><i></i>Katherine Yang</a>`,
    `  <nav>`,
    `    ${link("projects.html", "Projects")}`,
    `    ${link("about.html", "About")}`,
    `    <a href="mailto:katherinehyang@gmail.com">Contact</a>`,
    `  </nav>`,
    `</header>`
].join(""));
document.body.insertAdjacentHTML("beforeend", [
    `<footer>`,
    `  <a href="mailto:katherinehyang@gmail.com">Email</a>`,
    `  <a href="https://github.com/katherinehyang" rel="noopener">GitHub</a>`,
    `  <a href="https://www.linkedin.com/in/katherinehyang/" rel="noopener">LinkedIn</a>`,
    `</footer>`
].join(""));
addEventListener("scroll", () => {
    $("#bar").style.width = scrollY / (document.documentElement.scrollHeight - innerHeight) * 100 + "%";
}, { passive: true });

/* rotating words */
const w = $("#word");
if (w && !reduce) {
    let i = 0;
    setInterval(() => {
        i = (i + 1) % words.length;
        w.style.animation = "none";
        w.offsetWidth;
        w.style.animation = "";
        w.textContent = words[i];
    }, 2300);
}

/* icon tiles: tilt toward cursor */
$$(".tile").forEach((t) => {
    if (reduce) return;
    t.addEventListener("pointermove", (e) => {
        const r = t.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        t.style.setProperty("--ry", x * 18 + "deg");
        t.style.setProperty("--rx", -y * 18 + "deg");
        t.style.setProperty("--tx", x * 16 + "px");
        t.style.setProperty("--ty", y * 16 + "px");
    });
    t.addEventListener("pointerleave", () => ["--rx", "--ry", "--tx", "--ty"].forEach((v) => t.style.removeProperty(v)));
});

/* marquee: duplicate content for seamless loop */
const m = $(".marquee div");
if (m) m.innerHTML += m.innerHTML;

/* projects: grid, filter, dialog */
const grid = $("#workGrid");
const pd = $("#pd");
function drawProjects(f) {
    const list = f && f !== "All" ? projects.filter((p) => p.cats.includes(f)) : projects;
    grid.innerHTML = list.map((p) => [
        `<button class="card" data-id="${p.id}" style="--c:${p.color}">`,
        `  <div class="cv"></div>`,
        `  <div class="t">`,
        `    <h3>${p.title}</h3>`,
        `    <p>${p.tag}</p>`,
        `    <p>${p.blurb}</p>`,
        `  </div>`,
        `</button>`
    ].join("")).join("");
}

function openProject(id) {
    const p = projects.find((x) => x.id === id);
    if (!p) return;
    $("#pdBar").style.setProperty("--c", p.color);
    $("#pdBody").innerHTML = `<h2>${p.title}</h2><p style="opacity:.7">${p.tag}</p>${p.body}`;
    pd.showModal();
    history.replaceState(null, "", "#" + id);
}

if (grid) {
    drawProjects();
    grid.addEventListener("click", (e) => {
        const c = e.target.closest(".card");
        if (c) openProject(c.dataset.id);
    });
    pd.addEventListener("click", (e) => {
        if (e.target === pd || e.target.matches(".x")) pd.close();
    });
    pd.addEventListener("close", () => history.replaceState(null, "", location.pathname));
    if (projects.some((p) => "#" + p.id === location.hash)) openProject(location.hash.slice(1));
    const pc = $("#projChips");
    if (pc) {
        const cs = ["All", "Design", "Engineering"];
        pc.innerHTML = cs.map((c, i) => `<button aria-pressed="${i === 0}">${c}</button>`).join("");
        pc.addEventListener("click", (e) => {
            const b = e.target.closest("button");
            if (!b) return;
            [...pc.children].forEach((x) => x.setAttribute("aria-pressed", x === b));
            drawProjects(b.textContent);
        });
    }
}

/* photos: filter + lightbox */
const gal = $("#gallery");
let shown = photos;
let cur = 0;
const media = (p, h) => {
    if (p.src) {
        return `<img class="ph" src="${p.src}" alt="${p.alt}" loading="lazy">`;
    }
    return `<div class="ph" role="img" aria-label="${p.alt}" style="background:${p.c};height:${h || p.h}px"></div>`;
};
if (gal) {
    const ch = $("#chips");
    const lb = $("#lb");
    const cats = ["All", ...new Set(photos.map((p) => p.cat))];
    ch.innerHTML = cats.map((c, i) => `<button aria-pressed="${i === 0}">${c}</button>`).join("");
    const draw = (c) => {
        shown = c === "All" ? photos : photos.filter((p) => p.cat === c);
        gal.innerHTML = shown.map((p, i) => `<button data-i="${i}" aria-label="Open photo: ${p.alt}">${media(p)}</button>`).join("");
    };
    draw("All");
    ch.addEventListener("click", (e) => {
        const b = e.target.closest("button");
        if (!b) return;
        [...ch.children].forEach((x) => x.setAttribute("aria-pressed", x === b));
        draw(b.textContent);
    });
    const show = (i) => {
        cur = (i + shown.length) % shown.length;
        $("#lbImg").innerHTML = media(shown[cur], 520);
    };
    gal.addEventListener("click", (e) => {
        const b = e.target.closest("button");
        if (b) {
            show(+b.dataset.i);
            lb.showModal();
        }
    });
    $("#prev").onclick = () => show(cur - 1);
    $("#next").onclick = () => show(cur + 1);
    $("#close").onclick = () => lb.close();
    lb.addEventListener("click", (e) => {
        if (e.target === lb) lb.close();
    });
    lb.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") show(cur - 1);
        if (e.key === "ArrowRight") show(cur + 1);
    });
}

/* scroll reveal (last, so generated cards are included) */
const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
    }
}), { threshold: 0.12 });

$$("main section>*, .card, .cs>*, .about>*").forEach((e) => {
    e.classList.add("rv");
    io.observe(e);
});

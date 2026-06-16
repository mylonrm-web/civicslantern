const mapSvg = d3.select("#us-map");
const panel = document.querySelector("#state-panel");
const stateSelect = document.querySelector("#state-select");
const stateButtonGrid = document.querySelector("#state-button-grid");

const orderedStates = Object.entries(STATE_NAMES)
  .filter(([fips]) => fips !== "11")
  .sort((a, b) => a[1].localeCompare(b[1]));

function createControls() {
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Select a state";
  placeholder.disabled = true;
  placeholder.selected = true;
  stateSelect.appendChild(placeholder);

  orderedStates.forEach(([fips, name]) => {
    const option = document.createElement("option");
    option.value = fips;
    option.textContent = name;
    stateSelect.appendChild(option);

    const button = document.createElement("button");
    button.type = "button";
    button.className = "state-button";
    button.dataset.fips = fips;
    button.textContent = name;
    button.addEventListener("click", () => selectState(fips));
    stateButtonGrid.appendChild(button);
  });

  stateSelect.addEventListener("change", (event) => selectState(event.target.value));
}

function linkList(items) {
  return items.map((item) => `
    <a href="${item.url}" target="_blank" rel="noopener noreferrer">${item.label}</a>
  `).join("");
}

function officialList(items) {
  if (!items.length) {
    return `<p class="muted">Detailed official listings are coming soon for this state.</p>`;
  }

  return items.map((item) => `
    <li>
      <span>${item.office}</span>
      <strong>${item.name}</strong>
      ${item.note ? `<em>${item.note}</em>` : ""}
      ${item.source ? `<a href="${item.source}" target="_blank" rel="noopener noreferrer">Official source</a>` : ""}
    </li>
  `).join("");
}

function bulletList(items) {
  return items.map((item) => `<li>${item}</li>`).join("");
}

function selectState(fips) {
  if (!fips) return;

  const data = STATE_DATA[fips];
  if (!data) return;

  stateSelect.value = fips;

  document.querySelectorAll(".state-button").forEach((button) => {
    button.classList.toggle("selected", button.dataset.fips === fips);
  });

  mapSvg.selectAll("path.state").classed("selected", (d) => String(d.id).padStart(2, "0") === fips);

  panel.innerHTML = `
    <p class="section-kicker">Selected state</p>
    <h2>${data.name}</h2>
    <p>${data.summary}</p>

    <div class="state-info-block">
      <h3>Current statewide officials</h3>
      <ul class="official-list">${officialList(data.officials)}</ul>
    </div>

    <div class="state-info-block">
      <h3>Voting basics</h3>
      <ul>${bulletList(data.votingBasics)}</ul>
    </div>

    <div class="state-info-block">
      <h3>Official links</h3>
      <div class="resource-links">${linkList(data.links)}</div>
    </div>

    <div class="state-info-block">
      <h3>Local information</h3>
      <ul>${bulletList(data.localInfo)}</ul>
    </div>

    <p class="last-updated">Last updated: ${data.lastUpdated}</p>
  `;
}

async function drawMap() {
  try {
    const response = await fetch("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json");
    const topology = await response.json();
    const states = topojson.feature(topology, topology.objects.states).features
      .filter((feature) => String(feature.id).padStart(2, "0") !== "72");

    const projection = d3.geoAlbersUsa().fitSize([940, 580], { type: "FeatureCollection", features: states });
    const path = d3.geoPath(projection);

    mapSvg.selectAll("path")
      .data(states)
      .join("path")
      .attr("class", "state")
      .attr("d", path)
      .attr("tabindex", 0)
      .attr("role", "button")
      .attr("aria-label", (d) => STATE_NAMES[String(d.id).padStart(2, "0")] || "State")
      .on("click", (_, d) => selectState(String(d.id).padStart(2, "0")))
      .on("keydown", (event, d) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          selectState(String(d.id).padStart(2, "0"));
        }
      });

    mapSvg.append("path")
      .datum(topojson.mesh(topology, topology.objects.states, (a, b) => a !== b))
      .attr("class", "state-borders")
      .attr("d", path);

  } catch (error) {
    document.querySelector(".map-note").textContent =
      "The map could not load. Use the state selector or state list below.";
  }
}

createControls();
drawMap();

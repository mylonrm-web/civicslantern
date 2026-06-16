const mapSvg = d3.select("#us-map");
const panel = document.querySelector("#state-panel");
const stateSelect = document.querySelector("#state-select");

const orderedStates = Object.entries(STATE_NAMES).sort((a, b) => a[1].localeCompare(b[1]));

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
  });

  stateSelect.addEventListener("change", (event) => selectState(event.target.value));
}

function linkList(items) {
  return items.map((item) => `
    <a href="${item.url}" target="_blank" rel="noopener noreferrer">${item.label}</a>
  `).join("");
}

function officialList(items) {
  return Object.entries(items).map(([office, name]) => `
    <li>
      <span>${office}</span>
      <strong>${name}</strong>
    </li>
  `).join("");
}

function senatorList(items) {
  return items.map((name) => `<li>${name}</li>`).join("");
}

function houseBreakdown(house) {
  const parts = [];
  parts.push(`<span><strong>${house.democrats}</strong> Democratic</span>`);
  parts.push(`<span><strong>${house.republicans}</strong> Republican</span>`);
  if (house.other) parts.push(`<span><strong>${house.other}</strong> Other / Independent / Vacancy</span>`);
  return parts.join("");
}

async function loadCounties(abbr) {
  const target = document.querySelector("#county-list");
  if (!target) return;

  target.innerHTML = `<span class="loading-counties">Loading counties...</span>`;

  try {
    const url = `https://cdn.jsdelivr.net/npm/states-counties@1.2.1/${abbr}.js`;
    const response = await fetch(url);
    const text = await response.text();

    const module = { exports: null };
    const exports = {};
    const result = new Function("module", "exports", `${text}; return module.exports || exports.default || exports;`)(module, exports);

    let counties = [];
    if (Array.isArray(result)) {
      counties = result.map((item) => {
        if (typeof item === "string") return item;
        return item.name || item.county || item.County || item.countyName || item.NAME || "";
      }).filter(Boolean);
    } else if (result && typeof result === "object") {
      counties = Object.values(result).flat().map((item) => {
        if (typeof item === "string") return item;
        return item.name || item.county || item.County || item.countyName || item.NAME || "";
      }).filter(Boolean);
    }

    counties = [...new Set(counties)].sort((a, b) => a.localeCompare(b));

    if (!counties.length) throw new Error("No counties found");

    target.innerHTML = counties.map((county) => `<span>${county}</span>`).join("");
  } catch (error) {
    target.innerHTML = `
      <span>County list could not load from the county data source.</span>
      <span>Use the official state election links above for local county election resources.</span>
    `;
  }
}

function selectState(fips) {
  if (!fips) return;

  const data = STATE_DATA[fips];
  if (!data) return;

  stateSelect.value = fips;
  mapSvg.selectAll("path.state").classed("selected", (d) => String(d.id).padStart(2, "0") === fips);

  panel.classList.remove("empty-state");

  panel.innerHTML = `
    <p class="section-kicker">Selected state</p>
    <h2>${data.name}</h2>
    <p>${data.summary}</p>

    <div class="state-info-block">
      <h3>Statewide officials</h3>
      <ul class="official-list">${officialList(data.statewideOfficials)}</ul>
    </div>

    <div class="state-info-block">
      <h3>Federal representation</h3>
      <h4 class="mini-heading">U.S. Senators</h4>
      <ul>${senatorList(data.federalRepresentation.senators)}</ul>
      <h4 class="mini-heading">U.S. House delegation</h4>
      <div class="house-breakdown">${houseBreakdown(data.federalRepresentation.houseDelegation)}</div>
    </div>

    <div class="state-info-block">
      <h3>Voting registration guidance</h3>
      <ul>
        <li><strong>Early registration / preregistration age:</strong> ${data.registration.earlyRegistrationAge}</li>
        <li><strong>Midterm registration deadline:</strong> ${data.registration.midtermDeadline}</li>
      </ul>
    </div>

    <div class="state-info-block">
      <h3>Official links</h3>
      <div class="resource-links">${linkList(data.links)}</div>
    </div>

    <div class="state-info-block counties-block">
      <h3>Counties</h3>
      <div class="county-list" id="county-list"></div>
    </div>

    <p class="last-updated">Last updated: ${data.lastUpdated}. ${data.sourceNote}</p>
  `;

  loadCounties(data.abbr);
}

async function drawMap() {
  try {
    const response = await fetch("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json");
    const topology = await response.json();
    const states = topojson.feature(topology, topology.objects.states).features
      .filter((feature) => String(feature.id).padStart(2, "0") !== "72" && STATE_NAMES[String(feature.id).padStart(2, "0")]);

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
    panel.innerHTML = `
      <p class="section-kicker">Map unavailable</p>
      <h2>Use the dropdown to select a state.</h2>
      <p>The state data is still available even if the map cannot load.</p>
    `;
  }
}

createControls();
drawMap();

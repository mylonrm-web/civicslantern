const STATE_NAMES = {
  "01": "Alabama", "02": "Alaska", "04": "Arizona", "05": "Arkansas", "06": "California",
  "08": "Colorado", "09": "Connecticut", "10": "Delaware",
  "12": "Florida", "13": "Georgia", "15": "Hawaii", "16": "Idaho", "17": "Illinois",
  "18": "Indiana", "19": "Iowa", "20": "Kansas", "21": "Kentucky", "22": "Louisiana",
  "23": "Maine", "24": "Maryland", "25": "Massachusetts", "26": "Michigan",
  "27": "Minnesota", "28": "Mississippi", "29": "Missouri", "30": "Montana",
  "31": "Nebraska", "32": "Nevada", "33": "New Hampshire", "34": "New Jersey",
  "35": "New Mexico", "36": "New York", "37": "North Carolina", "38": "North Dakota",
  "39": "Ohio", "40": "Oklahoma", "41": "Oregon", "42": "Pennsylvania",
  "44": "Rhode Island", "45": "South Carolina", "46": "South Dakota", "47": "Tennessee",
  "48": "Texas", "49": "Utah", "50": "Vermont", "51": "Virginia", "53": "Washington",
  "54": "West Virginia", "55": "Wisconsin", "56": "Wyoming"
};

const STATE_SLUGS = Object.fromEntries(
  Object.entries(STATE_NAMES).map(([fips, name]) => [fips, name.toLowerCase().replace(/ /g, "-")])
);

const STATE_DATA = {};

Object.entries(STATE_NAMES).forEach(([fips, name]) => {
  STATE_DATA[fips] = {
    name,
    summary: "State-specific civic resources will appear here.",
    lastUpdated: "Coming soon",
    officials: [],
    votingBasics: [
      "Current elected officials will be added for this state.",
      "Voting age, registration rules, ID rules, and deadlines will be added using official sources.",
      "County or local election resources will be added where available."
    ],
    links: [
      { label: "Vote.gov state voting guide", url: `https://vote.gov/register/${STATE_SLUGS[fips]}` },
      { label: "USA.gov voting and elections", url: "https://www.usa.gov/voting-and-elections" }
    ],
    localInfo: [
      "Official state election office links will be added here.",
      "Official local or county election resources will be added here.",
      "State legislature and elected official lookup tools will be added here."
    ]
  };
});

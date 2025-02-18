let names = [];
let savedPlans = JSON.parse(localStorage.getItem("savedPlans")) || [];

document.addEventListener("DOMContentLoaded", () => {
    showSavedPlans(); // Direkt gespeicherte Pläne laden
    generateGrid();
});

function newList() {
    document.getElementById("mainScreen").classList.remove("hidden");
    document.getElementById("savedPlans").classList.add("hidden");
    document.getElementById("nameList").value = "";
    names = [];
    generateGrid();
}

function saveList() {
    names = document.getElementById("nameList").value.split("\n").filter(n => n.trim() !== "").slice(0, 30);
    localStorage.setItem("currentNames", JSON.stringify(names));
}

function generateGrid() {
    const grid = document.getElementById("grid");
    grid.innerHTML = "";
    for (let i = 0; i < 24; i++) {
        if (i % 8 === 4) grid.appendChild(document.createElement("div"));
        const seat = document.createElement("div");
        seat.classList.add("seat");
        seat.dataset.index = i;
        grid.appendChild(seat);
    }
}

function spinWheel() {
    if (names.length === 0) return alert("Keine Namen mehr im Glücksrad!");
    const nameIndex = Math.floor(Math.random() * names.length);
    const seat = [...document.querySelectorAll(".seat")].find(s => !s.textContent);
    if (!seat) return alert("Alle Plätze sind belegt!");
    seat.textContent = names.splice(nameIndex, 1)[0];
    seat.classList.add("occupied");
}

function resetSeats() {
    generateGrid();
    names = JSON.parse(localStorage.getItem("currentNames")) || [];
}

function saveSeatPlan() {
    let planName = prompt("Sitzplan speichern als:");
    if (!planName) return;
    let seatData = [...document.querySelectorAll(".seat")].map(seat => seat.textContent || "");

    savedPlans = JSON.parse(localStorage.getItem("savedPlans")) || [];
    savedPlans.push({ name: planName, seats: seatData });
    localStorage.setItem("savedPlans", JSON.stringify(savedPlans));

    alert(`Sitzplan '${planName}' gespeichert!`);
    showSavedPlans();
}

function showSavedPlans() {
    document.getElementById("savedPlans").classList.remove("hidden");
    document.getElementById("mainScreen").classList.add("hidden");

    savedPlans = JSON.parse(localStorage.getItem("savedPlans")) || [];
    let listHTML = savedPlans.length ? savedPlans.map((plan, index) => `
        <li>
            <button onclick="loadSeatPlan(${index})">${plan.name}</button>
            <button onclick="deleteSeatPlan(${index})" style="background:red;">X</button>
        </li>`).join("") : "<p>Keine gespeicherten Sitzpläne.</p>";

    document.getElementById("plansList").innerHTML = listHTML;
}

function loadSeatPlan(index) {
    let plan = savedPlans[index];
    generateGrid();
    document.querySelectorAll(".seat").forEach((seat, i) => {
        if (plan.seats[i]) {
            seat.textContent = plan.seats[i];
            seat.classList.add("occupied");
        }
    });
    document.getElementById("savedPlans").classList.add("hidden");
    document.getElementById("mainScreen").classList.remove("hidden");
}

function deleteSeatPlan(index) {
    if (!confirm(`Sitzplan '${savedPlans[index].name}' wirklich löschen?`)) return;
    savedPlans.splice(index, 1);
    localStorage.setItem("savedPlans", JSON.stringify(savedPlans));
    showSavedPlans();
}

function hideSavedPlans() {
    document.getElementById("savedPlans").classList.add("hidden");
    document.getElementById("mainScreen").classList.remove("hidden");
}

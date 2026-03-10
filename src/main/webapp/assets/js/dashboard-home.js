function updateDashboardHomeWelcome() {
    const userStr = sessionStorage.getItem("loggedUser");
    if(!userStr) return;

    const user = JSON.parse(userStr);

    const welcomeEl = document.getElementById("welcome-name");
    if (welcomeEl){
        welcomeEl.textContent = `${user.firstName} ${user.lastName}`;
    }
    loadDashboardStats();
}

function loadDashboardStats() {
    const statsStr = sessionStorage.getItem("employeeStatus");
    if (!statsStr) return;

    const current = JSON.parse(statsStr);
    setPreviousStatsIfNotExist(current)
    const previous = JSON.parse(
        sessionStorage.getItem("previousEmployeeStats")
    );

    const setText = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    };

    setText("dh-TotEmp", current.totalEmployees);
    setText("dh-ActEmp", current.activeEmployees);
    setText("dh-InactEmp", current.inactiveEmployees);

    updatePercentage(
        "dh-TotEmp-Per",
        calculatePercentage(current.totalEmployees, previous.totalEmployees)
    );
    updatePercentage(
        "dh-ActEmp-per",
        calculatePercentage(current.activeEmployees, previous.activeEmployees)
    );
    updatePercentage(
        "dh-InActEmp-per",
        calculatePercentage(current.inactiveEmployees, previous.inactiveEmployees)
    );
}

function calculatePercentage(current, previous) {
    if (previous === 0) return 0;

    const percentage = ((current - previous) / previous) * 100;
    return percentage.toFixed(1);
}

function setPreviousStatsIfNotExist(currentStats) {

    const old = sessionStorage.getItem("previousEmployeeStats");

    if (!old) {
        sessionStorage.setItem(
            "previousEmployeeStats",
            JSON.stringify(currentStats)
        );
    }
}

function updatePercentage(elementId, percentValue) {

    const el = document.getElementById(elementId);
    if (!el) return;

    const value = parseFloat(percentValue);

    el.textContent = (value > 0 ? "+" : "") + value + "%";

    // Remove old styles
    el.classList.remove(
        "text-green-500", "bg-green-500/10",
        "text-red-500", "bg-red-500/10"
    );

    if (value > 0) {
        el.classList.add("text-green-500", "bg-green-500/10");
    } else if (value < 0) {
        el.classList.add("text-red-500", "bg-red-500/10");
    } else {
        el.classList.add("text-slate-500", "bg-slate-500/10");
    }
}
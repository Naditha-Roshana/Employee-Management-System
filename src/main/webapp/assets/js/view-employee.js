async function initViewEmployee() {
    const empId = sessionStorage.getItem("viewEmployeeId");
    if(!empId) {
        Notiflix.Notify.failure("No employee selected for viewing", {
            position: "center-top"
        });
        return;
    }

    Notiflix.Loading.dots("Loading Employee...");

    try {
        const response = await fetch(`/ems_pro/api/employees/${empId}`);
        const result = await response.json();

        if(!result.status) {
            throw new Error(result.message  || "Failed to load employee");
        }
        if (!response.ok) {
            throw new Error("Server error while fetching employee");
        }

        // Flexible extraction
        const emp = result.data || result.employee || result;

        if (!emp || !emp.firstName) {
            throw new Error("Invalid employee data received");
        }

        // SUMMARY-CARD
        document.getElementById("empName").textContent =
            emp.firstName + " " + emp.lastName;

        document.getElementById("empRole").textContent =
            emp.position + " • " + emp.department;

        //document.getElementById("empStatus").textContent = emp.status;
        updateViewEmployeeStatusUI(emp.status);

        document.getElementById("empCode").textContent =
            "#EMP-" + String(emp.id).padStart(3, "0");

        // DETAILS-CARD
        document.getElementById("empFullName").textContent =
            emp.firstName + " " + emp.lastName;

        document.getElementById("empNIC").textContent = emp.nic;
        document.getElementById("empEmail").textContent = emp.email;
        document.getElementById("empPhone").textContent = emp.phone;
        document.getElementById("empPosition").textContent = emp.position;
        document.getElementById("empDepartment").textContent = emp.department;

        const hireDate = new Date(emp.hireDate);
        document.getElementById("empHireDate").textContent =
            hireDate.toLocaleDateString("en-Us", {
                year: "numeric",
                month: "long",
                day: "numeric"
            });

        document.getElementById("empSalary").textContent =
            "Rs: " + Number(emp.salary).toLocaleString();

        setAvatar(emp);

    } catch (error) {
        Notiflix.Notify.failure(error.message || "Error loading employee", {
            position: "center-top"
        });
        console.log(error);
    } finally {
        Notiflix.Loading.remove();
    }
}

function setAvatar(user) {
    const avatarEl = document.getElementById("userAvatar");

    if (!avatarEl) return;

    const initials =
        (user.firstName?.charAt(0) || "") +
        (user.lastName?.charAt(0) || "");

    avatarEl.textContent = initials.toUpperCase();
}

function updateViewEmployeeStatusUI(status) {

    const dot = document.getElementById("empStatusDot");
    const badge = document.getElementById("empStatusBadge");
    const statusIcon = document.getElementById("empS-icon");
    const statusText = document.getElementById("empStatus");

    if (!dot || !badge || !statusText) return;

    // Reset classes
    dot.className =
        "absolute bottom-1 right-1 w-5 h-5 border-2 border-white dark:border-background-dark rounded-full";

    badge.className =
        "group flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all";

    if (status?.toUpperCase() === "ACTIVE") {

        // Green Dot
        dot.classList.add("bg-emerald-500");

        // Green Badge
        badge.classList.add(
            "border", "border-emerald-200",
            "text-emerald-600",
            "dark:border-emerald-900/50",
            "dark:text-emerald-400",
            "hover:bg-emerald-50",
            "dark:hover:bg-emerald-900/10"
        );
        statusText.textContent = "done";
        statusText.textContent = "ACTIVE";

    } else {

        // Red Dot
        dot.classList.add("bg-red-500");

        // Red Badge
        badge.classList.add(
            "border", "border-red-200",
            "text-red-600",
            "dark:border-red-900/50",
            "dark:text-red-400",
            "hover:bg-red-50",
            "dark:hover:bg-red-900/10"
        );
        statusIcon.textContent = "block";
        statusText.textContent = "INACTIVE";
    }
}
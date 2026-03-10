window.addEventListener("load", async () => {
    Notiflix.Loading.dots("Loading Employees...", {
        clickToClose: false,
        svgColor: '#0284c7'
    });
    try {
        await loadEmployee();
    } finally {
        Notiflix.Loading.remove();
    }
});

async function loadEmployee() {
    try {
        const response = await fetch("/ems_pro/api/employees");
        const result = await response.json();

        if (!result.status) {
            throw new Error(result.message || "Failed to load employee data");
        }

        const tbody = document.getElementById("employee-table-body");
        if(!tbody) return;
        tbody.innerHTML = "";

        result.data.forEach(emp => {
            const initials =
                (emp.firstName?.[0] || "") +
                (emp.lastName?.[0] || "");

            const isActive = emp.status === "ACTIVE";

            const row = document.createElement("tr");
            row.className =
                "hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors";

            row.innerHTML = `
            <td class="px-6 py-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                    #EMP-${String(emp.id).padStart(3, "0")}
                </td>

                <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                        <div class="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-blue-500 border border-primary/20">
                            ${initials.toUpperCase()}
                        </div>
                        <div>
                            <p class="text-sm font-bold text-slate-900 dark:text-slate-100">
                                ${emp.firstName} ${emp.lastName}
                            </p>
                            <p class="text-xs text-slate-500">
                                ${emp.email}
                            </p>
                        </div>
                    </div>
                </td>

                <td class="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                    ${emp.department}
                </td>

                <td class="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                    ${emp.position}
                </td>

                <td class="px-6 py-4">
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${isActive
                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"}">
                        <span class="w-1.5 h-1.5 rounded-full
                            ${isActive ? "bg-green-500" : "bg-red-500"}"></span>
                        ${emp.status}
                    </span>
                </td>
            `;
            tbody.appendChild(row);
        });

    } catch (error) {
        console.error("Error loading employee data:", error);
        Notiflix.Notify.failure(error.message || "Failed to load employee data", {
            position: "center-top"
        });
    }
}

function viewEmployee(empId) {
    sessionStorage.setItem("viewEmployeeId", empId);
    loadPage("view-employee.html");
}

function editEmployee(empId) {
    sessionStorage.setItem("editEmployeeId", empId);
    loadPage("update-employee.html");
}

async function deleteEmployee(id) {
    Notiflix.Confirm.show(
        "Delete Employee",
        "Are you sure you want to delete this employee?",
        "Yes, Delete",
        "Cancel",
        async () => {

            Notiflix.Loading.dots("Deleting employee...");

            try {
                const response = await fetch(`/ems_pro/api/employees/${id}`, {
                    method: "DELETE"
                });

                const result = await response.json();

                if (!result.status) {
                    Notiflix.Notify.failure(result.message || "Delete failed");
                    return;
                }

                Notiflix.Notify.success("Employee deleted successfully");

                // reload employee table
                loadEmployee(); // your existing function

            } catch (error) {
                Notiflix.Notify.failure("Server error occurred");
            } finally {
                Notiflix.Loading.remove();
            }
        }
    );
}

function startOverview(employees) {
    const totalEmployees = employees.length;
    const activeEmployees = employees.filter(i =>
        i.status === "ACTIVE"
    ).length;
    const inactiveEmployees = employees.filter(i =>
        i.status === "INACTIVE"
    ).length;
    const developers = employees.filter(i =>
        i.position === "Developer"
    ).length;
    document.getElementById("empTot").textContent = totalEmployees;
    document.getElementById("activeEMP").textContent = activeEmployees;
    document.getElementById("devEMP").textContent= developers;
    document.getElementById("inActiveEMP").textContent = inactiveEmployees;
}

async function initEditEmployee() {
    const empId = sessionStorage.getItem("editEmployeeId");
    if (!empId) {
        Notiflix.Notify.failure("No employee selected for viewing", {
            position: "center-top"
        });
        return;
    }


    Notiflix.Loading.dots("Loading Employee...",{

    });

    try {
        const response = await fetch(`/ems_pro/api/employees/${empId}`);
        const result = await response.json();

        if (!result.status) {
            throw new Error(result.message || "Failed to load employee");
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

        updateEmployeeStatusUI(emp.status);

        document.getElementById("empCode").textContent =
            "#EMP-" + String(emp.id).padStart(3, "0");

        // DETAIL-CARD
        document.getElementById("first-Name").value = emp.firstName || "";
        document.getElementById("lastName").value = emp.lastName || "";
        document.getElementById("nicNumber").value = emp.nic || "";
        document.getElementById("hireDate").value = emp.hireDate || "";

        document.getElementById("email").value = emp.email || "";
        document.getElementById("phone-Number").value = emp.phone || "";
        document.getElementById("department").value = emp.department || "";
        document.getElementById("position").value = emp.position || "";
        document.getElementById("salary").value = emp.salary || "";

        // Set Employment Status (Radio Button)
        const statusRadios = document.querySelectorAll("input[name='status']");
        statusRadios.forEach(radio => {
            radio.checked = radio.value.toLowerCase() === emp.status?.toLowerCase();
        });
        setAvatar(emp)

    } catch (error) {
        Notiflix.Notify.failure(error.message || "Error loading employee", {
            position: "center-top"
        });
        console.log(error);
    } finally {
        Notiflix.Loading.remove();
    }

    const statusBtn = document.getElementById("empStatusBadge");
    if (statusBtn) {
        statusBtn.addEventListener("click", () => {
           handleEmployeeStatusChange(empId);
        });
    }

    const form = document.querySelector("form");
    if (form) {
        form.addEventListener("submit", handleUpdateSubmit);
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

function updateEmployeeStatusUI(status) {

    const dot = document.getElementById("empStatusDot");
    const statusBadge = document.getElementById("empStatus")
    const badge = document.getElementById("empStatusBadge");
    const statusIcon = document.getElementById("empS-icon");
    const statusText = document.getElementById("empStatusBtn");

    if (!dot || !badge || !statusText || !statusBadge) return;

    // Reset classes
    dot.className =
        "absolute bottom-1 right-1 w-5 h-5 border-2 border-white dark:border-background-dark rounded-full";

    badge.className =
        "group flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all";

    statusBadge.className =
        "px-2 py-1 text-xs font-semibold rounded";

    if (status?.toUpperCase() === "ACTIVE") {

        // Green Dot
        dot.classList.add("bg-emerald-500");
        statusBadge.classList.add(
            "bg-emerald-100",
            "dark:bg-emerald-500/10",
            "text-emerald-700",
            "dark:text-emerald-400"
        );

        // Green Badge
        badge.classList.add(
            "border", "border-emerald-200",
            "text-emerald-600",
            "dark:border-emerald-900/50",
            "dark:text-emerald-400",
            "hover:bg-emerald-50",
            "dark:hover:bg-emerald-900/10"
        );
        statusBadge.textContent = "ACTIVE";
        statusIcon.textContent = "done";
        statusText.textContent = "ACTIVE";

    } else {

        // Red Dot
        dot.classList.add("bg-red-500");
        statusBadge.classList.add(
            "bg-red-100",
            "dark:bg-red-500/10",
            "text-red-700",
            "dark:text-red-400"
        );

        // Red Badge
        badge.classList.add(
            "border", "border-red-200",
            "text-red-600",
            "dark:border-red-900/50",
            "dark:text-red-400",
            "hover:bg-red-50",
            "dark:hover:bg-red-900/10"
        );
        statusBadge.textContent = "INACTIVE";
        statusIcon.textContent = "block";
        statusText.textContent = "INACTIVE";
    }
}

async function handleUpdateSubmit(e) {
    e.preventDefault();

    const empId = sessionStorage.getItem("editEmployeeId");

    if (!empId) {
        Notiflix.Notify.failure("Employee ID missing", {
            position: "center-top"
        });
        return;
    }

    const employeeData = {
        id: parseInt(empId),
        firstName: document.getElementById("first-Name").value.trim(),
        lastName: document.getElementById("lastName").value.trim(),
        nic: document.getElementById("nicNumber").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone-Number").value.trim(),
        department: document.getElementById("department").value.trim(),
        position: document.getElementById("position").value.trim(),
        salary: parseFloat(document.getElementById("salary").value),
        hireDate: document.getElementById("hireDate").value,
        status: document.querySelector("input[name='status']:checked")?.value || "INACTIVE"
    };

    try {
        const response = await fetch(`/ems_pro/api/employees`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(employeeData)
        });

        const result = await response.json();

        if (!response.ok || !result.status) {
            throw new Error(result.message || "Update Failed");
        }

        Notiflix.Report.success(
            'Employee Updated',
            'Employee details updated successfully',
            'Okay',
            function () {
                loadPage("admin-dashboard-employee.html");
            }
        );

    } catch (error) {
        Notiflix.Notify.failure(error.message || "Error updating employee", {
            position: "center-top"
        });
        console.log(error);
    }
}

async function handleEmployeeStatusChange(empId) {
    const currentStatus = document.getElementById("empStatus").textContent.trim();

    const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    Notiflix.Confirm.show(
        'Change Employee Status',
        `Do you want to change employee status to ${newStatus}?`,
        'Yes',
        'Cancel',
        async function okCb() {
            Notiflix.Loading.dots("Updating status...");

            try {

                const response = await fetch(`/ems_pro/api/employees/status`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        id: parseInt(empId),
                        status: newStatus
                    })
                });

                const result = await response.json();

                if (!response.ok || !result.success) {
                    throw new Error(result.message || "Status update failed");

                } else {

                    updateEmployeeStatusUI(newStatus);

                    Notiflix.Notify.success(result.message, {
                        position: "center-top"
                    });
                }

            } catch (error) {

                Notiflix.Notify.failure(error.message || "Error updating status", {
                    position: "center-top"
                });

                console.log(error);

            } finally {

                Notiflix.Loading.remove();

            }
        },
        function cancelCb() {
            Notiflix.Notify.info("Status change cancelled", {
                position: "center-top"
            });
        }
    );
}
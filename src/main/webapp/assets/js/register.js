window.addEventListener("load", async () => {
    Notiflix.Loading.dots("Loading Employees...", {
        clickToClose: false,
        svgColor: '#0284c7'
    });
    try {
        await loadEmployees();
    } finally {
        Notiflix.Loading.remove();
    }
});

async function loadEmployees() {
    try {
        const response = await fetch("/ems_pro/api/employees/empNI");
        if (response.ok) {
            const result = await response.json();
            const employees = result.data;

            const select = document.getElementById("employee");
            select.innerHTML = `<option value="0">Select Employee</option>`;
            employees.forEach(emp => {
                const option = document.createElement("option");
                option.value = emp.id;
                option.textContent = `${emp.firstName} ${emp.lastName} (ID: #EMP-${String(emp.id).padStart(3, "0")})`;
                select.appendChild(option);
            });
        } else {
            Notiflix.Notify.failure("Failed to load employees", {
                position: 'center-top'
            });
        }


    } catch (e) {
        Notiflix.Notify.failure(e.message , {
            position: 'center-top'
        });
        console.log(e);
    }
}

function mapRoleToId(role) {
    switch (role) {
        case "admin": return 1;
        case "hr": return 2;
        case "manager": return 3;
        default: return 4;
    }
}

async function register(e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const role = document.getElementById("role").value.trim();
    const secretCode = document.getElementById("secretCode").value.trim();
    const password = document.getElementById("password").value.trim();
    const empId = document.getElementById("employee").value.trim();

    if (!username || !password || !secretCode) {
        Notiflix.Notify.failure("All fields are required", {
            position: 'center-top'
        });
        return;
    }

    if (!empId) {
        Notiflix.Notify.failure("Please select your Name and Id", {
            position: 'center-top'
        });
        return;
    }

    Notiflix.Loading.dots("Registering...");

    try {
        const response = await fetch("/ems_pro/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-SECRET-CODE": secretCode
            },
            body: JSON.stringify({
                userName: username,
                password: password,
                roleId: mapRoleToId(role),
                empId: parseInt(empId)
            })
        });

        const result = await response.json();
        Notiflix.Loading.remove();

        if (result.code === "INVALID_SECRET") {
            Notiflix.Report.warning(
                "Security Verification Failed",
                `Invalid registration code for the selected role.<br><br>
                Please enter the correct authorization code.<br>
                If you do not have the required code, contact the <b>System Administration Department</b> for assistance.`,
                "Understood",
                {
                    width: '420px',
                    borderRadius: '12px',
                    backOverlay: true,
                    svgSize: '90px',
                    messageMaxLength: 300,
                }
            );
        } else if (!result.success){
            Notiflix.Notify.failure(result.message || "Registration Failed",{
                position: 'center-top'
            });
            return;
        } else if(!response.ok) {
            Notiflix.Notify.failure(result.message || "Login Failed", {
                position: 'center-top'
            });
            return;
        }

        if (result.success) {

            Notiflix.Report.success(
                result.message,
            );
            Notiflix.Loading.dots("Redirecting to login...");
            setTimeout(() => {
                window.location.href = "index.html";
            }, 1500);
        }

    } catch (error) {
        Notiflix.Loading.remove();
        Notiflix.Notify.failure("Server connection failed");
        console.log(error);
    }
}
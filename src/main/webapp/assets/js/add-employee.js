function initAddEmployeeForm() {
    console.log("Add Employee form initialized");

    const form = document.querySelector("form");
    if (!form) return;

    form.addEventListener("submit", addEmployee);
}

async function addEmployee(e) {
    e.preventDefault();

    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const nic = document.getElementById("nicNumber").value.trim();
    const hireDate = document.getElementById("hireDate").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phoneNumber").value.trim();
    const department = document.getElementById("department").value.trim();
    const position = document.getElementById("position").value.trim();
    const salary = document.getElementById("salary").value.trim();
    const status = document.querySelector('input[name="status"]:checked')?.value;

    if (!firstName || !lastName || !nic || !hireDate || !email || !department || !position || !salary || !phone) {
        Notiflix.Notify.failure("Please fill all required fields", {
            position: "center-top"
        });
        return;
    }

    const payload = {
        firstName,
        lastName,
        nic,
        hireDate,
        email,
        phone,
        department,
        position,
        salary: Number(salary),
        status: status?.toUpperCase()
    };

    try {
        Notiflix.Loading.dots("Saving Employee...", {
            svgColor: "#0284c7",
            clickToClose: false
        });

        const response = await fetch("/ems_pro/api/employees", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (!response.ok || !result.status) {
            Notiflix.Notify.failure(result.message || "Failed to save employee", {
                position: "center-top"
            });
            return;

        } else {
            Notiflix.Report.success(
                'Employee Added Successfully',
                'New employee has been added to the system. <br/><br/> Employee Name: ' + firstName + ' ' + lastName,
                'Okay',
                setTimeout(() => {
                    refreshFields();
                }, 1500)
            );
        }

    } catch (error) {
        Notiflix.Notify.failure("Server Error. Please try again later.", {
            position: "center-top"
        });
        console.log(error);

    } finally {
        Notiflix.Loading.remove();
    }
}

function refreshFields() {
    document.getElementById("firstName").value = "";
    document.getElementById("lastName").value = "";
    document.getElementById("nicNumber").value = "";
    document.getElementById("hireDate").value = "";
    document.getElementById("email").value = "";
    document.getElementById("phoneNumber").value = "";
    document.getElementById("department").value = "";
    document.getElementById("position").value = "";
    document.getElementById("salary").value = "";
}
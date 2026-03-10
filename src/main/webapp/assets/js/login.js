async function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
        Notiflix.Notify.failure("Please enter username and password", {
            position: 'center-top'
        });
        return;
    }

    const payload = {
        userName: username,
        password: password
    };

    try {
        Notiflix.Loading.dots("Authenticating...", {
            svgColor: "#12e4dd",
            clickToClose: false
        });

        const response = await fetch("/ems_pro/api/auth/login", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        Notiflix.Loading.remove();
        if (!response.ok || !result.success) {
            Notiflix.Notify.failure(result.message || "Login Failed", {
                position: 'center-top'
            });
            return;
        }

        sessionStorage.setItem("loggedUser", JSON.stringify(result));

        if (response.ok) {
            Notiflix.Report.success(
                'Login Successfully',
                'Welcome,' + username,
                'Okay',
                function () {
                    // RBAC Logic
                    switch (result.roleName) {
                        case "Admin":
                            window.location.href = "admin-dashboard.html";
                            break;

                        case "HR Manager":
                            window.location.href = "hr-dashboard.html";
                            break;

                        case "Manager":
                            window.location.href = "m-dashboard.html";
                            break;
                    }
                }
            );
        }

    } catch (error) {
        Notiflix.Notify.failure("Server connection error \n Try Again Later")
        Notiflix.Loading.remove();
        console.log(error);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const passwordInput = document.getElementById("password");
    const toggleBtn = document.getElementById("togglePassword");
    const toggleIcon = document.getElementById("toggleIcon");

    if (!passwordInput || !toggleBtn || !toggleIcon) return;

    toggleBtn.addEventListener("click", function () {
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            toggleIcon.textContent = "visibility_off";
        } else {
            passwordInput.type = "password";
            toggleIcon.textContent = "visibility";
        }
    });
})



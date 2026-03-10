async function loadPage(page) {
    try {
        const response = await fetch(page);

        const html = await response.text();

        document.getElementById("main-content").innerHTML = html;

        if (page === "admin-dashboard-home.html") {
            updateDashboardHomeWelcome();
        }

        if (page === "admin-dashboard-employee.html") {
            Notiflix.Loading.dots("Loading Employees...", {
                clickToClose: false,
                svgColor: '#0284c7'
            });

            loadEmployee().finally(() => {
                Notiflix.Loading.remove();
            });
        }
        if (page === "add-employee.html") {
            initAddEmployeeForm();
        }
        if (page === "view-employee.html") {
            initViewEmployee();
        }
        if (page === "update-employee.html"){
            initEditEmployee();
        }
        if (page === "edit-profile.html"){
            loadLoggedUserProfile();
            initChangePassword();
            initUpdateProfile();
        }

    } catch (err) {
        console.log(err);
        document.getElementById("main-content").innerHTML = `
            <div class="text-red-500 font-semibold text-center mt-10">
                Failed to load content. Please try again later.
                ${err.message}
            </div>`;
    }
}

function setActiveLink(activeElement) {
    document.querySelectorAll(".sidebar-link").forEach(link => {
        link.classList.remove(
            "bg-slate-600",
            "text-blue-500",
            "font-semibold"
        );
        link.classList.add(
            "text-slate-600",
            "dark:text-slate-400"
        );
    });
    activeElement.classList.add(
        "bg-slate-600",
        "text-blue-500",
        "font-semibold"
    );
    activeElement.classList.remove(
        "text-slate-600",
        "dark:text-slate-400"
    );
}

document.addEventListener("DOMContentLoaded", () => {

    const defaultLink = document.querySelector(
        '.sidebar-link[data-page="admin-dashboard-home.html"]'
    );

    if (defaultLink) {
        setActiveLink(defaultLink);
        loadPage(defaultLink.dataset.page);
    }

    // Click handling
    document.querySelectorAll(".sidebar-link").forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();

            setActiveLink(link);
            loadPage(link.dataset.page);
        });
    });
});

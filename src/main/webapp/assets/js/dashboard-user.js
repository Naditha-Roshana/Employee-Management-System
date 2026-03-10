window.addEventListener("load", async () => {
    Notiflix.Loading.dots("Preparing Dashboard...", {
        clickToClose: false,
        svgColor: '#0284c7'
    });
    try {
        await loadLoggedUser();
    } finally {
        Notiflix.Loading.remove();
    }
});

async function loadLoggedUser() {
    const userStr = sessionStorage.getItem("loggedUser");
    if (!userStr) {
        window.location.href = "index.html";
        return;
    }

    const user = JSON.parse(userStr);

    const nameEl = document.getElementById("user-name");
    if(nameEl) {
        nameEl.textContent = `${user.firstName} ${user.lastName}`;
    }

    const roleEl = document.getElementById("user-role");
    if (roleEl) {
        roleEl.textContent = `${user.roleName}`;
    }

    const avatarEl = document.getElementById("user-avatar");
    if (avatarEl) {
        const initials =
            (user.firstName?.charAt(0) || "") +
            (user.lastName?.charAt(0) || "");
        avatarEl.textContent = initials.toUpperCase();
    }

}

function logout() {

    Notiflix.Confirm.show(
        "Logout from Dashboard",
        "Are you sure you want to logout?",
        "Yes, Logout",
        "Cancel",
        async () => {
            try {
                Notiflix.Loading.dots("Logging out...", {
                    svgColor: "#12e4dd",
                    clickToClose: false
                });

                sessionStorage.removeItem("loggedUser");
                sessionStorage.clear();

                setTimeout(() => {
                    Notiflix.Loading.remove();

                    Notiflix.Report.success(
                        'Logged Out',
                        'You have been logged out successfully.',
                        'Okay',
                        () => {
                            window.location.href = "index.html";
                        }
                    );
                });

            } catch (error) {
                Notiflix.Loading.remove();
                console.error("Logout error:", error);
                Notiflix.Notify.failure("An error occurred during logout. Please try again.", {
                    position: 'center-top'
                });
            }
        },
    );
}
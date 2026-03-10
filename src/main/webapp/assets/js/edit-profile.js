
function loadLoggedUserProfile() {

    const userStr = sessionStorage.getItem("loggedUser");
    if (!userStr) return;

    const user = JSON.parse(userStr);

    console.log("Loaded user profile:", user);
    const avatarEl = document.getElementById("userAvatar");
    if (avatarEl) {
        const initials =
            (user.firstName?.charAt(0) || "") +
            (user.lastName?.charAt(0) || "");
        avatarEl.textContent = initials.toUpperCase();
    }
    document.getElementById("ep-role").textContent = user.roleName;
    document.getElementById("ep-dept").textContent = user.deptName;
    document.getElementById("ep-fullName").value = user.firstName + " " + user.lastName;
    document.getElementById("ep-username").value = user.userName;

}

function initChangePassword() {
    const btn = document.getElementById("btn-change-password");
    const newContainer = document.getElementById("new-password-container");

    if (!btn) return;

    btn.addEventListener("click", () => {
        const userStr = sessionStorage.getItem("loggedUser");
        if (!userStr) return;

        const user = JSON.parse(userStr);
        const currentInput = document.getElementById("current-password");

        if (!currentInput.value){
            Notiflix.Notify.warning("Please enter your current password", {
                position: "center-top"
            });
            return;
        } else if (currentInput.value !== user.password) {
            Notiflix.Report.failure("Current password is incorrect", "Please try again", "OK");
            return;

        } else {
            newContainer.innerHTML = `
                <div class="mt-6">
                <h4 class="font-bold mb-2">New Password</h4>
                <input id="new-password"
                       class="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 
                              dark:border-slate-700 rounded-lg px-4 py-3"
                       type="password"
                       placeholder="Enter new password"/>
            </div>

            <div class="mt-4">
                <h4 class="font-bold mb-2">Confirm Password</h4>
                <input id="confirm-password"
                       class="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 
                              dark:border-slate-700 rounded-lg px-4 py-3"
                       type="password"
                       placeholder="Confirm new password"/>
            </div>
            `;
            Notiflix.Notify.success("Current password verified. Please enter your new password.", {
                position: "center-top"
            });
        }
    });
}

function initUpdateProfile() {
    const updateBtn = document.getElementById("update-profile");
    if(!updateBtn) return;

    updateBtn.addEventListener("click", () => {
        const user = JSON.parse(sessionStorage.getItem("loggedUser"));
        if (!user) return;

        const username = document.getElementById("ep-username").value.trim();

        const newPasswordInput = document.getElementById("new-password");
        const confirmPasswordInput = document.getElementById("confirm-password");

        let passwordToUpdate = user.password; // Default to current password if not changing

        // If user is changing password, validate new password fields
        if (newPasswordInput && confirmPasswordInput) {
            const newPassword = newPasswordInput.value.trim();
            const confirmPassword = confirmPasswordInput.value.trim();

            if(!newPassword || !confirmPassword) {
                Notiflix.Notify.warning("All fields are required.", {
                    position: "center-top"
                });
                return;
            }  else if(newPassword.length < 6) {
                Notiflix.Notify.warning("Password must be at least 6 characters long.", {
                    position: "center-top"
                });
                return;
            } else if(newPassword !== confirmPassword) {
                Notiflix.Notify.failure("Password do not match.", {
                    position: "center-top"
                });
                return;
            } else {
                passwordToUpdate = newPassword;
            }
        }

        // Ask for Secret-code
        Notiflix.Confirm.prompt(
            "Security Verification",
            "Enter your role Register Code to confirm profile update:",
            "",
            "Verify",
            "cancel",
            async function okCb(secretCode) {
                if(!secretCode) {
                    Notiflix.Notify.warning("Secret code is required for verification.", {
                        position: "center-top"
                    });
                    return;
                }

                try {
                    Notiflix.Loading.dots("Updating profile...", {
                        clickToClose: false,
                        svgColor: '#0284c7'
                    });

                    const response = await fetch("api/auth/update", {
                        method: "PUT",
                        headers: {
                            "content-type": "application/json",
                            "X-SECRET-CODE": secretCode
                        },
                        body: JSON.stringify({
                            userId: user.userId,
                            userName: username,
                            password: passwordToUpdate
                        })
                    });

                    const result = await response.json();
                    Notiflix.Loading.remove();

                    if (result.success) {
                        // Update session storage with new user data
                        user.userName = username;
                        user.password = passwordToUpdate;
                        sessionStorage.setItem("loggedUser", JSON.stringify(user));

                        Notiflix.Report.success("Profile Updated", "Your profile has been updated successfully.", "OK");

                    } else {
                        Notiflix.Report.failure("Update Failed", result.message || "Failed to update profile. Please try again.", "OK");
                    }

                } catch (error) {
                    Notiflix.Loading.remove();
                    Notiflix.Report.failure("Error", "An error occurred while updating profile. Please try again later.", "OK");
                    console.error("Profile update error:", error);
                }
            }
        );

    });
}
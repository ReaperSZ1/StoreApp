document.addEventListener("DOMContentLoaded", function () {
    const body = document.body;
    const modalSignUp = document.getElementById("modalSignUp");
    const modalLogin = document.getElementById("modalLogin");
    const openSignUp = document.getElementById("openSignUp");
    const openLogin = document.getElementById("openLogin");
    const accountOpenLog = document.getElementById("accountOpenLogin");
    const closeSignUpBtn = document.getElementById("closeSignUpBtn");
    const closeLoginBtn = document.getElementById("closeLoginBtn");

    function openModal(modal) {
        modal.classList.remove("invisible", "opacity-0");
        modal.classList.add("visible", "opacity-100");
        body.classList.add("overflow-hidden");
    }

    function closeModal(modal) {
        modal.classList.remove("opacity-100");
        modal.classList.add("opacity-0");
    
        setTimeout(() => {
            modal.classList.add("invisible");
            modal.classList.remove("visible");
            body.classList.remove("overflow-hidden");
        }, 300); 
    }
    

    function switchToLogin() {
        closeModal(modalSignUp);
        openModal(modalLogin);
    }

    openSignUp.addEventListener("click", () => openModal(modalSignUp));
    openLogin.addEventListener("click", () => openModal(modalLogin));
    accountOpenLog.addEventListener("click", switchToLogin);

    closeSignUpBtn.addEventListener("click", () => closeModal(modalSignUp));
    closeLoginBtn.addEventListener("click", () => closeModal(modalLogin));

    // Fecha o modal clicando fora
    document.addEventListener("click", function (event) {
        if (event.target === modalSignUp) closeModal(modalSignUp);
        if (event.target === modalLogin) closeModal(modalLogin);
    });
});

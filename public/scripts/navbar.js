document.addEventListener("DOMContentLoaded", () => {
    fetch("./resources/navbar.html") // Ensure correct path
        .then((response) => response.text()) // Fix typo
        .then((data) => {
            document.getElementById("navbar").innerHTML = data;

            // Add event listeners to buttons after navbar is loaded
            document.querySelector(".nav-home").addEventListener("click", () => {
                window.location.href = "../index.html";
            });
            document.querySelector(".nav-events").addEventListener("click", () => {
                window.location.href = "../events.html";
            });
            document.querySelector(".nav-contact").addEventListener("click", () => {
                window.location.href = "../contact.html";
            });
        })
        .catch((error) => console.error("Error loading navbar:", error));
});
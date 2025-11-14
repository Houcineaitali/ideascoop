document.addEventListener("DOMContentLoaded", () => {
    console.log("JS Loaded");

    // Handle all buttons automatically
    const buttons = document.querySelectorAll("button, .btn");

    buttons.forEach(btn => {
        btn.addEventListener("click", function (e) {
            e.preventDefault();
            alert("Button clicked: " + this.innerText);
        });
    });
});

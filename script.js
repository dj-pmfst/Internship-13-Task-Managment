(function () {
    const darkEnabled = localStorage.getItem("darkMode") === "enabled";
    const darkSheet = document.getElementById("dark-mode-stylesheet");

    if (darkSheet) {
        darkSheet.disabled = !darkEnabled;
    }
})();


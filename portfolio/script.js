
fetch("../elements/navbar-art74.html")
    .then(response => response.text())
    .then(data => {
        document.getElementById("navbar-art74").innerHTML = data;

        const links = document.querySelectorAll(".nav a");

        const currentPage = window.location.pathname.split("/").pop() || "index.html";
        links.forEach(link => {
            let linkPage = link.getAttribute("href");

            // Normalize paths (important!)
            linkPage = linkPage.split("/").pop();

            if (linkPage === currentPage) {
                link.classList.add("active");
            }
        });
    });

fetch("/portfolio/elements/navbar-main.html")
    .then(response => response.text())
    .then(data => {
        document.getElementById("navbar-main").innerHTML = data;

        const links = document.querySelectorAll(".nav a");

        const currentPage = window.location.pathname.split("/").pop() || "index.html";
        links.forEach(link => {
            let linkPage = link.getAttribute("href");

            // Normalize paths (important!)
            linkPage = linkPage.split("/").pop();

            if (linkPage === currentPage) {
                link.classList.add("active");
            }
        });
    });


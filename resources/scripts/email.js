document.getElementById("contactForm").addEventListener("submit",async function(event){
    event.preventDefault();
    const formData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        message: document.getElementById("message").value
    };
    const response = await fetch("https://your-worker-name.workers.dev/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
    });
    const result = await response.text();
    document.getElementById("responseMessage").innerText = result;
});
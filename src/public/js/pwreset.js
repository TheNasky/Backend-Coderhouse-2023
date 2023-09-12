// ...

resetForm.addEventListener("submit", async (e) => {
   e.preventDefault();

   const newPassword = document.getElementById("newPassword").value;
   const confirmPassword = document.getElementById("confirmPassword").value;

   const urlParams = new URLSearchParams(window.location.search);
   const token = urlParams.get("token");

   if (newPassword !== confirmPassword) {
      alert("Passwords do not match. Please try again.");
      return;
   }

   try {
      const response = await fetch(`/auth/pwreset?token=${token}`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({ password: newPassword }), // Include the password in the request body
      });

      if (response.ok) {
         window.location.href = "/auth/pwresetsuccess";
      } else {
         const data = await response.json();
         alert(data.error || "Password reset failed.");
      }
   } catch (error) {
      console.error("Password reset failed:", error);
      alert("Password reset failed. Please try again later.");
   }
});

// ...

const socket = io();
socket.on("refresh", () => {
  location.reload();
});
let userEmail = localStorage.getItem('userEmail');

async function EmailAddressAlert() {
  const { value: email, dismiss: action } = await Swal.fire({
    title: "Enter your email",
    input: "text",
    inputLabel: "Your email",
    inputValue: userEmail || "",
    showCancelButton: true,
    inputValidator: (value) => {
      if (!value) {
        return "Please type your email address!";
      }
      if (!validateEmail(value)) {
        return "Please enter a valid email address!";
      }
    },
  });

  if (action !== Swal.DismissReason.cancel && email) {
    localStorage.setItem("userEmail", email);
    userEmail = email;
    updateWelcomeMessage();
  }
}


function updateWelcomeMessage() {
  const welcomeMessage = document.getElementById("welcome-message");
  const username = userEmail.split("@")[0];
  welcomeMessage.innerText = `Welcome, ${username}!`;
}

function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

if (!userEmail) {
  EmailAddressAlert();
} else {
  updateWelcomeMessage();
}

const chatBox = document.getElementById("chat-box");
const sendButton = document.getElementById("send-button");

function sendMessage() {
  const data = {
    user: userEmail,
    message: chatBox.value,
  };

  fetch("/api/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  chatBox.value = "";
}

chatBox.addEventListener("keyup", ({ key }) => {
  if (!userEmail && key == "Enter") {
    EmailAddressAlert();
  } else if (key == "Enter") {
    sendMessage();
  }
});

sendButton.addEventListener("click", () => {
  sendMessage();
});

const changeEmailButton = document.getElementById('change-email');
changeEmailButton.addEventListener('click', () => {
  localStorage.removeItem('userEmail');
  userEmail = '';
  EmailAddressAlert();
});

window.addEventListener('DOMContentLoaded', (event) => {
  const messagesContainer = document.querySelector('.messages-container');
  messagesContainer.scrollTop = messagesContainer.scrollHeight; 

  chatBox.focus();
});
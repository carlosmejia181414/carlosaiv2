import user from "./assets/user.png";
import bot from "./assets/robot.gif";


const form = document.querySelector("form");
const chatContainer = document.querySelector("#chat_container");

let loadInterval;

function loader(element) {
  element.textContent = "";

  loadInterval = setInterval(() => {
    element.textContent += ".";
    if (element.textContent === ".....") {
      element.textContent = "";
    }
  }, 300);
}

function typeText(element, text) {
  let index = 0;

  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 20);
}

function generateUniqueID() {
  const timestamp = Date.now();
  const ramdomNumber = Math.random();
  const hexadecimalString = ramdomNumber.toString(16);
  return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueID) {
  return (`
    <div class="wrapper ${isAi && "ai"}">
    <div class="chat">

    <div class="profile">
    <img src=${isAi ? bot : user} alt="${isAi ? "bot" : "user"}" />
    </div>

    <div class="message" id=${uniqueID}>${value}</div>

    </div>
    </div>
    `)
}

const handleSubmit = async (e) => {
  e.preventDefault();
  const data = new FormData(form);

  //user's chatstripe
  chatContainer.innerHTML += chatStripe(false, data.get("prompt"));

  form.reset();

  //bot chatstripe
  const uniqueID = generateUniqueID();
  chatContainer.innerHTML += chatStripe(true," ", uniqueID)

  chatContainer.scrollTop = chatContainer.scrollHeight;
  const messageDiv = document.getElementById(uniqueID);
  loader(messageDiv);

  //fetch data from server
  const response = await fetch('https://carlosai.onrender.com/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: data.get('prompt')
    })

  })

  clearInterval(loadInterval);
  messageDiv.innerHTML = '';

  if(response.ok){
    const data = await response.json();
    const parseData = data.bot.trim();

    typeText(messageDiv, parseData);
  } else {
    const err = await response.text();
    messageDiv.innerHTML = "Something went wrong..."
    console.log(err);
  }
};

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e)=> {
  if(e.keyCode === 13){
    handleSubmit(e);
  }
})

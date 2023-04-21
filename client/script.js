import bot from '/assets/bot.svg';
import user from "/assets/user.svg";

//create variable
const form = document.querySelector('form');
const  chatContainer = document.querySelector('#chat_container');

let loadInterval;

//create function thats going to load our msg
function loader(element) {
  element.textContent = '';

  //fun with call back
  loadInterval = setInterval(() => {
    element.textContent += '.';

    // dots set
    if(element.textContent === "....") {  //textcontent - think ai .... again 4 dot .... and textcontext ai think ........ something
      element.textContent = '';
    }
  }, 300)
}

//create another function  with 2 parameters
function typeText(element, text) {
  let index = 0;

  let interval = setInterval(() => {
    if(index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else{
      clearInterval(interval);
    }
  }, 20)

}

//create fun to generate new id
function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}

//for chat stripe (`` template)
function chatStripe (isAi, value, uniqueId) {
 return (
  ` 
    <div class="wrapper ${isAi && 'ai'}">
     <div class="chat">
      <div class="profile">
        <img
         src="${isAi ? bot : user}"
         alt="${isAi ? bot : user}"
        /> 
       </div>
        <div class="message" id=${uniqueId}>${value}</div>
      </div>
     </div>   
  `
 )
}

//creante const handle submit fun
const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData(form);

  //user's chat container
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));

  form.reset();

  //bot's chatstripe
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);

  loader(messageDiv);

  //fetch data from server -> bot's response

  const response = await fetch('http://localhost:5000', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: data.get('prompt') //this is text on screen
    })
  })

  clearInterval(loadInterval);
  messageDiv.innerHTML = '';

  //res for backend  401 error means unauthorised
  if(response.ok) {
    const data = await response.json();
    //if need to parse 
    const parsedData = data.bot.trim();

    typeText(messageDiv, parsedData);
  } else {
    const err = await response.text(); // if error
// set the msg
    messageDiv.innerHTML = "Something went wrong";

    alert(err);
  }
}

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
  if(e.keyCode === 13) {
    handleSubmit(e);
  }
})






// This code is creating a chatbot.
// It imports two images, one for the user and one for the bot. 
// It then creates a variable and a function to load messages. It also creates a function to type text, 
// a function to generate unique IDs, and a chat stripe template. Finally, it creates an event listener for 
// the form submit and keyup events that calls the handleSubmit function when triggered. This handleSubmit 
// function sends data to the server, clears any loading intervals, sets the message div's inner HTML to an 
// empty string, checks if the response is ok, parses any data if needed, and then calls the typeText function 
// with the message div and parsed data as parameters.

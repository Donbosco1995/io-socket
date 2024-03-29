const socket = io('https://io-socket.onrender.com');

const msgInput = document.querySelector("#message");
const nameInput = document.querySelector("#name");
const cahtroom = document.querySelector("#room");
const activity = document.querySelector(".activity");
const usersList = document.querySelector(".user-list");
const roomList = document.querySelector(".room-list");
const chatDisplay = document.querySelector(".chat-display");

function sendMessage(e) {
  e.preventDefault();
  if (nameInput.value && msgInput.value && chatRoom.value) {
    socket.emit("message", {
      name: nameInput.value,
      text: msgInput.value,
    });
    msgInput.value = "";
  }
  msgInput.focus();
}

function enterRoom(e) {
  e.preventDefault();
  if (nameInput.value && chatRoom.value) {
    socket.emit("message", {
      name: nameInput.value,
      text: msgInput.value,
    });
  }
}

document.querySelector(".form-msg").addEventListener("submit", sendMessage);

// document.querySelector(".form-msg").addEventListener("submit", enterRoom);

msgInput.addEventListener("keypress", () => {
  socket.emit("activity", nameInput.value);
});

socket.on("message", (data) => {
  activity.textContent = "";
  const { name, text, time } = data;
  const li = document.createElement("li");
  li.className = "post";
  if (name === nameInput.value) li.className = "post post--left";
  if (name !== nameInput.value && name !== "Admin")
    li.className = "post post--right";
  if (name !== "Admin") {
    li.innerHTML = `<div class="post__header ${
      name === nameInput.value ? "post__header--user" : "post__header--reply"
    }">
      <span class = "post__header--name">${name}</span>
      <span class = "post__header--name">${name}</span>
      </div>
      <div class = "post__text">${text}</div>`;
  } else {
    li.innerHTML = `<div class = "post__text">${text}</div>`;
  }

  document.querySelector(".chat-display").appendChild(li);

  chatDisplay.scrollTop = chatDisplay.scrollHeight;
});

let activityTimer;
socket.on("activity", (name) => {
  activity.textContent = `${name} is typing...`;

  clearTimeout(activityTimer);
  activityTimer = setTimeout(() => {
    activity.textContent = "";
  }, 4000);
});

socket.on(usersList,({ users }) => {
  showUsers(users)
})
socket.on(roomList,({ rooms }) => {
  showRooms(rooms)
})

function showUsers(users) {
  usersList.textContent = ''
  if (users) {
    usersList.innerHTML = `<em>Users in ${chatRoom.value}:</em>`
    users.forEach((user,i) => {
      usersList.textContent += `${user.name}`
      if (users.length > 1 && i !== users.length - 1) {
        usersList.textContent += ","
      }
    })
  }
}

function showRooms(rooms) {
  usersList.textContent = "";
  if (rooms) {
    usersList.innerHTML = "<em>Active Rooms:</em>";
    users.forEach((room, i) => {
      roomList.textContent += `${room}`;
      if (rooms.length > 1 && i !== rooms.length - 1) {
        roomList.textContent += ",";
      }
    });
  }
}

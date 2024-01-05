import express from "express";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __direname = path.dirname(__filename);

const PORT = process.env.PORT || 4000;
const ADMIN = "Admin";

const app = express();

app.use(express.static(path.join(__direname, "public")));

const expressServer = app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

const Userstate = {
  users: [],
  setUsers: function (newUsersArray) {
    this.users = newUsersArray;
  },
};

const io = new Server(expressServer, {
  cors: {
    orgin:
      process.env.NODE_ENV === "production"
        ? false
        : ["http:/localhst:5500", "http:/127.0.0.1:5500"],
  },
});

io.on("connection", (socket) => {
  console.log(`User ${socket.id} connected`);
  s;

  socket.emit("message", buildMsg(ADMIN, "Welcome to Chat App"));

  socket.on("enterRoom", ({ name, room }) => {
    const preRoom = getUser(socket.id)?.room;

    if (preRoom) {
      socket.leave(prevRoom);
      io.to(preRoom).emit(
        "message",
        buildMsg(ADMIN, `${name} has left the room`)
      );
    }

    const user = activateUser(socket.id, name, room);

    if (preRoom) {
      io.to(preRoom).emit("userList", {
        users: getUsersInRoom(preRoom),
      });
    }
    socket.join(user.room);

    socket.emit(
      "message",
      buildMsg(ADMIN, `You have joined the ${user.room} chat room`)
    );

    socket.broadcast
      .to(user.room)
      .emit("message", buildMsg(ADMIN, `${user.name} has joined the room`));

    io.to(user.room).emit("userList", {
      users: getUsersInRoom(user.room),
    });

    io.emit("roomsList", {
      rooms: getAllActiveRooms(),
    });
  });

  socket.on("disconnect", () => {
    const user = getUser(socket.id);
    userLeavesApp(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        buildMsg(ADMIN, `${user.name} has left the room`)
      );

      io.to(user.room).emit("userList", {
        users: getUsersInRoom(user.room),
      });

      io.emit("roomlist", {
        rooms: getAllActiveRooms(),
      });
    }
    console.log(`User ${socket.id} disconnected`);
  });

  socket.on("message", ({ name, text }) => {
    const room = getUser(socket.id)?.room;
    if (room) {
      io.to(room).emmit("message", buildMsg(name, text));
    }
  });

  socket.on("activity", (name) => {
    const room = getUser(socket.id)?.room;
    if (room) {
      socket.broadcast.to(room).emmit("activity", name);
    }
  });
});

function buildMsg(name, text) {
  return {
    name,
    text,
    time: new Intl.DateTimeFormat("default", {
      hour: "numeric",
      minutes: "numeric",
      second: "numeric",
    }).format(new Date()),
  };
}

function activateUser(id, name, room) {
  const user = { id, name, room };
  Userstate.setUsers([
    ...Userstate.users.filter((user) => user.id !== id),
    user,
  ]);
  return user;
}

function userLeavesApp(id) {
  Userstate.setUsers(Userstate.users.filter((user) => user.id !== id));
}

function getUsers(id) {
  return Userstate.users.find((user) => user.id === id);
}

function getUsersInRoom(room) {
  return Userstate.users.filter((user) => user.room === room);
}

function getAllActiveRooms() {
  return Array.from(new set(Userstate.users.map((user) => user.room)));
}

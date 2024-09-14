import express from "express";
import cors from "cors";
import ImageKit from "imagekit";
import dotenv from 'dotenv';
import mongoose from "mongoose";
import UserChats from "./models/userChats.js";
import Chat from "./models/chat.js";
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node'


dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

app.use(cors({
    origin:process.env.CLIENT_URL,
    credentials: true,
}));

app.use(express.json())

const connect = async() => {
  try {
      await mongoose.connect(process.env.MONGO)
      console.log("WOOHOO MONGO DB CONNECTED")
  } catch (err) {
      console.log(err);
  }
}

const imagekit = new ImageKit({
    urlEndpoint: process.env.IMAGE_KIT_ENDPOINT,
    publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
    privateKey: process.env.IMAGE_KIT_PRIVATE_KEY
  });

// IMAGE UPLOAD
app.get("/api/upload", (req, res) => {
  const result = imagekit.getAuthenticationParameters();
  res.send(result);
});


// const test = async() => {
//   await fetch("http://localhost:3000/api/test",{
//     credentials: "include",
//   });
// };

//AUTHENTICATE
// app.get("/api/test", ClerkExpressRequireAuth(), (req, res) => {
//   const userId = req.auth.userId;
//   console.log(userId);
//   res.send("Success!");
// })

//CREATE A NEW CHAT...

app.post("/api/chats", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;
  const { text } = req.body;
  
  try {
    const newChat =  new Chat({
      userId: userId,
      history: [{ role: "user", parts: [{ text }]}]
    });

    const savedChat = await newChat.save();

//CHECK IF THE USER CHATS EXIST...
const userChats = await UserChats.find({ userId: userId });

//IF DOESN'T EXIST CREATES A NEW CHAT AND IN CHATS ARRAY...
if (!userChats.length) {
  const newUserChats = new UserChats({
    userId: userId,
    chats: [
      {
        _id: savedChat._id,
        title: text.substring(0, 40),
      },
    ],
  });

  await newUserChats.save()
}else{
  //IF EXIST, PUSH THE CHAT TO THE EXISTING ARRAY
  await UserChats.updateOne({userId:userId},{
    $push:{
      chats:{
        _id: savedChat._id,
        title: text.substring(0, 40)
      },
    },
  });

  res.status(201).send(newChat._id)
}
  } catch (err) {
      console.log(err);
      res.status(500).send("Error creating chat!");
  }
});

//FETCH ALL CHATS OF USER BY USER ID

app.get("/api/userchats", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;
  try {
    const userChats = await UserChats.find({userId});

    res.status(200).send(userChats[0].chats);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching Userchats!");
  }
});


app.get("/api/chats/:id", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;
  try {
    const chats = await Chat.findOne({ _id: req.params.id, userId});

    res.status(200).send(chats);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching Chat!");
  }
});

app.put("/api/chats/:id", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;
  const { question, answer, img } = req.body;
  const newItems = [
    ...(question
      ? [{ role : "user", parts: [{ text : question }], ...(img && { img })}]
      : []),
      { role : "model", parts: [{ text : answer }]},
  ];
  
  try {
    const updatedChat = await Chat.updateOne(
      { _id: req.params.id, userId },
      {
        $push : {
          history: {
            $each: newItems,
          },
        },
      }
    );
    res.status(200).send(updatedChat);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error Adding Conversation!");
  }
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(401).send('Unauthenticated!')
})

app.listen(port,()=>{
    connect();
    console.log("Server running on 3000")
});
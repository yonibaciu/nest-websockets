"use client";

import { Input } from "./input";
import { io } from "socket.io-client";
import { useState, useEffect } from "react";
import { Button } from "./button";
import { Label } from "./label";

type Message = {
  name: string;
  text: string;
}

export default function Chat() {
  const [socket, setSocket] = useState(io("http://localhost:3001"));
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [joined, setJoined] = useState<boolean>(false);
  const [name, setName] = useState("");
  const [typingDisplay, setTypingDisplay] = useState("");

  useEffect(() => {
    socket.emit("findAllMessages", {}, (response: Message[]) => {
      setMessages(response);
    });

    socket.on("message", (message) => {
      setMessages(oldMessages => [...oldMessages, message]);
    });

    socket.on("typing", ({ name, isTyping }) => {
      if (isTyping) {
        setTypingDisplay(`${name} is typing...`);
      } else {
        setTypingDisplay("");
      }
    });
  }, []);

  const join = () => {
    socket.emit("join", { name: name }, () => {
      setJoined(true);
    });
  };

  const sendMessage = () => {
    socket.emit("createMessage", { text: messageText }, () => {
      setMessageText("");
    });
  };

  let timeout;
  const emitTyping = (str: string) => {
    setMessageText(str);
    socket.emit("typing", { isTyping: true });
    timeout = setTimeout(() => {
      socket.emit("typing", { isTyping: false });
    }, 2000);
  };

  return (
    <div className="flex flex-1 p-10">
      {!joined && (
        <div className="flex items-center space-x-2">
          <Input onChange={(e) => setName(e.target.value)} />
          <Button onClick={join} disabled={name == ''}>Join</Button>
        </div>
      )}
      {joined && (
        <>
          <div className="flex flex-1 justify-between flex flex-col">
            <div>
              {messages.map((message, index) => {
                return (
                  <div key={index}>
                    {message.name}: {message.text}
                  </div>
                );
              })}
            </div>

            <div>
              {typingDisplay && <div>{typingDisplay}</div>}

              <hr className="my-5" />

              <div className="flex items-center space-x-2">
                <Label>
                  Message:
                </Label>
                <Input
                  value={messageText}
                  onChange={(e) => emitTyping(e.target.value)}
                />
                <Button onClick={sendMessage} disabled={messageText == ''}>Send</Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

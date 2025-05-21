"use client";
import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RootState } from "@/store/store";
import { useSelector, useDispatch } from "react-redux";
import { setOpenState } from "@/store/slices/emailWindowSlice";
import { removeSelectedEmails } from "@/store/slices/subscriptionSlice";
import { Email } from "@/types/email";
import Image from "next/image";
import CloseButton from "./CloseButton";
import { motion, AnimatePresence } from "framer-motion";
import { Paperclip } from "lucide-react"; // Lucide icon example


function EmailWindow() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const messageRef = useRef<HTMLTextAreaElement>(null);
const [attachments, setAttachments] = useState<File[]>([]);


  const openState = useSelector(
    (state: RootState) => state.EmailWindowSlice.isOpen
  );
  const dispatch = useDispatch();

  const selectedEmails = useSelector(
    (state: RootState) => state.SubscriptionSlice.selectedEmails
  );


  // Phrases for suggestions
  const phrases = [
    "Dear Colleagues,",
    "Hello everyone,",
    "Greetings,",
    "Hi all,",
    "Hello,",
    "Dear [Name],",
    "Good day,",
    "Hi there,",
    "Dear Valued Customer,",
    "Dear Partners,",
    // ... (rest of your phrases)
    "If you require any clarification, please do not hesitate to contact me.",
  ];

  // Filter suggestions based on last word typed
  useEffect(() => {
    if (!message) {
      setSuggestions([]);
      setHighlightIndex(-1);
      return;
    }
    const words = message.split(/\s+/);
    const lastWord = words[words.length - 1].toLowerCase();

    if (lastWord.length === 0) {
      setSuggestions([]);
      setHighlightIndex(-1);
      return;
    }

    const filtered = phrases.filter((phrase) =>
      phrase.toLowerCase().startsWith(lastWord)
    );
    setSuggestions(filtered.slice(0, 5));
    setHighlightIndex(-1);
  }, [message]);

  // Refs to suggestion <li> elements
  const suggestionRefs = useRef<(HTMLLIElement | null)[]>([]);

  // Scroll to highlighted suggestion when highlightIndex changes
useEffect(() => {
  if (highlightIndex >= 0 && suggestionRefs.current[highlightIndex]) {
    suggestionRefs.current[highlightIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }
}, [highlightIndex]);


  // Keyboard navigation for suggestions
  const handleMessageKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    } else if (e.key === "Tab" || e.key === "Enter") {
      if (highlightIndex >= 0) {
        e.preventDefault();
        const words = message.split(/\s+/);
        words[words.length - 1] = suggestions[highlightIndex];
        const newMessage = words.join(" ") + " ";
        setMessage(newMessage);
        setSuggestions([]);
        setHighlightIndex(-1);
      }
    }
  };

  const closeClicked = () => {
    dispatch(setOpenState(false));
  };

const sendEmailsClicked = async () => {
  const emailIds = Array.isArray(selectedEmails)
    ? selectedEmails.map((email) => email?.id).filter(Boolean)
    : [];

  const formData = new FormData();
  formData.append("emailSubject", subject);
  formData.append("emailText", message);
  formData.append("fromName", "fname lname");

  // Convert each emailId to a string
  emailIds.forEach((id) => formData.append("emailIds[]", String(id)));

  // Attach files
  attachments.forEach((file) => {
    formData.append("attachments", file);
  });

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/email/sendEmails`,
      {
        method: "POST",
        body: formData,
        credentials:"include",
      }
    );
    if (!response.ok) {
      // Not 2xx status — read the text response for debugging
      const errorText = await response.text();
      console.error("Server error response:", errorText);
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
  } catch (e) {
    console.error(e);
  }
};



  const removeClicked = (email: Email) => {
    dispatch(removeSelectedEmails(email));
  };

  const variants = {
    hidden: {
      scale: 0,
      opacity: 0,
      originX: 1,
      originY: 1,
      x: "50%",
      y: "50%",
    },
    visible: {
      scale: 1,
      opacity: 1,
      x: 0,
      y: 0,
      originX: 1,
      originY: 1,
      transition: { type: "spring", stiffness: 300, damping: 25 },
    },
    exit: {
      scale: 0,
      opacity: 0,
      x: "50%",
      y: "50%",
      originX: 1,
      originY: 1,
      transition: { ease: "easeInOut" },
    },
  };

  return (
    <>
      <div
        className={`fixed md:hidden bottom-0 left-0 z-[99] w-12 h-12
        flex items-center justify-center rounded-full bg-red-300 border border-blue-500 m-5 
        hover:bg-red-500 shadow-xl ${
          openState ? "bg-white border-5" : ""
        } active:scale-105 transition-all duration-100`}
        onClick={() => {
          dispatch(setOpenState(!openState));
          console.log("email clickkk");
          console.log(openState);
        }}
      >
        <Image src="/envelope-plus.png" alt="email" width={30} height={30} />
      </div>
      <AnimatePresence>
        {openState && (
          <motion.div
            className="fixed bottom-0 md:w-[45vw] md:top-[11vh] right-0 z-50 flex flex-col bg-white shadow-md shadow-gray-700/80 w-full h-[calc(92vh)] md:h-full"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
          >
            <div className="justify-between w-full flex p-[2vh] items-center">
              <div className="flex items-center">
                <Image
                  src="/envelope-plus.png"
                  alt="email icon"
                  width={30}
                  height={30}
                />
                <h1 className="text-lg font-medium">Send Email</h1>
              </div>
              <CloseButton onClick={closeClicked} />
            </div>
            <div className="overflow-x-auto overflow-y-clip whitespace-nowrap gap-2 h-15 touch-auto flex">
              {selectedEmails.map((email, index) => (
                <div
                  key={index}
                  className="bg-slate-500 rounded-3xl m-1 p-2 flex items-center justify-center"
                >
                  {email.email}
                  <p
                    className="mx-2 hover:cursor-pointer hover:bg-white rounded-full"
                    onClick={() => removeClicked(email)}
                  >
                    X
                  </p>
                </div>
              ))}
            </div>
            <Input
              placeholder="Subject..."
              className="border-1 border-black rounded-none"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <div style={{ position: "relative" }}>
              <Textarea
                ref={messageRef}
                placeholder="Message..."
                className="border-1 border-black flex-1 rounded-none"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleMessageKeyDown}
                spellCheck={false}
                rows={6}
              />
              {/* Suggestion box */}
              {suggestions.length > 0 && (
                <ul
                  style={{
                    position: "absolute",
                    bottom: "100%",
                    right: 0,
                    backgroundColor: "white",
                    border: "1px solid #ccc",
                    borderRadius: 4,
                    marginBottom: 4,
                    maxHeight: 120,
                    overflowY: "auto",
                    width: "100%",
                    zIndex: 1000,
                    listStyle: "none",
                    padding: "4px 8px",
                  }}
                >
                  {suggestions.map((s, i) => (
                    <li
                      key={s}
                      ref={(el) => {
                        suggestionRefs.current[i] = el; // no return here!
                      }}
                      style={{
                        padding: "4px 8px",
                        backgroundColor:
                          i === highlightIndex ? "#bde4ff" : "transparent",
                        cursor: "pointer",
                      }}
                      onMouseEnter={() => setHighlightIndex(i)}
                      onMouseDown={(e) => {
                        e.preventDefault(); // prevent blur
                        const words = message.split(/\s+/);
                        words[words.length - 1] = s;
                        setMessage(words.join(" ") + " ");
                        setSuggestions([]);
                        setHighlightIndex(-1);
                        messageRef.current?.focus();
                      }}
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              )}
              <div className="fixed bottom-0 right-0 flex flex-col gap-10">
                <div className="flex">
                  Attachments:
                  {attachments.length > 0 && (
                    <ul className="text-sm text-gray-600">
                      {attachments.map((file, i) => (
                        <li key={i}>{file.name}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="flex gap-10">
                  <div className="mt-2 flex items-center gap-2">
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer p-2 bg-blue-200 hover:bg-gray-300 rounded-full"
                      title="Attach files"
                    >
                      <Paperclip className="w-5 h-5 text-gray-700" />
                    </label>
                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      onChange={(e) => {
                        if (e.target.files) {
                          setAttachments(Array.from(e.target.files));
                        }
                      }}
                      className="hidden"
                    />
                  </div>
                  <div
                    className=" bg-blue-500 rounded-full p-2 cursor-pointer select-none"
                    onClick={sendEmailsClicked}
                  >
                    SEND
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default EmailWindow;

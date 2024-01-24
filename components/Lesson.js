"use client"
import React, { useEffect, useState } from "react"
import { deleteLesson } from "@/libs/deleteLesson"
import { toast } from "react-hot-toast"
import { MdCancel } from "react-icons/md"
import { Rings, SpinningCircles } from "react-loading-icons"
import BottomDivWithForm from "./AddLesson"

const Lesson = ({ title, content, date, postId }) => {
  const [lessonOpen, setLessonOpen] = useState(false)
  const [explanationOpen, setExplanationOpen] = useState(false)
  const [quizOpen, setQuizOpen] = useState(false)
  const [explanation, setExplanation] = useState("")
  const [quiz, setQuiz] = useState("")
  // const [notesSet, setNotesSet] = useState(false)

  useEffect(() => {
    if (explanationOpen) {
      fetchExplanation(title)
    }
  }, [explanationOpen])

  useEffect(() => {
    if (quizOpen) {
      fetchQuiz(title)
    }
  }, [quizOpen])

  const handleSetNotesClick = async () => {
    // Perform backend operation to set notes (replace this with your actual backend logic)
    try {
      // Example: send a request to your backend API
      const response = await fetch("/api/setNotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId, explanation }),
      })

      if (response.ok) {
        toast.success("Notes set successfully. Refresh the page.")
        // setNotesSet(true)
      } else {
        toast.error("Failed to set notes")
        console.error("Failed to set notes on the backend")
      }
    } catch (error) {
      toast.error("Error setting notes")
      console.error("Error setting notes on the backend", error)
    }
  }

  const fetchExplanation = async (title) => {
    setExplanation("Loading...")
    try {
      const response = await fetch("/api/openai/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      })

      if (response.ok) {
        const data = await response.json()
        // console.log({ data })
        setExplanation(data.response.choices[0].message.content)
        // setNotesSet(true)
      } else {
        setExplanation("Error")
        console.error("Failed to fetch quiz")
      }
    } catch (error) {
      setExplanation("Error")
      console.error("Error fetching quiz")
    }
  }
  const fetchQuiz = async (title) => {
    setQuiz("Loading...")

    try {
      const response = await fetch("/api/openai/quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, explanation }),
      })

      if (response.ok) {
        const data = await response.json()
        // console.log({ data })
        setQuiz(data.response.choices[0].message.content)
        console.log({ quiz: data.response.choices[0].message.content })
      } else {
        setQuiz("Error")
        console.error("Failed to fetch quiz")
      }
    } catch (error) {
      setQuiz("Error")
      console.error("Error fetching quiz")
    }
  }
  const handleLessonClick = () => {
    setLessonOpen(true)
  }

  const handleCloseClick = () => {
    setLessonOpen(false)
    setExplanationOpen(false)
    setQuizOpen(false)
  }

  const handleExplainClick = () => {
    setExplanationOpen(!explanationOpen)
  }

  const handleQuizMeClick = () => {
    setQuizOpen(!quizOpen)
  }

  const handleDeleteClick = async () => {
    deleteLesson(postId)
    toast.error("Lesson deleted")
    setLessonOpen(false)
    setExplanationOpen(false)
    setQuizOpen(false)
    setTimeout(() => {
      window.location.reload()
    }, 200)
  }

  return (
    <div>
      <div
        onClick={handleLessonClick}
        className="w-56 h-48 bg-overcast ml-8 p-3 py-6 pb-4 pt-1 relative rounded-md hover:cursor-pointer hover:bg-ice duration-300 transition shadow group hover:drop-shadow-xl clickable-lesson mt-8"
      >
        <h1 className="text-lg transition group-hover:text-overcast overflow-hidden overflow-ellipsis">
          {title}
        </h1>
        <p className="text-gray-400 transition-opacity group-hover:text-glacierBlue text-clip line-clamp-5">
          {content}
        </p>
        <p className="text-gray-400 absolute text-sm bottom-0 right-0 mr-2">
          {date}
        </p>
      </div>

      {lessonOpen && (
        <div
          onClick={handleCloseClick}
          className="fixed top-0 left-0 w-full h-full overflow-y-scroll flex pt-24 pb-8 items-center justify-center bg-black bg-opacity-50 z-10"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-2 rounded shadow-lg w-3/5 mx-auto relative animate-jump-in animate-delay-0 animate-once animate-duration-300"
          >
            <button
              onClick={handleCloseClick}
              className="bg-white text-white rounded relative top-0 left-0 mt-2 mr-0 mr-2 flex items-center transition hover:bg-gray-200"
            >
              <span className="text-2xl font-bold text-red-500">
                <MdCancel size={40} />
              </span>
            </button>
            {quizOpen ? null : (
              <h2 className="text-2xl font-bold mt-4 p-6 pt-0 text-glacierBlue">
                {title}
              </h2>
            )}
            {quizOpen ? null : (
              <p className="ml-6 mb-6 break-words">{content}</p>
            )}

            {!quizOpen && explanationOpen && (
              <div className="bg-gray-100 p-4 mt-4 rounded mb-2 animate-flip-down">
                <p className="text-lg font-bold text-glacierBlue">
                  {explanation}
                </p>
                <button
                  onClick={handleSetNotesClick}
                  className="bg-blue-500 text-white px-4 py-2 rounded mt-2 flex items-center transition hover:bg-blue-600"
                >
                  <span className="text-lg font-bold">Set as Notes</span>
                </button>
              </div>
            )}

            {quizOpen && (
              <div className="bg-yellow-200 p-4 mt-4 rounded mb-2 animate-flip-down overflow-scroll">
                <pre className="text-lg font-bold text-yellow-800 text-wrap">
                  {quiz}
                </pre>
              </div>
            )}

            <div className="flex justify-between">
              <div className="flex gap-2">
                <button
                  onClick={handleQuizMeClick}
                  className={`${
                    quizOpen ? "bg-yellow-500" : "bg-blue-500"
                  } text-white px-4 py-2 rounded flex items-center transition ${
                    quizOpen ? "hover:bg-yellow-600" : "hover:bg-blue-600"
                  }`}
                >
                  <span className="text-lg font-bold">
                    {quizOpen ? "Hide Quiz" : "Quiz me"}
                  </span>
                </button>

                <button
                  onClick={handleExplainClick}
                  className="bg-green-500 text-white px-4 py-2 rounded flex items-center transition hover:bg-green-600"
                >
                  <span className="text-lg font-bold">
                    {explanationOpen ? "Hide Explanation" : "AI Explaination"}
                  </span>
                </button>
              </div>

              <button
                onClick={handleDeleteClick}
                className="bg-red-500 text-white px-4 py-2 rounded flex items-center transition hover:bg-red-600"
              >
                <span className="text-lg font-bold">Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Lesson

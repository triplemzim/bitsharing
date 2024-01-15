/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import * as util from "./lib/util";
import Axios from "./lib/axios";
import { useAtom } from "jotai";
import * as atomic from "./lib/atom";


function BitLoader({ code, setCode, loadBit }) {
  return (
    <div className="flex pt-4 pb-2 space-x-2">
      <Input
        autoFocus
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter a new code"
        className="flex-1 bg-gray-800 p-2 rounded-lg mr-2 text-white outline-none"
      />
      <Button variant="secondary" onClick={loadBit}>
        Find or Create
      </Button>
    </div>
  );
}

// A component to render a single todo item
const TodoItem = ({ todo, toggleCompleted, deleteTodo }) => {
  return (
    <li className="flex items-center justify-between bg-cyan-900 rounded-full pl-4 mb-2">
      <div className="flex items-center">
        <Checkbox
          // type="checkbox"
          checked={todo.marked}
          onCheckedChange={() => toggleCompleted(todo.id)}
          className="h-5 w-5 mr-4 bg-neutral-400"
        />
        <span
          className={`text-lg ${
            todo.marked ? "line-through text-gray-400" : "text-white"
          }`}
        >
          {todo.content}
        </span>
      </div>
      <Button
        onClick={() => deleteTodo(todo.id)}
        className="text-red-400 hover:text-red-700 bg-transparent"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </Button>
    </li>
  );
};

// A component to render the pagination buttons
const Pagination = ({ next, prev, currentCount, count, loadContent }) => {
  return (
    <div className="flex items-center justify-center mt-4">
      <Button
        onClick={() => loadContent(prev)}
        className="bg-gray-800 px-4 py-2 rounded-lg mr-2 hover:bg-gray-700"
        disabled={util.isNullOrUndefined(prev)}
      >
        Prev
      </Button>
      <span className="text-white">
        {`Showing ${currentCount} out of ${count}`}
      </span>
      <Button
        onClick={() => loadContent(next)}
        className="bg-gray-800 px-4 py-2 rounded-lg ml-2 hover:bg-gray-700"
        disabled={util.isNullOrUndefined(next)}
      >
        Next
      </Button>
    </div>
  );
};

// The main component to render the todo app
const TodoApp = () => {
  const axios = new Axios();
  const [todos, setTodos] = useState([]); // Get todos from local storage or use an empty array
  const [title, setTitle] = useState(""); // The title of the new todo
  const [bit, setBit] = useState({});
  const [content, setContent] = useState([]); // The title of the new todo
  const [code, setCode] = useAtom(atomic.code);
  const [nextUrl, setNextUrl] = useState("");
  const [prevUrl, setPrevUrl] = useState("");
  const [entry, setEntry] = useState("");
  const [count, setCount] = useState(0);
  const [lastHitContentUrl, setLastHitContentUrl] = useState('');
  const entryInputRef = useRef(null);


  // A function to add a new todo
  const addTodo = (e) => {
    e.preventDefault();
    if (entry.trim()) {
      const newTodo = {
        content: entry,
        marked: false,
        bits: bit.id,
      };

      const options = {
        url: util.postContentURL(),
        data: newTodo,
      };

      axios
        .post(options)
        .then((res) => {
          loadContent(util.getContentByBitURL(bit.id));
          setEntry('');
          entryInputRef.current.focus();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };


  // A function to toggle the completed status of a todo
  const toggleCompleted = (id) => {
    const value = content.filter((todo) => todo.id === id)[0]?.marked;
    setContent(
      content.map((todo) =>
        todo.id === id ? { ...todo, marked: !todo.marked } : todo
      )
    );
    const url = util.patchContentURL(id);
    const options = {
      url: url,
      data: {
        id: id,
        marked: !value,
      },
    };
    axios
      .patch(options)
      .catch((err) => console.log(err));
  };

  const addTitle = () => {
    if (title.trim()) {
      const options = {
        url: util.patchBitURL(bit.id),
        data: {
          id: bit.id,
          title: title,
        },
      };
      axios
        .patch(options)
        .catch((err) => console.log(err));
    }
  };

  // A function to delete a todo
  const deleteTodo = (id) => {
    setContent(content.filter((todo) => todo.id !== id));
    const url = util.patchContentURL(id);
    axios.delete({ url: url }).then(res => loadContent(lastHitContentUrl));
  };

  const loadContent = (url) => {
    if (util.isNullOrUndefined(url)) {
      return;
    }
    axios
      .get({ url: url })
      .then((res) => {
        setLastHitContentUrl(url);
        setContent(res.results);
        setNextUrl(res.next);
        setPrevUrl(res.previous);
        setCount(res.count);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  };

  useEffect(() => {
    if (!util.isNullOrUndefined(bit.id) && bit.id !== 0) {
      const url = util.getContentByBitURL(bit.id);
      loadContent(url);
    }
  }, [bit]);

  const loadBit = () => {
    if (util.isNullOrUndefined(code) || code == "") {
      return;
    }
    const url = util.getBitsByCodeURL(code);

    axios
      .get({ url: url })
      .then((res) => {
        if (
          !util.isNullOrUndefined(res.results) &&
          !util.isNullOrUndefined(res.results[0])
        ) {
          setBit(res.results[0]);
          let temp = res.results[0].title;
          temp = util.isNullOrUndefined(temp) ? '' : temp;
          setTitle(temp);
        }
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  };

  return (
    <div className="container mx-auto max-w-md p-4">
      <h1 className="text-4xl text-white text-center font-bold mb-4">Bit Sharing</h1>
      <div>
        <BitLoader code={code} setCode={setCode} loadBit={loadBit} />
      </div>
      (
      {!util.isNullOrUndefined(bit.id) && (
        <div>
          <div className="mb-4">
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={addTitle}
              placeholder="Enter a Title"
              className="flex-1 bg-inherit p-2 text-3xl border-none text-white outline-none border-0"
            />
          </div>
          <form onSubmit={addTodo} className="flex items-center mb-4 space-x-2">
            <Input
              type="text"
              ref={entryInputRef}
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              placeholder="Enter a new task"
              className="flex-1 bg-gray-800 p-2 rounded-lg mr-2 text-white outline-none"
            />
            <Button
              type="submit"
              variant="secondary"
              // className="ghost"
            >
              Add
            </Button>
          </form>
          <ul>
            {content.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                toggleCompleted={toggleCompleted}
                deleteTodo={deleteTodo}
              />
            ))}
          </ul>
          {(!util.isNullOrUndefined(nextUrl) ||
            !util.isNullOrUndefined(prevUrl)) && ( // Only show pagination if there are more than 5 items
            <Pagination
              next={nextUrl}
              prev={prevUrl}
              currentCount={content.length}
              count={count}
              loadContent={loadContent}
            />
          )}
        </div>
      )}
      )
    </div>
  );
};

export default TodoApp;

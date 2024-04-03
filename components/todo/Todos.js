import React from "react";
import TodoItem from "./TodoItem";
import { useState, useEffect } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import TodoFilter from "./TodoFilter";

function Todos() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("todos"));
    if (items) {
      setTodos(items);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const completeTodo = (index) => {
    const newTodos = [...todos];
    newTodos[index].completed = !newTodos[index].completed;
    setTodos(newTodos);
  };
  const addTodo = (text) => {
    const newTodos = [
      {
        title: text,
        completed: false,
        id: Math.random().toString(36).slice(2, 7),
      },
      ...todos,
    ];
    setTodos(newTodos);
  };

  const deleteTodo = (index) => {
    const newTodos = [...todos];
    newTodos.splice(index, 1);
    setTodos(newTodos);
  };

  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed));
  };

  const onDragEnd = (result) => {
    const { destination, source } = result;
    if (!destination) {
      return;
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const items = Array.from(todos);
    const [reorderedItem] = items.splice(source.index, 1);
    items.splice(destination.index, 0, reorderedItem);

    setTodos(items);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (!input.trim()) {
      return;
    }
    addTodo(input);
    setInput("");
  };

  return (
    <div className="flex flex-col mt-20 max-w-[500px] w-full md:px-6  z-50">
      <header className="flex justify-between items-center py-5">
        <div>
          <h1 className=" text-4xl font-bold text-primary"> Tasks To Do</h1>
        </div>
       
      </header>
      <form
        onSubmit={submitHandler}
        className="flex items-center mb-14"
      >
        {/* <div className="w-6 h-6 absolute ml-5 border  rounded-full z-10 border-[#393a4d] text-[#4d5066]" /> */}
        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
          type="text"
          className=" w-full md:p-4 md:pl-16 p-3 text-base rounded-xl focus:outline-none  bg-bgs text-textc placeholder:text-[#9293a4] "
          placeholder="Create a new task todo"
        />
            <button className=' bg-[#fff] text-black text-md font-semibold md:p-4 p-3  px-8 mx-2  active:scale-90 duration-300 rounded-xl ' onClick={submitHandler} > save</button>
      </form>

      {todos.length ? (
        <>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="characters">
              {(provided) => (
                <ul
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="shadow-xl"
                >
                  {todos
                    .filter((t) => {
                      if (filterStatus === "all") return t;
                      else if (filterStatus === "active")
                        return t.completed === false;
                      else if (filterStatus === "completed")
                        return t.completed === true;
                    })
                    .map((todo, index) => (
                      <TodoItem
                        key={todo.id}
                        index={index}
                        todo={todo}
                        completeTodo={completeTodo}
                        deleteTodo={deleteTodo}
                      />
                    ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
          <TodoFilter
            todos={todos}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            clearCompleted={clearCompleted}
          />
          <div className="text-sm text-center my-16  text-[#777b93]">
            Drag and drop to change order
          </div>
        </>
      ) : (
        <div className="p-8   bg-bgs rounded-md text-center text-[#9293a4] shadow-md">
          No Todos! Add one
        </div>
      )}
    </div>
  );
}

export default Todos;

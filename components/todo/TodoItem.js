import React from "react";
// import IconCheck from "./IconCheck.svg";
// import IconCross from "./IconCross.svg";
import Image from "next/image";
import { Draggable } from "react-beautiful-dnd";

function TodoItem({ todo, index, completeTodo, deleteTodo }) {
  return (
    <Draggable draggableId={todo.id} index={index}>
      {(provided) => (
        <li
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="group border-b-[1px]   bg-bgs border-[#393a4d]  p-4 px-5  text-[#cacde8] first:rounded-t-md "
        >
          <div className="flex items-center justify-between relative">
            <button
              onClick={() => completeTodo(index)}
              className={
                todo.completed
                  ? "w-6 h-6 absolute  bg-primary border-none  rounded-full z-20 cursor-pointer flex justify-center items-center"
                  : "w-6 h-6 absolute   rounded-full z-20 cursor-pointer hover:border-primary bg-bgp"
              }
            >
              {todo.completed ?      <Image
                
                src="/IconCheck.svg"
                width={10}
                height={10}
                alt=""
              />
              
              : ""}
            </button>
            <p
              onClick={() => completeTodo(index)}
              className={
                todo.completed
                  ? "  text-[#878787] pl-12 cursor-pointer"
                  : "pl-12 cursor-pointer"
              }
            >
              {todo.title}
            </p>
            <button
              onClick={() => {
                deleteTodo(index);
              }}
              className="mr-2  py-2 px-2  "
            >
               <Image
                
                src="/IconCross.svg"
                width={10}
                height={10}
                alt=""
                className=" ml-3  "
              />
            </button>
          </div>
        </li>
      )}
    </Draggable>
  );
}

export default TodoItem;

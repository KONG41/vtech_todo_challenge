
import { useState, useEffect } from "react";
import axios from "axios";
const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [todo, setTodo] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [error, setError] = useState(false);
  const [errorText,setErrorText] = useState();

  useEffect(() => {
    fetchTasks();
  }, []);

  const [taskToEdit, setTaskToEdit] = useState(null);

  const handleEditClick = (task) => {
    setIsEdit(true);
    setTaskToEdit(task);
    setTodo(task.todo)
    console.log(task)
  };

  const fetchTasks = async () => {
    const { data } = await axios.get("/api/todo");
    setTasks(data);
  };

  const addTask = async () => {
    if(todo == ""){
      setError(true);
      setErrorText('Input must no empty');
    }else{
      const { data } = await axios.post("/api/todo", { todo });
      setTasks([...tasks, data]);
      setTodo("");
      setError(false);
    }
    
  };

  const updateTask = async (id, isCompleted) => {
    const { data } = await axios.put(`/api/todo?id=${id}`, { isCompleted });
    setTasks(tasks.map((task) => (task.id === id ? data : task)));
  };

  const editTask = async (id, todo) => {
    const { data } = await axios.put(`/api/todo?id=${id}`, { todo });
    setTasks(tasks.map((task) => (task.id === id ? data : task)));
  };

  const deleteTask = async (id) => {
    await axios.delete(`/api/todo?id=${id}`);
    setTasks(tasks.filter((task) => task.id !== id));
  };
  const cancelTask = () => {
    setIsEdit(false);
    setTodo("");
  }
  return (
    <main className="w-full p-7 h-screen flex justify-center bg-white">
      <div className="flex flex-col p-7 bg-slate-200 h-full w-[50%]" >
      <h1 className="text-4xl font-bold uppercase mb-12 text-center">Create Todo</h1>
      
        <form
        className="flex flex-row gap-3 w-full"
          onSubmit={(e) => {
            e.preventDefault();
            if(isEdit){
              editTask(taskToEdit.id, todo);
              setIsEdit(false);
              setTodo("")
            }else{
              addTask()
            }
            
          }}
        >
          <input
            type="text"
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
            className="w-4/5 h-10 px-3 border-1 rounded-sm border-gray-300 bg-white text-black placeholder-black focus:outline-none focus:border-gray-500"
            placeholder="your todo..."
          />
          
          <div className="w-1/5">
            {isEdit ? 
            <div className="flex flex-row gap-3">
              <button
                // onClick={saveTask}
                type="submit"
                className="px-4 py-2 rounded-sm w-full bg-green-400 hover:bg-green-500 text-white focus:outline-none"
              >
                Save
              </button>
              <button
                onClick={cancelTask}
                className="px-4 py-2 rounded-sm w-full bg-green-400 hover:bg-green-500 text-white focus:outline-none"
              >
              Cancel
              </button>
            </div>
            
          :
          <button
            // onClick={addTask}
            type="submit"
            className="px-4 py-2 rounded-sm w-full bg-green-400 hover:bg-green-500 text-white focus:outline-none"
          >
            Add
          </button>}
          </div>
        </form>
        {error&&<span className="text-red-500">{errorText}</span>}
        
      
      
      <ul className="mt-6 space-y-4 border-[1px] border-gray-300 p-3 pt-0 rounded-sm overflow-y-scroll relative">
        <h1 className="border-b-[1px] border-gray-300 py-3 font-bold sticky top-0 bg-slate-200">Todo List</h1>
        {tasks.map((task) => (
          <li key={task.id} className="flex items-center space-x-4">
            <input
              type="checkbox"
              checked={task.isCompleted}
              onChange={(e) => updateTask(task.id, e.target.checked)}
              className="h-6 w-6 rounded-lg border-[1px] border-gray-300 focus:outline-none"
            />
            <span
              className={`flex-1 ${
                task.isCompleted
                  ? "line-through text-gray-400"
                  : "text-black"
              }`}
            >
              {task.todo}
            </span>
            <button
              onClick={() => handleEditClick(task)}
              className="px-3 py-2 rounded-sm bg-green-400 hover:bg-green-500 text-white focus:outline-none"
            >
              Edit
            </button>

            <button
              onClick={() => deleteTask(task.id)}
              className="px-3 py-2 rounded-sm bg-green-400 hover:bg-green-500 text-white focus:outline-none"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
    </main>
  );
};

export default Home;

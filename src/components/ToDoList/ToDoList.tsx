import React, { useState, useEffect } from 'react';
import '../ToDoList/ToDoList.scss';


interface Task {
  id: number;
  name: string;
  desc: string;
  completed: boolean;
}

const ToDoList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>('All');
  const [filteredMap, setFilteredMap] = useState<Task[]>([]);
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [editTaskId, setEditTaskId] = useState<number | null>(null);
  const [editedName, setEditedName] = useState<string>('');
  const [editedDesc, setEditedDesc] = useState<string>('');

  const pending = require("../../assets/pending-2.png");
  const completed = require("../../assets/complete.png");
  const first = require("../../assets/first.jpg");
  const second = require("../../assets/second.png");

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]') as Task[];
    if (storedTasks.length > 0) {
      setTasks(storedTasks);
    }
    setLoading(false); // Mark loading as false after tasks are loaded
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    filterTasks();
  }, [tasks, filter]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };
  const handleDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleTasks = () => {
    if(input === ""){
      alert("Task cannot be empty! Please enter a task");
    }
    if (input.trim() !== '') {
      setTasks([...tasks, { id: tasks.length + 1, name: input, desc: description, completed: false }]);
      setInput('');
      setDescription('');
    }
  };

  const toggleDone = (id: number) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === id) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  const toggleEdit = (id: number) => {
    setIsEditable(!isEditable);
    setEditTaskId(id);
  };

  const handleEdit = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, id: number) => {
    const { value } = e.target;
    if (e.target.tagName === 'INPUT') {
      setEditedName(value);
    } else {
      setEditedDesc(value);
    }
  };
  

  const saveEdit = () => {
    const updatedTasks = tasks.map(task => {
      if (task.id === editTaskId) {
        return {
          ...task,
          name: editedName !== '' ? editedName : task.name,
          desc: editedDesc !== '' ? editedDesc : task.desc
        };
      }
      return task;
    });
    setTasks(updatedTasks);
    setIsEditable(false);
    setEditTaskId(null);
    setEditedName('');
    setEditedDesc('');
  };

  const handleDelete = (id: number) => {
    const updatedTasks = tasks.filter(t => t.id !== id);
    setTasks(updatedTasks);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value);
  };

  const filterTasks = () => {
    switch (filter) {
      case 'All':
        setFilteredMap(tasks);
        break;
      case 'Pending':
        setFilteredMap(tasks.filter(task => !task.completed));
        break;
      case 'Completed':
        setFilteredMap(tasks.filter(task => task.completed));
        break;
      default:
        setFilteredMap(tasks);
        break;
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Render a loading indicator while tasks are loading
  }

  return (
    <div className='app__todo'>
      <div className="todo_first">
        <img src={first} alt="" />
      </div>
      <div className="toDo_main">
        <div className="task_input_heading">My Task List</div>
        <div className="task_input">
          <div className="temp-2">

          <input className="input_title" placeholder="What do you have planned?" onChange={handleInput} value={input} type="text" />
          <textarea className="input_desc" placeholder="Description" onChange={handleDescription} value={description}></textarea>
          </div>
          <button className="add_btn" onClick={handleTasks}>Add task</button>
        </div>
        <div className="task_list">
          <div className="task_list_top">
            <div className="task_list_heading">Tasks</div>
            <div className="filter_btn">
              <select className="filter_list" id="dropdown" onChange={handleFilterChange} value={filter}>
                <option value="All">All</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
          <ul>
            {filteredMap.map((task) => (
              <div className="list" key={task.id}>
                <div className="temp">
                  <button className="done_btn" onClick={() => toggleDone(task.id)}>
                    <img src={task.completed ? completed : pending} alt="" />
                  </button>
                  <li style={{
                    textDecoration: task.completed ? 'line-through' : 'none',
                    textDecorationColor: task.completed ? 'grey' : 'initial',
                    color: task.completed ? 'grey' : 'white'
                  }}>
                    <div className="heading">
                      {editTaskId === task.id && isEditable ?
                        <input type="text" value={editedName !== '' ? editedName : task.name} onChange={(e) => handleEdit(e, task.id)} /> :
                        task.name
                      }
                    </div>
                    {task.desc.length > 0 && task.completed === false &&
                      <textarea className="description" disabled = {!isEditable} value={editedDesc !== '' ? editedDesc : task.desc} onChange={(e) => handleEdit(e, task.id)}></textarea>
                    }
                  </li>
                </div>
                <div className="btns">
                  {editTaskId === task.id ?
                    <button className="done_btn" onClick={saveEdit}>SAVE</button> :
                    <button className="done_btn" onClick={() => toggleEdit(task.id)}>EDIT</button>
                  }
                  <button className="delete_btn" onClick={() => handleDelete(task.id)}>DELETE</button>
                </div>
              </div>
            ))}
          </ul>
        </div>
      </div>
      <div className="todo_second">
        <img src={second} alt="" />
      </div>
    </div>
  );
}

export default ToDoList;

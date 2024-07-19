import './App.css';
import { useState, React } from "react";
import { MyContext } from './MyContext';
import TaskHomePage from './TaskComponent/TaskHomePage';

function App() {
  const [taskStepsList, setTaskStepsList] = useState([]);
  return (
    <MyContext.Provider value={{ taskStepsList, setTaskStepsList }}>
      <TaskHomePage />
    </MyContext.Provider>
  );
}

export default App;

import React, { useContext, useState } from "react";
import { MyContext } from "../MyContext";
import './TaskHomePage.css'

function TaskHomePage() {
    const { taskStepsList, setTaskStepsList } = useContext(MyContext);
    const [addStepsModalOpen, setAddStepsModalOpen] = useState(false);
    const [addTaskModalOpen, setAddTaskModalOpen] = useState(false);
    const [taskOrStepName, setTaskOrStepName] = useState('');
    const [storeTask, setStoreTask] = useState(null);
    const [currentSelectedParentIndex, setCurrentSelectedParentIndex] = useState();
    const [currentSelectedTaskIndex, setCurrentSelectedTaskIndex] = useState();
    const [searchText, setSearchText] = useState('');
    const [errorText, setErrorText] = useState(false)

    const handleSearch = (e) => {
        console.log("Eventsearch:", e.target.value);
        setSearchText(e.target.value)
    }

    const searchBar = () => {
        return (
            <input className="SearchBarStyle"
                placeholder="Search..."
                value={searchText}
                onChange={handleSearch} />
        )
    }

    const addTask = () => {
        return (
            <button className="AddTaskContainer" onClick={handleAddTaskModal}>
                <p>Add Task +</p>
            </button>
        )
    }

    const addSteps = () => {
        return (
            <button className="AddTaskContainer" onClick={handleAddStepsModal}>
                <p>Add Steps +</p>
            </button>
        )
    }

    const handleAddStepsModal = () => {
        setAddStepsModalOpen(prev => !prev)
    }

    const handleAddTaskModal = () => {
        console.log("taskStepsList.length", taskStepsList.length)
        setAddTaskModalOpen(prev => !prev)
    }

    const handleCloseModal = () => {
        setAddStepsModalOpen(false);
        setAddTaskModalOpen(false);
        setErrorText(false);
    }

    const handleOnChange = (e) => {
        setTaskOrStepName(e.target.value);
    }

    const handleAddSteps = () => {
        if (taskOrStepName) {
            const stepsList = [...taskStepsList, { stepName: taskOrStepName, tasks: [] }]
            setTaskStepsList(stepsList);
            handleCloseModal();
            setTaskOrStepName('');
        }
        else {
            console.log("Empty:Name:", taskOrStepName)
        }
    }

    const handleAddTask = () => {
        if (taskStepsList.length) {
            if (currentSelectedParentIndex !== null && taskOrStepName) {
                const addTask = taskStepsList[0].tasks.push({ taskName: taskOrStepName })
                setTaskOrStepName(addTask);
                handleCloseModal();
                setTaskOrStepName('');
            }
            else {
                setErrorText(true)
            }
        }
    }

    const addModal = () => {
        return (
            <div className="ModalContainer" >
                <div className="ModalDialogBox">
                    <div style={{ display: "flex", flexDirection: "column", background: 'rgb(149, 192, 206)' }}>
                        <h2 style={{ alignSelf: "center" }}>{addStepsModalOpen ? 'Add Steps' : 'Add Task'}</h2>
                        <img src="https://cdn-icons-png.flaticon.com/128/2734/2734822.png" alt="Close" style={{ height: "30px", width: "30px", alignSelf: "flex-end", position: "absolute" }}
                            onClick={handleCloseModal} />
                    </div>
                    <input placeholder={addStepsModalOpen ? 'Add Steps Name' : 'Add Task Name'}
                        style={{ height: "50px", width: "80%", alignSelf: "center" }}
                        onChange={handleOnChange} />
                    {errorText && <p style={{ color: "red" }}>No Steps Found</p>}
                    <button disabled={!taskOrStepName} style={{ height: "30px", width: "50%", alignSelf: "center", marginBottom: "10px" }}
                        onClick={addStepsModalOpen ? handleAddSteps : handleAddTask}
                    >Add</button>
                </div>
            </div>
        )
    }

    const moveToNextStep = (index, taskId) => {
        const updatedTaskList = [...taskStepsList]
        updatedTaskList[index + 1].tasks.push(taskStepsList[index].tasks[taskId]);
        updatedTaskList[index].tasks.splice(taskId, 1);
        setTaskStepsList(updatedTaskList);
    }

    const moveToPrevStep = (index, taskId) => {
        const updatedTaskList = [...taskStepsList]
        updatedTaskList[index - 1].tasks.push(taskStepsList[index].tasks[taskId]);
        updatedTaskList[index].tasks.splice(taskId, 1);
        setTaskStepsList(updatedTaskList);
    }

    const deleteTask = (index, taskId) => {
        const updatedTaskList = [...taskStepsList]
        updatedTaskList[index].tasks.splice(taskId, 1);
        setTaskStepsList(updatedTaskList);
    }

    const handleDropSelection = (parentStep, taskIndex) => {
        console.log("parentStep, taskIndex", parentStep, taskIndex);
        console.log("parent", taskStepsList[parentStep], "task:", taskStepsList[parentStep].tasks[taskIndex]);
        setCurrentSelectedParentIndex(parentStep);
        setCurrentSelectedTaskIndex(taskIndex);
        const copySelectedTask = taskStepsList[parentStep].tasks[taskIndex];
        setStoreTask(copySelectedTask);
    }



    const handledDropMenuSelection = (item, dropIndex) => {
        if (storeTask !== null && currentSelectedParentIndex !== null && currentSelectedTaskIndex !== null) {
            const updatedTaskList = [...taskStepsList];
            updatedTaskList[dropIndex].tasks.push(storeTask);
            updatedTaskList[currentSelectedParentIndex].tasks.splice(currentSelectedTaskIndex, 1);
            setTaskStepsList(updatedTaskList);
            setStoreTask(null);
            setCurrentSelectedParentIndex(null);
            setCurrentSelectedTaskIndex(null);
        }
    }

    console.log('storeTask', storeTask)
    const steps = () => {
        return (
            taskStepsList?.map((step, index) => {
                const filteredTasks = step.tasks.filter(task =>
                    task.taskName.toLowerCase().includes(searchText.toLowerCase())
                );

                return (
                    <div className="StepsContainer" key={index}>
                        <h3>{step.stepName}</h3>
                        {filteredTasks.map((task, taskIndex) => (
                            <div className="StepsTaskMainContainer" key={taskIndex}>
                                <h3 className="StepsTaskName">{task.taskName}</h3>
                                <div style={{ display: "flex", justifyContent: "center" }}
                                    onClick={() => handleDropSelection(index, taskIndex)}
                                >
                                    <div className="dropdown">
                                        <button className="dropbtn">Dropdown</button>
                                        <div className="dropdown-content">
                                            {taskStepsList.map((item, dropIndex) => {
                                                return (
                                                    <p onClick={() => handledDropMenuSelection(item, dropIndex)}>{item.stepName}</p>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>

                                <div className="ArrowDeleteMainContainer">
                                    {index === 0 ? <div></div> :
                                        <img className="ArrowDeleteImageStyle" src="https://cdn-icons-png.flaticon.com/128/507/507257.png"
                                            alt="next" onClick={() => moveToPrevStep(index, taskIndex)} />}
                                    <img className="ArrowDeleteImageStyle" src="https://cdn-icons-png.flaticon.com/128/6861/6861362.png"
                                        alt="Delete" onClick={() => deleteTask(index, taskIndex)} />
                                    {index === taskStepsList.length - 1 ? <div></div> :
                                        <img className="ArrowDeleteImageStyle" src="https://cdn-icons-png.flaticon.com/128/271/271226.png"
                                            alt="prev" onClick={() => moveToNextStep(index, taskIndex)} />}
                                </div>
                            </div>
                        ))}
                    </div>
                );
            })
        );
    }

    return (
        <div className="Container">
            <div className="HeaderContainer">
                {searchBar()}
                {addTask()}
                {addSteps()}
                {addTaskModalOpen && addModal()}
                {addStepsModalOpen && addModal()}
            </div>
            <div className="StepsListMainContainer">
                {steps()}
            </div>
        </div>
    )
}

export default TaskHomePage;
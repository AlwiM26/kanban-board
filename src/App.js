import React, { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import './App.css';
import AddModal from './Components/AddModal/AddModal';

const App = () => {
  const [data, setData] = useState(() => {
    const savedData = JSON.parse(localStorage.getItem('data'));
    return savedData ? savedData : [
      {
        category: 'Backlog',
        tasks: [],
      },
      {
        category: 'To Do',
        tasks: [],
      },
      {
        category: 'Done',
        tasks: [],
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('data', JSON.stringify(data));
  }, [data]);

  const [showModal, setShowModal] = useState(false);
  const [categoryId, setCategoryId] = useState();

  const handleOnDragEnd = result => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceCategory = data[source.droppableId];
      const destCategory = data[destination.droppableId];
      const sourceTasks = [...sourceCategory.tasks];
      const destTasks = [...destCategory.tasks];
      const [removed] = sourceTasks.splice(source.index, 1);
      destTasks.splice(destination.index, 0, removed);
      sourceCategory.tasks = sourceTasks;
      destCategory.tasks = destTasks;

      const newCategory = [...data];
      newCategory[source.droppableId] = sourceCategory;
      newCategory[destination.droppableId] = destCategory;

      setData(newCategory);
    } else {
      const category = data[source.droppableId];;
      const newTasks = [...category.tasks];
      const [removed] = newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, removed);
      category.tasks = newTasks;

      const newCategory = [...data];
      newCategory[source.droppableId] = category;

      setData(newCategory);
    }
  }

  const handleAddTask = (categoryId, formValues) => {
    const category = data[categoryId];
    category.tasks.push(formValues);

    const newData = [...data];
    newData[categoryId] = category;

    setData(newData);
    localStorage.setItem('data', JSON.stringify(data));
  }

  const handleModal = categoryId => {
    setShowModal(!showModal);
    setCategoryId(categoryId);
  }

  return (
    <div className="mainContainer">
      <div className="headerContainer">
        <h2>Kanban Board</h2>
      </div>
      <div className="contentContainer">
        <DragDropContext
          onDragEnd={result => handleOnDragEnd(result)}
        >
          {data.map((category, id) => (
            <Droppable key={id} droppableId={id.toString()}>
              {(provided, snapshot) => (
                <div
                  className="taskContainer"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  <div className="topTaskContainer">
                    <h2>{category.category}</h2>
                    <button className='btnAddTask' onClick={() => handleModal(id)}><i className='fas fa-plus' /> Add Task</button>
                  </div>
                  <div className="bottomTaskContainer">
                    {category.tasks.map((task, id) => {
                      const startDate = new Date(task.start_date).getTime();
                      const endDate = new Date(task.end_date).getTime();
                      const diff = Math.abs(endDate - startDate);
                      const dayLeft = Math.ceil(diff / (1000 * 3600 * 24));

                      return (
                        <Draggable
                          key={task.issue_id}
                          draggableId={task.issue_id}
                          index={id}
                        >
                          {(provided, snapshot) => (
                            <div
                              className="itemContainer"
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={provided.draggableProps.style}
                              ref={provided.innerRef}
                            >
                              <div className="topItemContainer">
                                <h2>{task.title}</h2>
                              </div>
                              <div className="bottomItemContainer">
                                <p className='tags'>{task.tags}</p>
                                <p className='daysLeft'>{dayLeft} days</p>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                  </div>
                  {provided.placeholder}
                </div>
              )}

            </Droppable>
          ))}
        </DragDropContext>
      </div>
      <AddModal showModal={showModal} setShowModal={setShowModal} handleAddTask={handleAddTask} categoryId={categoryId} />
    </div >
  );
};

export default App;

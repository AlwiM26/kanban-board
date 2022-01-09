import React, { useState } from 'react';
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { v4 as uuidv4 } from 'uuid';
import './App.css';

const App = () => {
  const [data, setData] = useState([
    {
      category: 'Backlog',
      tasks: [
        { issue_id: uuidv4(), title: 'aCreate API to load user info from database', asignee: 'Alwi Muhammad', tags: 'Design' },
        { issue_id: uuidv4(), title: 'bCreate API to load user info from database', asignee: 'Alwi Muhammad', tags: 'Design' },
        { issue_id: uuidv4(), title: 'cCreate API to load user info from database', asignee: 'Alwi Muhammad', tags: 'Design' },
        { issue_id: uuidv4(), title: 'dCreate API to load user info from database', asignee: 'Alwi Muhammad', tags: 'Design' },
      ],
    },
    {
      category: 'To Do',
      tasks: [
        { issue_id: uuidv4(), title: 'eCreate API to load user info from database', asignee: 'Alwi Muhammad', tags: 'Design' }
      ],
    },
    {
      category: 'Done',
      tasks: [],
    }
  ]);

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
                    <button className='btnAddTask'>+ Add Task</button>
                  </div>
                  <div className="bottomTaskContainer">
                    {category.tasks.map((task, id) => (
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
                            <div className="topItemContainer">{task.title}</div>
                            <div className="bottomItemContainer">
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  </div>
                  {provided.placeholder}
                </div>
              )}

            </Droppable>
          ))}
        </DragDropContext>
      </div>
    </div >
  );
};

export default App;

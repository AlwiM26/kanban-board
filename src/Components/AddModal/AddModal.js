import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import './AddModal.css';

const AddModal = ({ showModal, setShowModal, handleAddTask, categoryId }) => {
  const [formValues, setFormValues] = useState({
    issue_id: uuidv4(), title: '', asignee: '', start_date: '', end_date: '', tags: '',
  });
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    let errors = validateForms();
    if (Object.keys(errors).length === 0) {
      handleAddTask(categoryId, formValues);
      setShowModal(!showModal);
      setFormValues({
        issue_id: uuidv4(), title: '', asignee: '', start_date: '', end_date: '', tags: '',
      });
      setFormErrors({});
    } else {
      setFormErrors(validateForms);
    }

  };

  const validateForms = () => {
    const errors = {};

    if (!formValues.title) errors.title = "Title is required!";
    if (!formValues.tags) errors.tags = "Tags is required!";
    if (!formValues.asignee) errors.asignee = "Asignee is required!";
    if (!formValues.start_date) errors.start_date = "Start Date is required!";
    if (!formValues.end_date) errors.end_date = "End Date is required!";

    return errors;
  }

  const handleCloseModal = e => {
    e.preventDefault();
    setShowModal(!showModal);
    setFormValues({
      issue_id: uuidv4(), title: '', asignee: '', start_date: '', end_date: '', tags: '',
    });
    setFormErrors({});
  }

  return (
    <div className={showModal ? "modalContainer active" : "modalContainer"}>
      <div className="modalCard">
        <div className="topModalContainer">
          <h2>New Task</h2>
          <button className="btnCloseModal" onClick={e => handleCloseModal(e)}>
            <i className="fas fa-times" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modalFormContainer">
            <div className="inputItem">
              <label className="inputLabel">Title</label>
              <input className="inputForm" type="text" name="title" onChange={handleChange} value={formValues.title} />
              <p className="errorMsg">{formErrors.title}</p>
            </div>
            <div className="inputItem">
              <label className="inputLabel">Tags</label>
              <input className="inputForm" type="text" name="tags" onChange={handleChange} value={formValues.tags} />
              <p className="errorMsg">{formErrors.tags}</p>
            </div>
            <div className="inputItem">
              <label className="inputLabel">Asignee</label>
              <input className="inputForm" type="text" name="asignee" onChange={handleChange} value={formValues.asignee} />
              <p className="errorMsg">{formErrors.asignee}</p>
            </div>
            <div className="inputItem">
              <label className="inputLabel">Start Date</label>
              <input className="inputForm" type="date" name="start_date" onChange={handleChange} value={formValues.start_date} />
              <p className="errorMsg">{formErrors.start_date}</p>
            </div>
            <div className="inputItem">
              <label className="inputLabel">End Date</label>
              <input className="inputForm" type="date" name="end_date" onChange={handleChange} value={formValues.end_date} />
              <p className="errorMsg">{formErrors.end_date}</p>
            </div>
            <input className="btnAdd" type="submit" value="Add" onClick={handleSubmit} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddModal;
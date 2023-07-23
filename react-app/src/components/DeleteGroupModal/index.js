import React, { useState } from "react";
import { useModal } from "../../context/Modal";
import { deleteGroupThunk, getAllGroupsThunk } from "../../store/groups";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import './DeleteGroupModal.css'

function DeleteGroupModal({ group, setCurrentView }) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    const history = useHistory();
  
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      dispatch(deleteGroupThunk(group.id))
      .then(() => {
          closeModal();
          dispatch(getAllGroupsThunk());
          history.push(`/dashboard`);
          setCurrentView('dashboard')
      })
    };
  
  
    return (
        <div className="mainContainer">
            <div className="deleteHeader">Confirm Delete</div>
            <p className="deleteText">Are you sure you want to delete this group?</p>  
        
            <div className="YN">
                <button
                id="yesDelete"
                onClick={handleSubmit}
                >
                    Yes (Delete Group)
                </button>
                <button
                id="noDelete"
                onClick={((e) => {
                  closeModal();
                  e.stopPropagation();
                  })}
                >
                    No (Keep Group)
                </button>
            </div>
        </div>
    )
  }
  
  export default DeleteGroupModal;
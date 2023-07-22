import React, { useState } from "react";
import { useModal } from "../../context/Modal";
import { deleteGroupThunk, getAllGroupsThunk } from "../../store/groups";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

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
            <div className="deleteText">
            <h1 className="h1Delete">Confirm Delete</h1>
            <p className="pDelete">Are you sure you want to delete this group?</p>  
            </div>
        
            <div className="YN">
                <button
                className="Ybutton"
                id="yesDelete"
                onClick={handleSubmit}
                >
                    Yes (Delete Group)
                </button>
                <button
                className="Nbutton"
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
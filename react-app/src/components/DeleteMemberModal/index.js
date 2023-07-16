import React, { useState } from "react";
import { useModal } from "../../context/Modal";
import { deleteGroupMemberThunk, getAllGroupsThunk } from "../../store/groups";
import { useParams } from 'react-router-dom/cjs/react-router-dom.min'
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";

function DeleteMemberModal({ group, member }) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    const history = useHistory();
  
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      dispatch(deleteGroupMemberThunk(group.id, member))
      .then(() => {
          closeModal();
          dispatch(getAllGroupsThunk());
          history.push(`/groups/${group.id}`)
      })
    };
  
  
    return (
        <div className="mainContainer">
            <div className="deleteText">
            <h1 className="h1Delete">Confirm Delete</h1>
            <p className="pDelete">Are you sure you want to remove this member ?</p>  
            </div>
        
            <div className="YN">
                <button
                className="Ybutton"
                id="yesDelete"
                onClick={handleSubmit}
                >
                    Yes (Remove Member)
                </button>
                <button
                className="Nbutton"
                id="noDelete"
                onClick={((e) => {
                  closeModal();
                  e.stopPropagation();
                  history.push(`/groups/${group.id}`)
                  })}
                >
                    No (Keep Member)
                </button>
            </div>
        </div>
    )
  }
  
  export default DeleteMemberModal;
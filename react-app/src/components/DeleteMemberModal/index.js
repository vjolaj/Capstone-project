import React from "react";
import { useModal } from "../../context/Modal";
import { deleteGroupMemberThunk, getAllGroupsThunk } from "../../store/groups";
import { useDispatch } from "react-redux";
import { getAllGroupBalancesThunk } from "../../store/settlements";
import { getAllGroupExpensesRoutes } from "../../store/expenses";
import { getGroupSettlementThunk } from "../../store/settlements";
import './DeleteMemberModal.css'

function DeleteMemberModal({ group, member }) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();  
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      dispatch(deleteGroupMemberThunk(group.id, member))
      .then(() => {
          closeModal();
          dispatch(getAllGroupsThunk());
          dispatch(getAllGroupExpensesRoutes(group.id));
          dispatch(getAllGroupBalancesThunk(group.id));
          dispatch(getGroupSettlementThunk(group.id));
      })
    };
  
  
    return (
        <div className="mainContainer">
            <h1 className="deleteHeader">Confirm Delete</h1>
            <p className="deleteText">Are you sure you want to remove this member ?</p>  
        
            <div className="YN">
                <button
                id="yes-member-delete"
                onClick={handleSubmit}
                >
                    Yes (Remove Member)
                </button>
                <button
                id="no-member-delete"
                onClick={((e) => {
                  closeModal();
                  e.stopPropagation();
                //   history.push(`/groups/${group.id}`)
                  })}
                >
                    No (Keep Member)
                </button>
            </div>
        </div>
    )
  }
  
  export default DeleteMemberModal;
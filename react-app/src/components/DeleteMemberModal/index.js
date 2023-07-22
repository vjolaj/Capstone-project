import React from "react";
import { useModal } from "../../context/Modal";
import { deleteGroupMemberThunk, getAllGroupsThunk } from "../../store/groups";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { getAllGroupBalancesThunk } from "../../store/settlements";
import { getAllGroupExpensesRoutes } from "../../store/expenses";
import { getGroupSettlementThunk } from "../../store/settlements";

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
          dispatch(getAllGroupExpensesRoutes(group.id));
          dispatch(getAllGroupBalancesThunk(group.id));
          dispatch(getGroupSettlementThunk(group.id));
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
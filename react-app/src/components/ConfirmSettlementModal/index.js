import React, { useState } from "react";
import { useModal } from "../../context/Modal";
import { getAllGroupsThunk } from "../../store/groups";
import { getAllGroupBalancesThunk, getGroupSettlementThunk } from "../../store/settlements";
import { getAllGroupExpensesRoutes } from "../../store/expenses";
import { makeNewSettlementThunk } from "../../store/settlements";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

function ConfirmSettlementModal({ settlement, group }) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        dispatch(makeNewSettlementThunk(settlement.id))
        .then(() => {
            closeModal();
            dispatch(getAllGroupsThunk())
            dispatch(getAllGroupExpensesRoutes(group.id));
            dispatch(getAllGroupBalancesThunk(group.id));
            dispatch(getGroupSettlementThunk(group.id))
            history.push(`/groups/${group.id}`)
        })
      };
    

  return (
    <div className="mainContainer">
      <div className="deleteText">
        <h1 className="h1Delete">Confirm Payment</h1>
        <p className="pDelete">Please confirm your payment of ${settlement.amount} to {settlement.payee_username}.</p>
      </div>

      <div className="YN">
        <button className="Ybutton" id="yesDelete" onClick={handleSubmit}>
          Yes, I have made the payment
        </button>
        <button
          className="Nbutton"
          id="noDelete"
          onClick={(e) => {
            closeModal();
            e.stopPropagation();
            history.push(`/groups/${group.id}`);
          }}
        >
          No, take me back
        </button>
      </div>
    </div>
  );
}

export default ConfirmSettlementModal;

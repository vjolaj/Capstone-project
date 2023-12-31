import React, { useState, useEffect } from "react";
import { useModal } from "../../context/Modal";
import { getAllGroupsThunk } from "../../store/groups";
import {
  getAllGroupBalancesThunk,
  getGroupSettlementThunk,
} from "../../store/settlements";
import { getAllGroupExpensesRoutes } from "../../store/expenses";
import { makeNewSettlementThunk } from "../../store/settlements";
import { useDispatch } from "react-redux";
import './ConfirmSettlementModal.css'

function ConfirmSettlementModal({ settlement, group }) {
  const { closeModal } = useModal();
  const dispatch = useDispatch();
  const [method, setMethod] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const methods = ["", "Cash", "Venmo", "PayPal"];

  useEffect(() => {
    const errorsObject = {};
    if (!method) {
      errorsObject.method = "Method of payment selection is required";
    }
    setValidationErrors(errorsObject);
  }, [method]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (Object.values(validationErrors).length) {
      return null;
    }
    setValidationErrors({});

    dispatch(makeNewSettlementThunk(settlement.id, method)).then(() => {
      closeModal();
      dispatch(getAllGroupsThunk());
      dispatch(getAllGroupExpensesRoutes(group.id));
      dispatch(getAllGroupBalancesThunk(group.id));
      dispatch(getGroupSettlementThunk(group.id));
    });
  };

  return (
    <div className="mainContainer">
        <h1 className="formHeading">Confirm Payment</h1>
        <p className="add-member-warning">
          Please confirm your payment of ${parseFloat(settlement.amount).toFixed(2)} to{" "}
          {settlement.payee_username}.
        </p>
      <label className="select-payment-div">
            <div className="select-text">Select a payment method.</div>
            <select
              className="select-payment"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
            >
              {methods.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </label>
            {submitted && validationErrors.method && (
              <p className="error">{validationErrors.method}</p>
            )}

      <div className="YN">
        <button className="confirm-payment-button" onClick={handleSubmit}>
          Yes, I have made the payment
        </button>
        <button
          className="Nbutton"
          id="noDelete"
          onClick={(e) => {
            closeModal();
            e.stopPropagation();
          }}
        >
          No, take me back
        </button>
      </div>
    </div>
  );
}

export default ConfirmSettlementModal;

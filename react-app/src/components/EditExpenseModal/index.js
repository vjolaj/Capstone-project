import React, { useState, useEffect } from "react";
import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { editExpenseThunk } from "../../store/expenses";
import { getAllGroupsThunk } from "../../store/groups";
import { getAllGroupExpensesRoutes } from "../../store/expenses";
import { getAllGroupBalancesThunk } from "../../store/settlements";
import { getGroupSettlementThunk } from "../../store/settlements";

function EditExpenseModal({ expense, group }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const expenseCategories = ["", "Transportation", "Housing", "Utilities", "Food", "Entertainment"];
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const errorsObject = {};
    if (!amount) {
      errorsObject.amount = "Amount is required";
    }
    if (isNaN(amount)) {
        errorsObject.amount = "Amount must be a numeric value"
    }
    if (amount < 0) {
      errorsObject.amount = "Amount must be a positive value";
    }
    if (description.length > 255) {
      errorsObject.description =
        "Description can't be longer than 255 characters.";
    }
    if (!expenseCategory) {
      errorsObject.expenseCategory = "Expense Category selection is required";
    }

    setValidationErrors(errorsObject);
  }, [amount, description, expenseCategory]);

  useEffect(() => {
    if (expense) {
      setAmount(parseFloat(expense.amount).toFixed(2) || "");
      setDescription(expense.description || "");
      setExpenseCategory(expense.category || "");
    }
  }, [expense]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    const editedExpense = {
        amount,
        expenseCategory,
        description
    }

    if (Object.values(validationErrors).length) {
      return null;
    }
    setValidationErrors({});
    return dispatch(editExpenseThunk(expense.id, editedExpense))
    .then(() => {
        closeModal()
        dispatch(getAllGroupsThunk());
        dispatch(getAllGroupExpensesRoutes(group.id))
        dispatch(getAllGroupBalancesThunk(group.id));
        dispatch(getGroupSettlementThunk(group.id));
    })
  };

  return (
    <div className="mainContainer">
      <div className="add-group-form">
        <form onSubmit={handleSubmit}>
          {/* <ul>
                  {errors.map((error, idx) => (
                    <li key={idx}>{error}</li>
                  ))}
                </ul> */}
          <div className="formHeading">Edit your expense</div>
          <div className="individualFormContainer">
            Enter an amount for your expense.
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              placeholder="Amount"
              className="input"
            />
            {submitted && validationErrors.amount && (
              <p className="error">{validationErrors.amount}</p>
            )}
          </div>

          <div className="longerFormContainer">
            Enter a description for this expense.
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Expense Description"
              className="input"
            />
            {submitted && validationErrors.description && (
              <p className="error">{validationErrors.description}</p>
            )}
          </div>
          <label className="select-div">
          <div className="select-text">Select the expense category</div>
            <select
              value={expenseCategory}
              onChange={(e) => setExpenseCategory(e.target.value)}
            >
              {expenseCategories.map((expenseCategory) => (
                <option key={expenseCategory} value={expenseCategory}>
                  {expenseCategory}
                </option>
              ))}
            </select>
          </label>
            {submitted && validationErrors.expenseCategory && (
              <p className="error">{validationErrors.expenseCategory}</p>
            )}
          <div className="submit-div">
          <button type="submit" className="submit-expense-button">
            Edit your Expense
          </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditExpenseModal;

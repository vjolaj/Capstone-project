import React, { useState, useEffect } from "react";
import { useModal } from "../../context/Modal";
import { useDispatch, useSelector } from "react-redux";
import { createExpenseThunk } from "../../store/expenses";
import { getAllGroupsThunk } from "../../store/groups";
import { getAllGroupExpensesRoutes } from "../../store/expenses";
import { getGroupSettlementThunk } from "../../store/settlements";
import { getAllGroupBalancesThunk } from "../../store/settlements";

function AddExpenseModal({ group }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const sessionUser = useSelector((state) => state.session.user);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  //   const [image, setImage] = useState(null);
  const [expenseCategory, setExpenseCategory] = useState("");
  //   const [imageLoading, setImageLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const expenseCategories = [
    "",
    "Transportation",
    "Housing",
    "Utilities",
    "Food",
    "Entertainment",
  ];
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const errorsObject = {};
    if (!amount) {
      errorsObject.amount = "Amount is required";
    }
    if (isNaN(amount)) {
      errorsObject.amount = "Amount must be a numeric value";
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
    //   add validation error for image types

    setValidationErrors(errorsObject);
  }, [amount, description, expenseCategory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    const newExpense = {
      amount,
      expenseCategory,
      description,
    };
    // aws uploads can be a bit slow—displaying
    // some sort of loading message is a good idea
    // setImageLoading(true);
    if (Object.values(validationErrors).length) {
      return null;
    }
    setValidationErrors({});
    return dispatch(createExpenseThunk(group.id, newExpense)).then(() => {
      closeModal();
      dispatch(getAllGroupsThunk());
      dispatch(getAllGroupExpensesRoutes(group.id));
      dispatch(getAllGroupBalancesThunk(group.id));
      dispatch(getGroupSettlementThunk(group.id));
    });
  };

  return (
    <>
      <div className="add-group-form">
        <form onSubmit={handleSubmit}>
          {/* <ul>
                  {errors.map((error, idx) => (
                    <li key={idx}>{error}</li>
                  ))}
                </ul> */}
          <div className="formHeading">Add a new expense</div>
          <div className="individualFormContainer">
            Enter an amount for your expense
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
            Please enter a description for this expense.
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
          <label>
            Select the expense category
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
            {submitted && validationErrors.expenseCategory && (
              <p className="error">{validationErrors.expenseCategory}</p>
            )}
          </label>
          {/* <div className="form-input-box">
            <div
              className="imageInputContainer longerFormContainer"
              htmlFor="image"
            >
              Post an image for your group.
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              ></input>
              {submitted && validationErrors.image && (
                <p className="error">{validationErrors.image}</p>
              )}
            </div>
          </div> */}
          <button type="submit" className="submit-form-button">
            Add your Expense
          </button>
        </form>
      </div>
    </>
  );
}

export default AddExpenseModal;

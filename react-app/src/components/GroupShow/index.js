import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import "./GroupShow.css";
import {
  createGroupThunk,
  getAllGroupsThunk,
  readSingleGroupThunk,
  editGroupThunk,
} from "../../store/groups";
import { getAllGroupExpensesRoutes } from "../../store/expenses";
import { getAllUsersThunk } from "../../store/users";
import {
  getAllGroupBalancesThunk,
  getGroupSettlementThunk,
} from "../../store/settlements";
import OpenModalButton from "../OpenModalButton";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import AddMemberModal from "../AddMemberModal";
import DeleteMemberModal from "../DeleteMemberModal";
import DeleteGroupModal from "../DeleteGroupModal";
import AddExpenseModal from "../AddExpenseModal";
import EditExpenseModal from "../EditExpenseModal";
import ConfirmSettlementModal from "../ConfirmSettlementModal";

const GroupShow = ({ groupId, setCurrentView }) => {
  // const { groupId } = useParams();
  const dispatch = useDispatch();
  const current_user = useSelector((state) => state.session.user);
  const [editMode, setEditMode] = useState(false);
  const group = useSelector((state) => state.groups.allGroups[groupId]);
  const groupExpenses = useSelector((state) => state.expenses.groupExpenses);
  const groupBalances = useSelector((state) => state.settlements.balances);
  const groupSettlement = useSelector((state) => state.settlements.settlements);
  const [description, setDescription] = useState("");
  const history = useHistory();
  const [submitted, setSubmitted] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (group) {
      setDescription(group.description || "");
    }
  }, [group]);

  useEffect(() => {
    const errorsObject = {};
    if (!description) {
      errorsObject.description = "Description is required";
    }
    if (description.length > 255) {
      errorsObject.description =
        "Description can't be longer than 255 characters.";
    }

    setValidationErrors(errorsObject);
  }, [description]);

  useEffect(() => {
    dispatch(getAllGroupsThunk());
    dispatch(readSingleGroupThunk(groupId));
    dispatch(getAllGroupExpensesRoutes(groupId));
    dispatch(getAllGroupBalancesThunk(groupId));
    dispatch(getGroupSettlementThunk(groupId));
  }, [dispatch, groupId]);

  const users = useSelector((state) => state.users.users);
  // console.log(users)
  useEffect(() => {
    dispatch(getAllUsersThunk());
  }, [dispatch]);

  const handleDescriptionChange = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (Object.values(validationErrors).length) {
      return null;
    }
    setValidationErrors({});
    dispatch(editGroupThunk(description, group.id)).then(() => {
      setEditMode(false);
      dispatch(getAllGroupsThunk());
    });
  };

  const convertDate = (date) => {
    const newDate = new Date(date);
    const options = { day: "numeric", month: "long", year: "numeric" };
    const convertedDate = newDate.toLocaleString("en-US", options);
    return convertedDate;
  };

  const getExpenseCategoryIcon = (category) => {
    const iconMap = {
      Transportation: <i class="fa-solid fa-car"></i>,
      Housing: <i class="fa-solid fa-house"></i>,
      Utilities: <i class="fa-solid fa-lightbulb"></i>,
      Food: <i class="fa-solid fa-utensils"></i>,
      Entertainment: <i class="fa-solid fa-ticket"></i>,
    };
    return iconMap[category];
  };

  if (!group) return null;
  if (!groupExpenses) return null;
  // if (!current_user) return null;

  return (
    <div>
      <div>
        {/* <h3>Group:</h3> */}
        <div>
          <img className="groupImage" src={group.imageUrl} alt="img" />
          <div className="group-info-container">
            <div className="name-container">
              <div className="group-name">{group.group_name}</div>
              {current_user.id == group.creator_id &&
                Object.values(groupBalances).every(
                  (balance) => balance <= 0.01
                ) && (
                  <div className="delete-group-button">
                    <OpenModalButton
                      buttonText="Delete Group"
                      modalComponent={
                        <DeleteGroupModal
                          group={group}
                          setCurrentView={setCurrentView}
                        />
                      }
                    />
                  </div>
                )}
            </div>
            <div className="group-description">
              {current_user && current_user.id === group.creator_id && (
                <>
                  {editMode ? (
                    <div className="edit-description-container">
                      <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                  ) : (
                    <div>{group.description}</div>
                  )}
                  {editMode ? (
                    <>
                      <button
                        className="edit-description-button"
                        onClick={handleDescriptionChange}
                      >
                        Save description
                      </button>
                      {submitted && validationErrors.description && (
                        <p className="error">{validationErrors.description}</p>
                      )}
                    </>
                  ) : (
                    <button
                      className="edit-description-button"
                      onClick={() => setEditMode(true)}
                    >
                      Edit description
                    </button>
                  )}
                </>
              )}
              {current_user && current_user.id != group.creator_id && (
                <div>Description: {group.description}</div>
              )}
            </div>
            <div className="members-container">
              <div className="members">
                {/* <div>Members</div> */}
                {group.members.map((member) => (
                  <div className="edit-member" key={member.id}>
                    <div className="member">
                      {member}
                      {current_user &&
                        current_user.id === group.creator_id &&
                        current_user.username != member &&
                        Object.values(groupExpenses).length === 0 && (
                          <div className="remove-member">
                            <OpenModalButton
                              buttonText={
                                <i class="fa-solid fa-user-minus"></i>
                              }
                              modalComponent={
                                <DeleteMemberModal
                                  group={group}
                                  member={member}
                                />
                              }
                            />
                          </div>
                        )}
                    </div>
                  </div>
                ))}
              </div>
              {current_user &&
                current_user.id === group.creator_id &&
                Object.values(groupExpenses).length === 0 && (
                  <div className="add-member">
                    <OpenModalButton
                      buttonText="Add a Member"
                      modalComponent={
                        <AddMemberModal group={group} users={users} />
                      }
                    />
                  </div>
                )}
            </div>
            <div className="balances-text">Group Balances</div>
            <div className="balances">
              {Object.entries(groupBalances).map(([key, value]) => (
                <div className={value >= 0 ? "is-owed" : "owes"} key={key}>
                  {key}
                  {value > 0
                    ? ` is owed $${parseFloat(value).toFixed(2)}`
                    : ` owes $${Math.abs(parseFloat(value).toFixed(2))}`}
                </div>
              ))}
              {Math.abs(groupBalances[current_user.username]) <= 0.01 ? (
                <div className="settled-message">
                  {" "}
                  <i class="fa-regular fa-square-check"></i>You are settled up
                  in this group - yay!
                </div>
              ) : (
                <div>
                  <div className="settled-message">
                    <i class="fa-solid fa-right-left"></i>In order to get you
                    settled up in this group:
                  </div>
                  {groupBalances[current_user.username] > 0.01 ? (
                    <div className="wait-payment-message">
                      You must wait for payments from members
                    </div>
                  ) : (
                    <div>
                      {Object.values(groupSettlement).map((settlement) => (
                        <div className="settlement-div" key={settlement.id}>
                          <div className="you-owe-message">
                            You owe {settlement.payee_username} $
                            {parseFloat(settlement.amount).toFixed(2)}
                          </div>
                          <div className="confirm-settlement-button">
                            <OpenModalButton
                              buttonText="Confirm Settlement"
                              modalComponent={
                                <ConfirmSettlementModal
                                  settlement={settlement}
                                  group={group}
                                />
                              }
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="expenses-container">
            <div className="expenses-add-container">
              <div className="expenses-text">Group Expenses:</div>
              <div className="add-expense-button">
                {group.members.length > 1 ? (
                  <OpenModalButton
                    buttonText="Add an Expense"
                    modalComponent={<AddExpenseModal group={group} />}
                  />
                ) : (
                  <div>
                    You can start adding expenses once you add at least one
                    member to your group.
                  </div>
                )}
              </div>
            </div>
            {Object.values(groupExpenses)
              .map((expense) => (
                <div className="individual-expense" key={expense.id}>
                  <div className="expense-small-container">
                    <div className="expense-category">
                      {" "}
                      {getExpenseCategoryIcon(expense.category)}
                    </div>
                    <div className="expense-info">
                      <div>
                        {expense.creator_name} posted a $
                        {parseFloat(expense.amount).toFixed(2)} expense on{" "}
                        {convertDate(expense.created_at)}
                      </div>
                      <div>Expense description: {expense.description}</div>
                    </div>
                  </div>
                  {current_user && current_user.id === expense.creator_id && (
                    <div className="edit-expense-button">
                      <OpenModalButton
                        buttonText="Edit Expense"
                        modalComponent={
                          <EditExpenseModal expense={expense} group={group} />
                        }
                      />
                    </div>
                  )}
                </div>
              ))
              .reverse()}
          </div>
        </div>
      </div>
    </div>
  );
};
export default GroupShow;

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

const GroupShow = () => {
  const { groupId } = useParams();
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
      errorsObject.description = "Description is required"}
    if (description.length > 255) {
      errorsObject.description = "Description can't be longer than 255 characters.";
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
      history.push(`/groups/${group.id}`);
    });
  };

  if (!group) return null;
  if (!groupExpenses) return null;
  // if (!current_user) return null;

  return (
    <div>
      <div>
        <h3>Group:</h3>
        <div>
          <img className="groupImage" src={group.imageUrl} alt="img" />
          {current_user.id == group.creator_id &&
            Object.values(groupBalances).every((balance) => balance === 0) && (
              <div>
                <OpenModalButton
                  buttonText="Delete Group"
                  modalComponent={<DeleteGroupModal group={group} />}
                />
              </div>
            )}
          <div>Group name: {group.group_name}</div>
          {current_user && current_user.id === group.creator_id && (
            <>
              {editMode ? (
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              ) : (
                <div>Group description: {group.description}</div>
              )}
              {editMode ? (
                <>
                  <button onClick={handleDescriptionChange}>
                    Save description
                  </button>
                  {submitted && validationErrors.description && (
                    <p className="error">{validationErrors.description}</p>
                  )}
                </>
              ) : (
                <button onClick={() => setEditMode(true)}>
                  Edit description
                </button>
              )}
            </>
          )}
          {current_user && current_user.id != group.creator_id && (
            <div>Group description: {group.description}</div>
          )}
          <div>
            <h4>Group Balances</h4>
            {Object.entries(groupBalances).map(([key, value]) => (
              <div key={key}>
                {key}
                {value > 0 ? ` is owed $${parseFloat(value).toFixed(2)}` : ` owes $${Math.abs(parseFloat(value).toFixed(2))}`}
              </div>
            ))}
          </div>
          {groupBalances[current_user.username] === 0 ? (
            <div>You are settled up in this group</div>
          ) : (
            <div>
              <h4>In order to get you settled up in this group:</h4>
              {groupBalances[current_user.username] > 0 ? (
                <div>You must wait for payments from members</div>
              ) : (
                <div>
                  {Object.values(groupSettlement).map((settlement) => (
                    <div key={settlement.id}>
                      You owe {settlement.payee_username} ${parseFloat(settlement.amount).toFixed(2)}
                      <div>
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

          <div>
            <h4>Group Expenses:</h4>
            {Object.values(groupExpenses)
              .map((expense) => (
                <div key={expense.id}>
                  <div>Expense Category: {expense.category}</div>
                  <div>Expense description: {expense.description}</div>
                  <div>
                    {expense.creator_name} posted a ${parseFloat(expense.amount).toFixed(2)} expense on{" "}
                    {expense.created_at}
                  </div>
                  {current_user && current_user.id === expense.creator_id && (
                    <div>
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
          <div>
            <OpenModalButton
              buttonText="Add an Expense"
              modalComponent={<AddExpenseModal group={group} />}
            />
          </div>
          <div>
            <h4>Group Members</h4>
            {group.members.map((member) => (
              <div key={member.id}>
                <div>{member}</div>
                {current_user &&
                  current_user.id === group.creator_id &&
                  current_user.username != member &&
                  Object.values(groupBalances).every(
                    (balance) => balance === 0
                  ) && (
                    <div>
                      <OpenModalButton
                        buttonText="Remove Member"
                        modalComponent={
                          <DeleteMemberModal group={group} member={member} />
                        }
                      />
                    </div>
                  )}
              </div>
            ))}
          </div>
          {current_user &&
            current_user.id === group.creator_id &&
            Object.values(groupExpenses).length === 0 && (
              <div>
                <OpenModalButton
                  buttonText="Add a Member"
                  modalComponent={
                    <AddMemberModal group={group} users={users} />
                  }
                />
              </div>
            )}
        </div>
      </div>
    </div>
  );
};
export default GroupShow;

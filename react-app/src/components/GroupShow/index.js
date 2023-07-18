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

  useEffect(() => {
    if (group) {
      setDescription(group.description || "");
    }
  }, [group]);

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
        Group:
        <div>
          <img className="groupImage" src={group.imageUrl} alt="img" />
          {current_user.id == group.creator_id && (
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
                <button onClick={handleDescriptionChange}>
                  Save description
                </button>
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
            {Object.entries(groupBalances).map(([key, value]) => (
              <div key={key}>
                {key}
                {value > 0 ? ` is owed $${value}` : ` owes $${Math.abs(value)}`}
              </div>
            ))}
          </div>
          {groupBalances[current_user.username] === 0 ? (
            <div>You are settled up in this group</div>
          ) : (
            <div>
              In order to get you settled up in this group:
              {groupBalances[current_user.username] > 0 ? (
                <div>You must wait for payments from members</div>
              ) : <div>
                {Object.values(groupSettlement).map((settlement) => (
                  <div key={settlement.id}>
                    You owe {settlement.payee_username} ${settlement.amount}
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
              </div>}
            </div>
          )}

          <div>
            Group Expenses:
            {Object.values(groupExpenses).map((expense) => (
              <div key={expense.id}>
                <div>Expense Category: {expense.category}</div>
                <div>Expense description: {expense.description}</div>
                <div>
                  {expense.creator_name} posted a ${expense.amount} expense on{" "}
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
            ))}
          </div>
          <div>
            <OpenModalButton
              buttonText="Add an Expense"
              modalComponent={<AddExpenseModal group={group} />}
            />
          </div>
          <div>
            Group members:
            {group.members.map((member) => (
              <div key={member.id}>
                <div>{member}</div>
                {current_user &&
                  current_user.id === group.creator_id &&
                  current_user.username != member && (
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
          {current_user && current_user.id === group.creator_id && (
            <div>
              <OpenModalButton
                buttonText="Add a Member"
                modalComponent={<AddMemberModal group={group} users={users} />}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default GroupShow;

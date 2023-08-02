import React, { useState, useEffect } from "react";
import { useModal } from "../../context/Modal";
import { addGroupMemberThunk, getAllGroupsThunk } from "../../store/groups";
import { getAllGroupBalancesThunk } from "../../store/settlements";
import { getAllGroupExpensesRoutes } from "../../store/expenses";
import { getGroupSettlementThunk } from "../../store/settlements";
import { useDispatch } from "react-redux";
import './AddMemberModal.css'

function AddMemberModal({ group, users }) {
  const { closeModal } = useModal();
  const [search, setSearch] = useState("");
  const [userName, setUserName] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const dispatch = useDispatch();
  const groupMembers = group.members;

  const handleSearchChange = (e) => {
    const lowercaseSearch = e.target.value.toLowerCase();
    setSearch(lowercaseSearch);
  };

  useEffect(() => {
    const errorsObject = {};
    if (!userName) {
      errorsObject.userName = "You must select a user ";
    }
    if (groupMembers && groupMembers.includes(userName)) {
      errorsObject.userName = "User is already a member in this group";
    }
    setValidationErrors(errorsObject);
  }, [groupMembers, userName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (Object.values(validationErrors).length) {
      return null;
    }
    setValidationErrors({});
    dispatch(addGroupMemberThunk(group.id, userName)).then(() => {
      closeModal();
      dispatch(getAllGroupsThunk());
      dispatch(getAllGroupExpensesRoutes(group.id));
      dispatch(getAllGroupBalancesThunk(group.id));
      dispatch(getGroupSettlementThunk(group.id));
    });
  };

  const matchingUsers = Object.values(users).filter((user) =>
    user.username.toLowerCase().includes(search)
  );

  return (
    <div className="mainContainer">
      <form onSubmit={handleSubmit}>
        <div className="add-member-header">Search for a user to add to group</div>
        <div className="add-member-warning">FYI: you can't add or remove group members once you start recording expenses.</div>
        <div className="add-member-input">
        <input
          className="add-member-input"
          placeholder="Search for a username"
          value={search}
          onChange={handleSearchChange}
        />
        {search.length > 0 &&
          matchingUsers.length > 0 &&
          matchingUsers.map((user) => (
            <div className={userName === user.username ? "highlighted user" : "user"} onClick={() => setUserName(user.username)} key={user.id}>
              {user.username}
            </div>
          ))}
        {search.length > 0 && matchingUsers.length === 0 && (
          <div>No users found, please try again</div>
        )}
        {submitted && validationErrors.userName && (
          <p className="error">{validationErrors.userName}</p>
        )}
        </div>
        <button className="signUpButton" type="submit">Add member to group</button>
      </form>
    </div>
  );
}

export default AddMemberModal;

import React, { useState, useEffect } from "react";
import { useModal } from "../../context/Modal";
import { addGroupMemberThunk, getAllGroupsThunk } from "../../store/groups";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import './AddMemberModal.css'

function AddMemberModal({ group, users }) {
  const { closeModal } = useModal();
  const [search, setSearch] = useState("");
  const [userName, setUserName] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const groupMembers = group.members;

  const handleSearchChange = (e) => {
    const lowercaseSearch = e.target.value.toLowerCase();
    setSearch(lowercaseSearch);
  };

  useEffect(() => {
    const errorsObject = {};
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
      history.push(`/groups/${group.id}`);
    });
  };

  const matchingUsers = Object.values(users).filter((user) =>
    user.username.toLowerCase().includes(search)
  );

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Search for a user to add to group</h2>
        <input
          placeholder="Search for a username"
          value={search}
          onChange={handleSearchChange}
        />
        {search.length > 0 &&
          matchingUsers.length > 0 &&
          matchingUsers.map((user) => (
            <div className={userName === user.username ? "highlighted" : ""} onClick={() => setUserName(user.username)} key={user.id}>
              {user.username}
            </div>
          ))}
        {search.length > 0 && matchingUsers.length === 0 && (
          <div>No users found, please try again</div>
        )}
        {submitted && validationErrors.userName && (
          <p className="error">{validationErrors.userName}</p>
        )}
        <button type="submit">Add member to group</button>
      </form>
    </div>
  );
}

export default AddMemberModal;

import React, { useState } from "react";
import { useModal } from "../../context/Modal";
import { addGroupMemberThunk } from "../../store/groups";
import { useParams } from 'react-router-dom/cjs/react-router-dom.min'
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";

function AddMemberModal({ group, users }) {
  const { closeModal } = useModal();
  const [search, setSearch] = useState("");
  const [userName, setUserName ] = useState("")
  console.log(userName)
  const dispatch = useDispatch();
  const history = useHistory();

  const handleSearchChange = (e) => {
    const lowercaseSearch = e.target.value.toLowerCase();
    setSearch(lowercaseSearch);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch(addGroupMemberThunk(group.id, userName))
    .then(() => {
        closeModal();
        history.push(`/groups/${group.id}`)
    })
  };

  const matchingUsers = Object.values(users).filter((user) =>
    user.username.toLowerCase().includes(search)
  );

  return (
    <div>
        <form onSubmit={handleSubmit}>
      <input
        placeholder="Search for a username"
        value={search}
        onChange={handleSearchChange}
      />
      {search.length > 0 &&
        matchingUsers.length > 0 &&
        matchingUsers.map((user) => (
          <div 
          onClick={() => setUserName(user.username)}
          key={user.id}> 
          {user.username} 
          </div>
        ))}
        <button type="submit">
          Add member to group
        </button>
      </form>
    </div>
  );
}

export default AddMemberModal;
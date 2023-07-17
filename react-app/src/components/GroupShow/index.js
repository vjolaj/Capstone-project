import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";
import "./GroupShow.css";
import {
  createGroupThunk,
  getAllGroupsThunk,
  readSingleGroupThunk,
  editGroupThunk
} from "../../store/groups";
import { getAllUsersThunk } from "../../store/users";
import OpenModalButton from "../OpenModalButton";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import AddMemberModal from "../AddMemberModal";
import DeleteMemberModal from "../DeleteMemberModal";
import DeleteGroupModal from "../DeleteGroupModal";

const GroupShow = () => {
  const { groupId } = useParams();
  const dispatch = useDispatch();
  const [editMode, setEditMode] = useState(false);
  const group = useSelector((state) => state.groups.allGroups[groupId]);
  // const group = useSelector((state) => state.groups.singleGroup)
  const [description, setDescription] = useState("");
  const history = useHistory();

  useEffect(() => {
    if (group) {
      setDescription(group.description || "");
    }
  }, [group]);


  useEffect(() => {
    dispatch(getAllGroupsThunk());
    dispatch(readSingleGroupThunk(groupId))
  }, [dispatch, groupId]);

  const users = useSelector((state) => state.users.users);
  // console.log(users)
  useEffect(() => {
    dispatch(getAllUsersThunk());
  }, [dispatch]);

  const handleDescriptionChange = async (e) => {
    e.preventDefault();
    dispatch(editGroupThunk(description, group.id))
    .then(() => {
      setEditMode(false)
      dispatch(getAllGroupsThunk());
      history.push(`/groups/${group.id}`)
  })
  };

  if (!group) return null;

  return (
    <div>
      <div>
        
        Group:
        <div>
          <img className = "groupImage" src={group.imageUrl} alt="img" />
          <div>
            <OpenModalButton
              buttonText="Delete Group"
              modalComponent={<DeleteGroupModal group={group} />}
            />
          </div>
          <div>Group name: {group.group_name}</div>
          {editMode ? (
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          ) : (
            <div> Group description: {group.description}</div>
          )}
          {editMode ? (
            <button onClick={handleDescriptionChange}>Save description</button>
          ) : (
            <button onClick={() => setEditMode(true)}>
              Edit description
            </button>
          )}
          <div>
            Group members:
            {group.members.map((member) => (
              <div key={member.id}>
                <div>{member}</div>
                <OpenModalButton
                  buttonText="Remove Member"
                  modalComponent={
                    <DeleteMemberModal group={group} member={member} />
                  }
                />
              </div>
            ))}
          </div>
          <div>
            <OpenModalButton
              buttonText="Add a Member"
              modalComponent={<AddMemberModal group={group} users={users} />}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default GroupShow;

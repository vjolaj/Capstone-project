import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";
import "./GroupShow.css";
import { createGroupThunk, getAllGroupsThunk, readSingleGroupThunk } from "../../store/groups";
import { getAllUsersThunk } from "../../store/users";
import OpenModalButton from "../OpenModalButton";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import AddMemberModal from "../AddMemberModal";

const GroupShow = () => {
    const { groupId } = useParams()
    const dispatch = useDispatch();
    const group = useSelector(
        (state) => state.groups.allGroups[groupId]
      );
    console.log(group)
    
      useEffect(() => {
        dispatch(getAllGroupsThunk());
        // dispatch(readSingleGroupThunk(groupId))
      }, []);

      const users = useSelector(
        (state) => state.users.users
      )
    // console.log(users)
      useEffect(() => {
          dispatch(getAllUsersThunk());
        }, [dispatch]);
    
      if (!group) return null;
      return (
        <div>
            <div> Group:
                    <div >
                        <img src={group.imageUrl} alt="img"/>
                        <div>Group name: {group.group_name}</div>
                        <div> Group description: {group.description}</div>
                        <div>Group members:{group.members.map((member) => (
                            <div key={member.id}>
                                <div>{member}</div>
                            </div>
                        ))}</div>
                        <div className="deleteRestaurantButton">
                        <OpenModalButton
                          buttonText="Add a Member"
                          modalComponent={
                            <AddMemberModal group={group} users={users} />
                          }
                        />
                        </div>
                    </div>
            </div>
        </div>
      )

    }
    export default GroupShow;
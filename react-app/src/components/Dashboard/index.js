import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { getAllGroupsThunk } from "../../store/groups";

const Dashboard = () => {
    const dispatch = useDispatch();
    const groups = useSelector((state) => state.groups.allGroups);
    // console.log("COMPONENT", groups)

    useEffect(() => {
        dispatch(getAllGroupsThunk());
      }, [dispatch]);
    
      if (!groups) return null;

      return (
        <div>
            <div> Groups you are a part of:
                {Object.values(groups).map((group) => (
                    <div key={group.id}>
                        <img src={group.imageUrl} alt="img"/>
                        <div>Group name: {group.group_name}</div>
                        <div> Group description: {group.description}</div>
                        <div>Group members:{group.members.map((member) => (
                            <div key={member.id}>
                                <div>{member}</div>
                            </div>
                        ))}</div>
                    </div>
                ))}
            </div>
        </div>
      )
}

export default Dashboard;
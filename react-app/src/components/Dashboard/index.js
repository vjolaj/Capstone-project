import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory } from "react-router-dom";
import { getAllGroupsThunk } from "../../store/groups";
import { getAllPaymentsThunk } from "../../store/payments";
import "./Dashboard.css";

const Dashboard = () => {
  const dispatch = useDispatch();
  const groups = useSelector((state) => state.groups.allGroups);
  const user_payments = useSelector((state) => state.payments.userPayments);
  const current_user = useSelector((state) => state.session.user);
  const history = useHistory();

  const payments_to_user = Object.values(user_payments).filter(
    (payment) => payment.payee_id == current_user.id
  );

  const payments_by_user = Object.values(user_payments).filter(
    (payment) => payment.payer_id == current_user.id
  );

  useEffect(() => {
    dispatch(getAllGroupsThunk());
    dispatch(getAllPaymentsThunk());
  }, [dispatch]);

  if (!groups) return null;

  return (
    <div>
      <div>
        <h4>Your Payment History</h4>
        <div>Payments made to you:</div>
        {Object.values(payments_to_user).length === 0 ? (
          <div>You have received no payments.</div>
        ) : (
          Object.values(payments_to_user).map((payment) => (
            <div key={payment.id}>
              <div>
                {payment.payer_username} made a ${payment.amount}{" "}
                {payment.method} payment to you on {payment.paid_at}
              </div>
            </div>
          ))
        )}
        <div>Payments made by you:</div>
        {Object.values(payments_by_user).length === 0 ? (
          <div>You have made no payments.</div>
        ) : (
          Object.values(payments_by_user).map((payment) => (
            <div key={payment.id}>
              <div>
                You made a ${payment.amount} {payment.method} payment to{" "}
                {payment.payee_username} on {payment.paid_at}
              </div>
            </div>
          ))
        )}
      </div>
      <button onClick={() => history.push("/groups/new")}>
        Create New Group
      </button>
      <div>
        <h4>Groups you are a part of:</h4>
        {Object.values(groups).map((group) => (
          <div key={group.id}>
            <NavLink to={`/groups/${group.id}`}>
              <img className="groupImage" src={group.imageUrl} alt="img" />
              <div>Group name: {group.group_name}</div>
              <div> Group description: {group.description}</div>
              <div>
                Group members:
                {group.members.map((member) => (
                  <div key={member.id}>
                    <div>{member}</div>
                  </div>
                ))}
              </div>
            </NavLink>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

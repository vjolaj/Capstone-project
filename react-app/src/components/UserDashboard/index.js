import React, {useState} from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllGroupsThunk } from "../../store/groups";
import { getAllPaymentsThunk } from "../../store/payments";
import "./UserDashboard.css";


const UserDashboard = ({ onGroupSelection }) => {
  const dispatch = useDispatch();
  const groups = useSelector((state) => state.groups.allGroups);
  const user_payments = useSelector((state) => state.payments.userPayments);
  const current_user = useSelector((state) => state.session.user);




  const payments_to_user = Object.values(user_payments).filter(
    (payment) => payment.payee_id === current_user.id
  );

  const payments_by_user = Object.values(user_payments).filter(
    (payment) => payment.payer_id === current_user.id
  );

  const convertDate = (date) => {
    const newDate = new Date(date)
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const convertedDate = newDate.toLocaleString('en-US', options);
    return convertedDate
}


  useEffect(() => {
    dispatch(getAllGroupsThunk());
    dispatch(getAllPaymentsThunk());
  }, [dispatch]);

  if (!groups) return null;

  return (
    <>
      <div>
        <div className="payments-text">Your Payment History</div>
        <div className="payments-made-text">Payments made to you:</div>
        {Object.values(payments_to_user).length === 0 ? (
          <div>You have received no payments.</div>
        ) : (
          Object.values(payments_to_user).map((payment) => (
            <div key={payment.id}>
              <div className="payment-received-div">
              <i className="fa-solid fa-hand-holding-dollar payment-icon"></i>
                {payment.payer_username} made a ${parseFloat(payment.amount).toFixed(2)}{" "}
                {payment.method} payment to you on {convertDate(payment.paid_at)}.
              </div>
            </div>
          ))
        )}
        <div className="payments-received-text" >Payments made by you:</div>
        {Object.values(payments_by_user).length === 0 ? (
          <div>You have made no payments.</div>
        ) : (
          Object.values(payments_by_user).map((payment) => (
            <div key={payment.id}>
              <div className="payment-made-div">
                <i className="fa-solid fa-dollar-sign payment-icon" ></i>
                You made a ${parseFloat(payment.amount).toFixed(2)} {payment.method} payment to{" "}
                {payment.payee_username} on {convertDate(payment.paid_at)}.
              </div>
            </div>
          ))
        )}
      </div>
      <div>
        <div className="user-dashboard-text">Groups you are a part of:</div>
        {Object.values(groups) === 0 ?
        <div>No groups, yet!</div> : <ul className="groups-list">
        {Object.values(groups).map((group) => (
          <li className='individual-Group-Img' key={group.id}>
              <img className="imageOverlay" src={group.imageUrl} alt="Group" />
              <div onClick={() => onGroupSelection(group.id)} className="group-info">
              <div>{group.group_name}</div>
              <div className="group-members">
                {group.members.map((member) => (
                  <div key={member.id}>
                    <div>{member}</div>
                  </div>
                ))}
              </div>
              </div>
          </li>
        ))}
        </ul>}
      </div>
    </>
  );
};

export default UserDashboard;
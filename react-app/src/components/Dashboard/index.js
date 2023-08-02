import React, { useState, useRef } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getAllGroupsThunk } from "../../store/groups";
import { getAllPaymentsThunk } from "../../store/payments";
import { logout } from "../../store/session";
import "./Dashboard.css";
import BalanceImg from "../../assets/Balance.png";
import NewGroup from "../NewGroup";
import GroupShow from "../GroupShow";
import UserDashboard from "../UserDashboard";


const Dashboard = () => {
  const dispatch = useDispatch();
  const groups = useSelector((state) => state.groups.allGroups);
  const history = useHistory();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  const handleNavigationClick = (view) => {
    setCurrentView(view);
  };

  const handleGroupSelection = (groupId) => {
    setSelectedGroupId(groupId);
  };


  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
    history.push("/");
  };


  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };


  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  useEffect(() => {
    dispatch(getAllGroupsThunk());
    dispatch(getAllPaymentsThunk());
  }, [dispatch]);

  if (!groups) return null;

  return (
    <div className="main-container">
      <div className="dashboard-container">
        <div className="dashboard-navigation">
          <li className="nav-title">
            <a onClick={() => handleNavigationClick('dashboard')}>
              <span className="icon"> <i className="fa-solid fa-user"></i></span>
              <span className="title">My Dashboard</span>
            </a>
          </li>
          <li className="nav-title">
            <a onClick={() => handleNavigationClick('newGroup')}>
              <span className="icon"> <i className="fa-solid fa-circle-plus"></i></span>
              <span className="title">Create a Group</span>
            </a>
          </li>
          <li className="nav-title">
            <a >
              <span className="icon">
              <i className="fa-solid fa-users-rectangle"></i>
              </span>
              <span onClick={openMenu} className="title">My groups</span>
              <div>
              {Object.values(groups).map((group) => (
                <li className={ulClassName} ref={ulRef} key={group.id}>
                    <div onClick={() => {handleNavigationClick('groupShow'); handleGroupSelection(group.id)}}>{group.group_name}</div>
                </li>
              ))}
              </div>
            </a>
          </li>
          <li className="nav-title">
            <a onClick={handleLogout}>
              <span className="icon">
              <i className="fa-solid fa-arrow-right-from-bracket"></i>
              </span>
              <span className="title">Log Out</span>
            </a>
          </li>
          <img
          className="balance-img"
          src={BalanceImg}
          alt="Main Page Splitzies Illustration"
        />
        </div>
      </div>
      <div className='info-container'>
      {currentView === 'newGroup' && <NewGroup setCurrentView={setCurrentView}/>}
      {currentView === 'groupShow' && selectedGroupId && (
          <GroupShow groupId={selectedGroupId} setCurrentView={setCurrentView}/>
        )}
      {currentView === 'dashboard' && <UserDashboard />}
      </div>
    </div>
  );
};

export default Dashboard;

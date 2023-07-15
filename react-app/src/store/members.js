const ADD_GROUP_MEMBER = "/group/members";
const DELETE_GROUP_MEMBER = "/group/members/delete";


export const addGroupMember = (groupMember) => {
    return {
        type: ADD_GROUP_MEMBER,
        groupMember,
    }    
}

export const removeGroupMember = () =>{
    return {
        type: DELETE_GROUP_MEMBER
    }
}


export const addGroupMemberThunk = (groupId, username) => async (dispatch) => {
    try {
        const res = await fetch(`/api/groups/${groupId}/members`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username
        })
        });
    
        if (res.ok) {
          const { group } = await res.json();
          dispatch(addGroupMember(group));
        } else {
          const errorMessage = await res.text();
          throw new Error(errorMessage);
        }
      } catch (error) {
      }
};

const initialState = {
  groupMembers: {},
};

const membersReducer = (state = initialState, action) => {
let newState;
  switch (action.type) {
    // case GET_ALL_MENU_ITEMS:
    //   return {
    //     ...state,
    //     allMenuItems: action.menuItems,
    //   };
    case ADD_GROUP_MEMBER:
        return {
            ...state,
            // groupMembers: action.groupMembers,
          };
    // case CLEAR_ITEMS:
    //   return{...state, singleMenuItem:{}}
    default:
      return state;
  }
};

export default membersReducer;
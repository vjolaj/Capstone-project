//constants
const GET_ALL_GROUPS = "/groups/GET/all";
const GET_SINGLE_GROUP = "/groups/GET/single";
const DELETE_SINGLE_GROUP = "/groups/DELETE/single";
const ADD_GROUP_MEMBER = "/group/members";


//action creators
const readAllGroupsAction = (groups) => {
    return {
      type: GET_ALL_GROUPS,
      groups,
    };
  };
  
  const readSingleGroupAction = (group) => {
    return {
      type: GET_SINGLE_GROUP,
      group,
    };
  };
  
  const deleteGroupAction = (group) => {
    return {
      type: DELETE_SINGLE_GROUP,
      group,
    };
  };

  export const addGroupMember = (groupMember) => {
    return {
        type: ADD_GROUP_MEMBER,
        groupMember,
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


  export const getAllGroupsThunk = () => async (dispatch) => {
    const res = await fetch("/api/groups/current");

    const data = await res.json();
  
    const normalizedData = {};
    Object.values(data.user_groups).forEach((group) => {
      normalizedData[group.id] = group;
    });
  
    dispatch(readAllGroupsAction(normalizedData));
    return data;
  };
  
  export const readSingleGroupThunk = (group) => async (dispatch) => {
    dispatch(readSingleGroupAction(group));
  
    return group;
  
  };

  export const createGroupThunk = (group) => async (dispatch) => {
  try {
    const res = await fetch("/api/groups/new", {
      method: "POST",
      body: group,
    });

    if (res.ok) {
      const { resGroup } = await res.json();
      dispatch(readSingleGroupAction(resGroup));
    } else {
      const errorMessage = await res.text();
      throw new Error(errorMessage);
    }
  } catch (error) {
  }
};

const initialState = {
    singleGroup: {},
    allGroups: [],
    groupMembers: {}
  };
  
  const groupsReducer = (state = initialState, action) => {
    switch (action.type) {
      case GET_ALL_GROUPS:
        return {
          ...state,
          allGroups: action.groups,
        };
            case ADD_GROUP_MEMBER:
        return {
            ...state,
            groupMembers: action.groupMembers,
          };
      case GET_SINGLE_GROUP:
        return {
          ...state,
          singleGroup: action.group,
        };
      case DELETE_SINGLE_GROUP:
        const newState = {
          ...state,
          allGroups: { ...state.allGroups },
        };
        delete newState.allGroups[action.id];
        return newState;
      default:
        return state;
    }
  };
  
  
  export default groupsReducer;
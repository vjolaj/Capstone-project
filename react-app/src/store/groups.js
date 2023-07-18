//constants
const GET_ALL_GROUPS = "/groups/GET/all";
const GET_SINGLE_GROUP = "/groups/GET/single";
const DELETE_SINGLE_GROUP = "/groups/DELETE/single";
const ADD_GROUP_MEMBER = "/group/members";
const DELETE_GROUP_MEMBER = "/group/members/DELETE";

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
  };
};

export const deleteGroupMember = (groupMember) => {
  return {
    type: DELETE_GROUP_MEMBER,
    groupMember,
  };
};

export const addGroupMemberThunk = (groupId, username) => async (dispatch) => {
  try {
    const res = await fetch(`/api/groups/${groupId}/members`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
      }),
    });

    if (res.ok) {
      const { data } = await res.json();
      dispatch(addGroupMember(data));
    } else {
      const errorMessage = await res.text();
      throw new Error(errorMessage);
    }
  } catch (error) {}
};

export const deleteGroupMemberThunk =
  (groupId, username) => async (dispatch) => {
    const res = await fetch(`/api/groups/${groupId}/members`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
      }),
    });

    const data = await res.json();

    dispatch(deleteGroupMember(data));

    return data;
  };

  export const deleteGroupThunk = (groupId) => async (dispatch) => {
    const res = await fetch(`/api/groups/${groupId}/delete`, {
      method: "DELETE"
    });

    const data = await res.json();

    dispatch(deleteGroupAction(groupId));

    return data;
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


export const readSingleGroupThunk = (groupId) => async (dispatch) => {
  const res = await fetch(`/api/groups/${groupId}`);
  const { resGroup } = await res.json();
  if (res.ok) {
    dispatch(readSingleGroupAction(resGroup))
    return resGroup;
} else {
    const errorData = await res.json()
    return errorData
}

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
  } catch (error) {}
};

export const editGroupThunk = (description, groupId) => async (dispatch) => {
  try {
    const res = await fetch(`/api/groups/${groupId}/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description: description,
      }),
    });

    if (res.ok) {
      const { resUpdatedGroup } = await res.json();
      dispatch(readSingleGroupAction(resUpdatedGroup));
      return resUpdatedGroup
    } else {
      const errorMessage = await res.text();
      throw new Error(errorMessage);
    }
  } catch (error) {}
};

const initialState = {
  singleGroup: {},
  allGroups: [],
  groupMembers: {},
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
    case DELETE_GROUP_MEMBER:
      const newMemberState = {
        ...state,
        groupMembers: { ...state.groupMembers },
      };
      delete newMemberState.groupMembers[action.id];
      return newMemberState;
    default:
      return state;
  }
};

export default groupsReducer;

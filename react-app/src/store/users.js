const GET_ALL_USERS = "/users/GET/all";

const readAllUsersAction = (users) => {
  return {
    type: GET_ALL_USERS,
    payload: users,
  };
};

export const getAllUsersThunk = () => async (dispatch) => {
  try {
    const response = await fetch("/api/users/");

    if (response.ok) {
      const data = await response.json();
      dispatch(readAllUsersAction(data));
    }
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

const initialState = {
  users: {},
};

export default function usersReducer(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_USERS:
      const newState = {users: {}}
            action.payload.forEach(user => newState.users[user.id] = user)
            return newState
    default:
      return state;
  }
}
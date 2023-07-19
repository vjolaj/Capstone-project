const GET_ALL_USERS = "/users/GET/all";

const readAllUsersAction = (users) => {
  return {
    type: GET_ALL_USERS,
    users,
  };
};

export const getAllUsersThunk = () => async (dispatch) => {
  try {
    const response = await fetch("/api/users/");

    if (response.ok) {
      const data = await response.json();
      const normalizedData = {};
    Object.values(data.users).forEach((user) => {
      normalizedData[user.id] = user;
    });
      dispatch(readAllUsersAction(normalizedData));
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
      return {
        ...state,
        users: action.users
      }
    default:
      return state;
  }
}
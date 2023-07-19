//constants
const GET_GROUP_BALANCES = "/groups/balances/all";
const GET_GROUP_SETTLEMENT = "/group/get/settlement"


//action creators
const readGroupBalancesAction = (group) => {
  return {
    type: GET_GROUP_BALANCES,
    group,
  };
};

const readGroupSettlementAction = (group) => {
    return {
        type: GET_GROUP_SETTLEMENT,
        group,
      };
}

export const getAllGroupBalancesThunk = (groupId) => async (dispatch) => {
    const res = await fetch(`/api/groups/${groupId}/balances`);
  
    const data = await res.json();

  const normalizedData = {};
  Object.entries(data.balances).forEach(([key, value]) => {
    normalizedData[key] = parseFloat(value); 
  });

  dispatch(readGroupBalancesAction(normalizedData));
  return data;
  };

  export const getGroupSettlementThunk = (groupId) => async (dispatch) => {
    const res = await fetch(`/api/settlements/${groupId}`);
  
    const data = await res.json();

  const normalizedData = {};
  Object.values(data.settlements).forEach((settlement) => {
    normalizedData[settlement.id] = settlement;
  });

  dispatch(readGroupSettlementAction(normalizedData));
  return data;
  };
  
  export const makeNewSettlementThunk = (settlementId, method) => async (dispatch) => {
    const res = await fetch(`/api/settlements/${settlementId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          method: method,
        }),
    })
    const data = await res.json();
    dispatch(readGroupSettlementAction(data))
    return data
  }
  
  const initialState = {
    balances: {},
    settlements:{}
  };
  
  const settlementsReducer = (state = initialState, action) => {
    switch (action.type) {
      case GET_GROUP_BALANCES:
        return {
          ...state,
          balances: action.group,
        };
        case GET_GROUP_SETTLEMENT:
            return {
              ...state,
              settlements: action.group,
            };
      default:
        return state;
    }
  };
  
  export default settlementsReducer;
  
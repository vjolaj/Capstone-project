//constants
const GET_ALL_PAYMENTS = "/payments/GET/all";

const readAllPaymentsAction = (data) => {
    return {
      type: GET_ALL_PAYMENTS,
      payload: data
    };
  };

  export const getAllPaymentsThunk = () => async (dispatch) => {
    const res = await fetch("/api/settlements/history");
  
    const data = await res.json();
  
    const normalizedData = {};
    Object.values(data.user_payments_paid).forEach((payment_paid) => {
      normalizedData[payment_paid.id] = payment_paid;
    });
    Object.values(data.user_payments_received).forEach((payment_received) => {
        normalizedData[payment_received.id] = payment_received;
      });
  
    dispatch(readAllPaymentsAction(normalizedData));
    return data;
  };
  
  const initialState = {
    userPayments: {}
  };

  const paymentsReducer = (state = initialState, action) => {
    switch (action.type) {
      case GET_ALL_PAYMENTS:
        return {
          ...state,
          userPayments: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default paymentsReducer;
  
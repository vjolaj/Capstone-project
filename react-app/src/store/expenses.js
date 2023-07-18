//constants
const GET_GROUP_EXPENSES = "/groups/expenses/all";



//action creators
const readGroupExpensesAction = (group) => {
    return {
      type: GET_GROUP_EXPENSES,
      group,
    };
  };
  
//thunks
export const getAllGroupExpensesRoutes = (groupId) => async (dispatch) => {
    const res = await fetch(`/api/expenses/${groupId}`);
  
    const data = await res.json();
  
    const normalizedData = {};
    Object.values(data.group_expenses).forEach((expense) => {
      normalizedData[expense.id] = expense;
    });
  
    dispatch(readGroupExpensesAction(normalizedData));
    return data;
  };

  export const createExpenseThunk = (groupId, expense) => async (dispatch) => {
    try {
      const res = await fetch(`/api/expenses/${groupId}/new`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            amount: expense.amount,
            category: expense.expenseCategory,
            description: expense.description
        })
      });
  
      if (res.ok) {
        const { resExpense } = await res.json();
        dispatch(readGroupExpensesAction(resExpense));
      } else {
        const errorMessage = await res.text();
        throw new Error(errorMessage);
      }
    } catch (error) {
    }
  };

  export const editExpenseThunk = (expenseId, expense) => async (dispatch) => {
    try {
      const res = await fetch(`/api/expenses/${expenseId}/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({
        amount: expense.amount,
        category: expense.expenseCategory,
        description: expense.description
      })
      });
  
      if (res.ok) {
        const { resUpdatedExpense } = await res.json();
        dispatch(readGroupExpensesAction(resUpdatedExpense));
      } else {
        const errorMessage = await res.text();
        throw new Error(errorMessage);
      }
    } catch (error) {
    }
  };

const initialState = {
    groupExpenses: {}
}

const expensesReducer = (state = initialState, action) => {
    switch (action.type) {
      case GET_GROUP_EXPENSES:
        return {
          ...state,
          groupExpenses: action.group,
        };
      default:
        return state;
    }
  };
  
  export default expensesReducer;
  
from collections import defaultdict

from app.models.expense import Expense
from app.models.groupmember import GroupMember
from app.models.payments import Payment
from app.models.settlement_transaction import SettlementTransaction
from app.models import db
from app.models.user import User

######## HELPERS #########

def get_amounts_expended_per_member(group_id):
    """
    Returns a dictionary of {'user_id': amount_expended}
    Only adds up expenses, does not consider any settlements
    """
    expenses = Expense.query.filter_by(group_id=group_id)
    amounts_expended_per_member = defaultdict(int)
    # loop over expenses, sum up total amount paid per user
    for expense in expenses:
        payer = expense.creator_id
        amount = expense.amount
        amounts_expended_per_member[payer] += amount
    return amounts_expended_per_member

def any_balance_nonzero(consolidated_balances):
    """
    If there are any balances more than 0.01 (floating point problem) return False
    """
    for member in consolidated_balances:
        if abs(round(consolidated_balances[member],2)) > 0.001:
            return True
    return False

def get_settled_amount_for_member(group_id, user_id, is_payer):
    """
    For a given member in a group, gets how much they paid/received in settlements
    """
    if is_payer:
        settlements = Payment.query.filter_by(group_id=group_id).filter_by(payer_id=user_id).all()
        # settlements = SettlementTransaction.query.filter_by(group_id=group_id).filter_by(payer_id=user_id).filter_by(is_settled=True).all()
    else:
        settlements = Payment.query.filter_by(group_id=group_id).filter_by(payee_id=user_id).all()
        # settlements = SettlementTransaction.query.filter_by(group_id=group_id).filter_by(payee_id=user_id).filter_by(is_settled=True).all()
    return sum([settlement.amount for settlement in settlements])

    

######## MAIN LOGIC #########

def get_consolidated_balances(group_id):
    """
    Returns dictionary of {'user_id': balance} where balance is negative if they owe any money
    This is after all group expenses and any settlements
    """
    # Get the average expenses per member (total spent on expenses / number of members)
    amounts_expended_per_member = get_amounts_expended_per_member(group_id)
    total_amount_spent_in_group = sum(amounts_expended_per_member.values())
    group_members = [member.user_id for member in GroupMember.query.filter_by(group_id = group_id).all()]
    number_of_group_members =  len(group_members)
    amount_owed_per_member_for_expenses = total_amount_spent_in_group/number_of_group_members
    
    # now calculate the difference between total spent per member and average expenses
    # also take into account the settlements in the group
    amounts_outstanding = {}
    # total_amount_accounted_decimal = 0
    for i, member in enumerate(group_members):
        # user = User.query.get(member)
        amount_expended_by_member = amounts_expended_per_member.get(member, 0)
        settlements_received_by_member = get_settled_amount_for_member(group_id, member, is_payer=False)
        settlements_paid_by_member = get_settled_amount_for_member(group_id, member, is_payer=True)
        
        amount_outstanding = amount_expended_by_member + settlements_paid_by_member - amount_owed_per_member_for_expenses - settlements_received_by_member
        # total_amount_accounted_decimal += amount_outstanding
        # if i == len(group_members) -1 and total_amount_accounted_decimal != total:
        #     amount_outstanding += get_decimal_adjustment()
        amounts_outstanding[member] = amount_outstanding# if amount_outstanding > 0.01 else 0
    
    return amounts_outstanding




def update_settlement_transactions(group_id):
    """
    Returns a dictionary of dictionaries, where the key for toplevel is the payer,
    the key for bottom level is the payee, the value for the bottom level is the amount
    {'user_1': {'user_2': 10, 'user_3':30}, 'user_2': {'user_4':5}}
    
    """
    consolidated_balances = get_consolidated_balances(group_id)
    existing_settlement_transactions = SettlementTransaction.query.filter_by(group_id=group_id).all()
    
    # settlements_dict = defaultdict(dict)
    settlement_transactions = []
    i = 0
    while any_balance_nonzero(consolidated_balances):
        print("🥳")
        print(consolidated_balances)
        if i == 10:
            raise Exception("now we stop")
        i += 1
        # we want to use the maximum positive and negative balances for the transactions
        max_positive_balance_user = max(consolidated_balances, key = lambda x: consolidated_balances[x])
        max_negative_balance_user = min(consolidated_balances, key = lambda x: consolidated_balances[x])
        
        if abs(consolidated_balances[max_negative_balance_user]) >= consolidated_balances[max_positive_balance_user]:
            amount_for_settlement = consolidated_balances[max_positive_balance_user]
        else: # scenario = -100 // +200
            amount_for_settlement = abs(consolidated_balances[max_negative_balance_user])
            
        consolidated_balances[max_negative_balance_user] += amount_for_settlement
        consolidated_balances[max_positive_balance_user] -= amount_for_settlement
        # settlements_dict[max_negative_balance_user][max_positive_balance_user] = amount_for_settlement
        
        # settlement_transactions.append(SettlementTransaction(payer_id=max_negative_balance_user, payee_id=max_positive_balance_user, group_id=group_id, amount=amount_for_settlement))
        settlement_transactions.append(SettlementTransaction(payer_id=max_negative_balance_user, payee_id=max_positive_balance_user, group_id=group_id, amount=amount_for_settlement, is_settled=False))
    try:
        SettlementTransaction.query.filter_by(group_id=group_id).delete()
        # SettlementTransaction.add_all(settlement_transactions)
        db.session.add_all(settlement_transactions)
        db.session.commit()
    except:
        SettlementTransaction.query.filter_by(group_id=group_id).delete()
        db.session.add_all(existing_settlement_transactions)
        db.session.commit()
        raise Exception("Issue with updating SettlementTransaction, changes not applied")
        
    # return settlements_dict
            
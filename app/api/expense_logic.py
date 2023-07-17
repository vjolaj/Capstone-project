from collections import defaultdict

from app.models.expense import Expense
from app.models.groupmember import GroupMember


def get_consolidated_balances(group_id):
    expenses = Expense.query.filter_by(group_id=group_id)
    amounts_expended_per_member = defaultdict(int)
    # loop over expenses, sum up total amount paid per user
    for expense in expenses:
        payer = expense.creator_id
        amount = expense.amount
        amounts_expended_per_member[payer] += amount
    
    total_amount_spent_in_group = sum(amounts_expended_per_member.values())
    group_members = [member.user_id for member in GroupMember.query.filter_by(group_id = group_id).all()]
    number_of_group_members =  len(group_members)
    amount_owed_per_member = total_amount_spent_in_group/number_of_group_members
    
    amounts_outstanding = {}
    for member in group_members:
        amount_paid_by_member = amounts_expended_per_member.get(member, 0)
        # amount_paid_by_member += all_settled_payments_from_member_in_group()
        amount_outstanding = amount_paid_by_member - amount_owed_per_member # negative values means they owe money
        amounts_outstanding[member] = amount_outstanding
    
    return amounts_outstanding

def any_balance_nonzero(consolidated_balances):
    """
    If there are any non zero balances return False
    """
    for member in consolidated_balances:
        if consolidated_balances[member] != 0:
            return True
    return False


def get_settlement_transactions(group_id):
    """
    Returns a dictionary of dictionaries, where the key for toplevel is the payer,
    the key for bottom level is the payee, the value for the bottom level is the amount
    {'user_1': {'user_2': 10, 'user_3':30}, 'user_2': {'user_4':5}}
    
    """
    consolidated_balances = get_consolidated_balances(group_id)
    
    settlements_dict = defaultdict(dict)
    # settlement_transactions = []
    while any_balance_nonzero(consolidated_balances):
        # we want to use the maximum positive and negative balances for the transactions
        max_positive_balance_user = max(consolidated_balances, key = lambda x: consolidated_balances[x])
        max_negative_balance_user = min(consolidated_balances, key = lambda x: consolidated_balances[x])
        
        if abs(consolidated_balances[max_negative_balance_user]) >= consolidated_balances[max_positive_balance_user]:
            amount_for_settlement = consolidated_balances[max_positive_balance_user]
        else: # scenario = -100 // +200
            amount_for_settlement = abs(consolidated_balances[max_negative_balance_user])
            
        consolidated_balances[max_negative_balance_user] += amount_for_settlement
        consolidated_balances[max_positive_balance_user] -= amount_for_settlement
        settlements_dict[max_negative_balance_user][max_positive_balance_user] = amount_for_settlement
        # settlement_transactions.append(SettlementTransaction(payer_id=max_negative_balance_user, payee_id=max_positive_balance_user, group_id=group_id, amount=amount_for_settlement))
        
    #SettlmentTransactions.delete_bulk(group_id=group_id)
    #Settlement.add_buk(settlement_transactions)
        
    return settlements_dict
            
            
        
        
        
        
        
        
        
        
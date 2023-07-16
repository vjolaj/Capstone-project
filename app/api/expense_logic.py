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
        amount_outstanding = amount_paid_by_member - amount_owed_per_member # negative values means they owe money
        amounts_outstanding[member] = amount_outstanding
    
    return amounts_outstanding
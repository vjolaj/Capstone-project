from collections import defaultdict

from flask import Blueprint, request
from app.api.expense_logic import update_settlement_transactions
from flask_login import current_user, login_required
from app.models import  db, GroupMember, Expense
from app.forms import ExpenseForm
from .auth_routes import validation_errors_to_error_messages
from .AWS_helpers import get_unique_filename, upload_file_to_s3, remove_file_from_s3

expense_routes = Blueprint("expenses", __name__)

@expense_routes.route('/<int:groupId>')
@login_required
def get_current_expenses(groupId):
    """
    This route will return a list of expenses of the current group.
    """
    current_group_expenses = Expense.query.filter_by(group_id=groupId).all()
    return {"group_expenses":{expense.id: expense.to_dict() for expense in current_group_expenses}}

@expense_routes.route('/<int:groupId>/new', methods=['POST'])
@login_required
def create_new_expense(groupId):
    """
    This route will create a new expense for the current group.
    """
    form = ExpenseForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    
    if not current_user.is_authenticated:
        return {'error': 'unauthorized access'}
    
    groupMembers = GroupMember.query.filter_by(group_id = groupId).all()
    number_of_group_members =  GroupMember.query.filter_by(group_id = groupId).count()

    
    if current_user.id not in [member.user_id for member in GroupMember.query.filter_by(group_id = groupId).all()]:
        return {'error': 'Must be member of group to post a new expense.'}
    
    if form.validate_on_submit():
        image = form.data["imageUrl"]
        image.filename = get_unique_filename(image.filename)
        upload = upload_file_to_s3(image)
        
        new_expense = Expense (
            amount =  form.data['amount'],
            creator_id = current_user.id,
            group_id = groupId,
            description = form.data['description'],
            category = form.data['category'],
            imageUrl= upload['url'],
            # imageUrl = form.data['imageUrl'],
            created_at = db.func.now(),
        )
        db.session.add(new_expense)
        db.session.commit()
        # update settlement transactions now that there's a new transaction
        update_settlement_transactions(groupId)
        return {"expense": new_expense.to_dict()}
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401


@expense_routes.route('/<int:expenseId>/update', methods=['PUT'])
@login_required
def update_expense(expenseId):
    """
    This route will update a group's description, amount, and category.
    """
    expense_to_update = Expense.query.get(expenseId)
    form = ExpenseForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    
    if not current_user.is_authenticated:
        return {'error': 'unauthorized access'}
    
    if current_user.id != expense_to_update.creator_id:
        return {'error': 'Must be owner of this expense to update it.'}
    
    if form.validate_on_submit():
        existing_amount = expense_to_update.amount
        expense_to_update.description = form.data['description']
        expense_to_update.amount = form.data['amount']
        expense_to_update.category = form.data['category']
        db.session.commit()
        # only update settlement transactions if the amount changed
        if existing_amount != form.data['amount']:
            update_settlement_transactions(expense_to_update.group_id)
        return {"expense": expense_to_update.to_dict()}
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401
        
        
    
    
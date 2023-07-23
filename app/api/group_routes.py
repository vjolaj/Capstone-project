from flask import Blueprint, request
from app.api.expense_logic import get_consolidated_balances
from app.models.expense import Expense
from app.models.settlement_transaction import SettlementTransaction
from flask_login import current_user, login_required
from app.models import Group, db, User, GroupMember
from app.forms import GroupForm, MembersForm
from .auth_routes import validation_errors_to_error_messages
from .AWS_helpers import get_unique_filename, upload_file_to_s3, remove_file_from_s3

group_routes = Blueprint("groups", __name__)

@group_routes.route('/current')
@login_required
def get_current_groups():
    """
    This route will return a list of groups (and associated members) the current user is part of.
    """
    current_user_groups = Group.query.join(Group.group_members).filter(GroupMember.user_id == current_user.id).all()
    return {"user_groups":{group.id: group.to_dict() for group in current_user_groups} }

@group_routes.route('/new', methods=['POST'])
@login_required
def create_group():
    """
    This route will create a new group and allow the logged in user to add members to it.
    """
    form = GroupForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    
    if not current_user.is_authenticated:
        return {'error': 'unauthorized access'}
    
    if form.validate_on_submit():
        image = form.data["imageUrl"]
        image.filename = get_unique_filename(image.filename)
        upload = upload_file_to_s3(image)

        new_group = Group (
            group_name = form.data['group_name'],
            description = form.data['description'],
            imageUrl = upload['url'],
            # imageUrl = form.data['imageUrl'],
            creator_id = current_user.id
        )
        
        db.session.add(new_group)
        db.session.add(GroupMember(user=current_user, group=new_group))
        db.session.commit()
        return {"new_group": new_group.to_dict()}
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401
        
@group_routes.route('/<int:groupId>/members', methods=['POST'])
@login_required
def add_members(groupId):
    """
    This route will add a group member to a group.
    """
    group = Group.query.get(groupId)
    groupExpenses = Expense.query.filter_by(group_id=groupId).all()
    if groupExpenses:
        return {'error': "You can't add members once expenses are recorded on the group."}, 403
    
    if current_user.id != group.creator_id:
        return {'error': 'unathorized access'}, 403
    form = MembersForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    
    if not current_user.is_authenticated:
        return {'error': 'unauthorized access'}
    
    if form.validate_on_submit():
        username =  form.data['username']
        user = User.query.filter_by(username=username).first()
        groupmember = GroupMember.query.filter_by(user=user, group=group).first()
        if groupmember:
            return {"error": "user already added to this group"}
        if user is None:
            return {"error": "user does not exist"}, 404
        db.session.add(GroupMember(user=user, group=group))
        db.session.commit()
        return {"group": group.to_dict()}

@group_routes.route('/<int:groupId>/members', methods=['DELETE'])
@login_required
def remove_members(groupId):
    """
    This route will remove a group member from its group.
    """
    group = Group.query.get(groupId)
    per_member_balances = get_consolidated_balances(groupId)
    for value in per_member_balances.values():
        if float(value) != 0:
            return {'error': "You can't remove members if there are unsettled balances."}

    form = MembersForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    
    if current_user.id != group.creator_id:
        return {'error': 'unathorized access'}, 403
    if form.validate_on_submit():
        username = form.data['username']
        user = User.query.filter_by(username=username).first()
        
        if user is None:
            return {"error": "User does not exist"}, 404
        
        groupmember = GroupMember.query.filter_by(user=user, group=group).first()
        
        if groupmember is None:
            return {"error": "Group member does not exist"}, 404

        db.session.delete(groupmember)
        db.session.commit()
        return {'message': 'Group member successfully deleted'}, 200

@group_routes.route("/<int:groupId>/update", methods=['PUT'])
@login_required
def update_group(groupId):
    """
    This route will update a group, specifically it's description.
    """
    group_to_update = Group.query.get(groupId)

    form = GroupForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    form['group_name'].data = group_to_update.group_name
    
    if form.validate_on_submit():
        group_to_update.description = form.data['description']
        db.session.commit()
        return {"updated group": group_to_update.to_dict()}
    return {'errors': validation_errors_to_error_messages(form.errors)}

@group_routes.route("/<int:groupId>/delete", methods=['DELETE'])
@login_required
def delete_group(groupId):
    """
    This route will delete a group.
    """
    group_to_delete = Group.query.get(groupId)
    per_member_balances = get_consolidated_balances(groupId)

    for value in per_member_balances.values():
        if float(value) != 0:
            return {'error': "You can't delete group if there are unsettled balances."}
    if current_user.id != group_to_delete.creator_id:
        return {'error': 'unathorized access'}, 403
    db.session.delete(group_to_delete)
    db.session.commit()
    return {'message': 'group successfully deleted'}, 200


@group_routes.route("/<int:groupId>")
@login_required
def get_single_group_details(groupId):
    """
    This route will return a single group (and associated members).
    """
    group = Group.query.join(Group.group_members).filter(Group.id == groupId).first()
    return {"group": group.to_dict()}
    
    
@group_routes.route("/<int:groupId>/balances")
@login_required
def get_single_group_balances(groupId):
    """
    This route will return the balances of each user within a group.
    """

    per_member_balances = get_consolidated_balances(groupId)
    if per_member_balances is None:
        return {'balances': 'no balances for this group'}
    user_id_to_name_map = {group_member.user.id: group_member.user.username for group_member in GroupMember.query.filter_by(group_id=groupId).all()}
    per_username_balances = {user_id_to_name_map[user_id]: per_member_balances[user_id] for user_id in per_member_balances.keys()}
    return {"balances": per_username_balances}


# @group_routes.route("/<int:groupId>/settlement-page")
# @login_required
# def get_settlement_for_user(groupId):
#     """
#     This route gives the current user his different settlements needed
#     Returns None if no settlements needed
#     """
#     user_settlements = SettlementTransaction.query.filter_by(payer_id=current_user.id).filter_by(group_id=groupId).filter_by(is_settled=False).all()
#     # if user_settlements is None:
#     #     return {}
#     return {"settlements":{user_settlement.payee_id: user_settlement.amount for user_settlement in user_settlements}}
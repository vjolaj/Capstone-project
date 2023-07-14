from flask import Blueprint, request
from flask_login import current_user, login_required
from app.models import Group, db, User, GroupMember
from app.forms import GroupForm
from .auth_routes import validation_errors_to_error_messages
from .AWS_helpers import get_unique_filename, upload_file_to_s3, remove_file_from_s3

group_routes = Blueprint("groups", __name__)

@group_routes.route('/current')
def get_current_groups():
    """
    This route will return a list of groups (and associated members) the current user is part of.
    """
    current_user_groups = Group.query.join(Group.group_members).filter(GroupMember.user_id == current_user.id).all()
    return {"user_groups":{group.id: group.to_dict() for group in current_user_groups} }


@group_routes.route('/new', methods=['POST'])
def create_group():
    """
    This route will create a new group and allow the logged in user to add members to it.
    """
    form = GroupForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    
    if not current_user.is_authenticated:
        return {'error': 'unauthorized access'}
    
    if form.validate_on_submit():
        # image = form.data["imageUrl"]
        # image.filename = get_unique_filename(image.filename)
        # upload = upload_file_to_s3(image)

        new_group = Group (
            group_name = form.data['group_name'],
            description = form.data['description'],
            # imageUrl = upload['url'],
            imageUrl = form.data['imageUrl'],
            creator_id = current_user.id
        )
        
        db.session.add(new_group)
        db.session.add(GroupMember(user=current_user, group=new_group))
        db.session.commit()
        return {"new_group": new_group.to_dict()}
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401
        
@group_routes.route('/members', methods=['POST'])
def add_members(groupId, usernames):
    group = Group.query.get(groupId)
    
    if current_user.id is not group.creator_id:
        return {'error': 'unathorized access'}, 403
    for username in usernames:
        user = User.query.filter_by(User.username==username).first()
        if user is None:
            return {"error": "user does not exist"}, 404
        db.session.add(GroupMember(user=user, group=group))
        db.session.commit()
        return {"group": group.to_dict()}

@group_routes.route('/members', methods=['DELETE'])
def remove_members(groupId, usernames):
    group = Group.query.get(groupId)
    
    if current_user.id is not group.creator_id:
        return {'error': 'unathorized access'}, 403
    for username in usernames:
        user = User.query.filter_by(User.username==username).first()
        if user is None:
            return {"error": "user does not exist"}, 404
        db.session.delete(user)
        db.session.commit()
        return {'message': 'Users successfully deleted'}, 200

@group_routes.route("/<int:groupId>/update", methods=['PUT'])
def update_group(groupId):
    group_to_update = Group.query.get(groupId)

    form = GroupForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    
    if form.validate_on_submit():
        group_to_update.description = form.data['description']
        db.session.commit()
        return {"updated group": group_to_update.to_dict()}
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401

@group_routes.route("/<int:groupId>/delete", methods=['DELETE'])
def delete_group(groupId):
    group_to_delete = Group.query.get(groupId)
    
    if current_user.id is not group_to_delete.creator_id:
        return {'error': 'unathorized access'}, 403
    db.session.delete(group_to_delete)
    return {'message': 'group successfully deleted'}, 200


    
    
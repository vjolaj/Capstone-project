from flask import Blueprint, request
from flask_login import current_user, login_required
from app.models import Group, db, User, GroupMember
# from app.forms import RestaurantForm, MenuItemForm, ReviewForm
from .auth_routes import validation_errors_to_error_messages

group_routes = Blueprint("groups", __name__)

@group_routes.route('/current')
def get_current_groups():
    """
    This route will return a list of groups the current user is part of.
    """
    current_user_groups = Group.query.join(Group.group_members).filter(GroupMember.user_id == current_user.id).all()
    return {"user_groups":{group.id: group.to_dict() for group in current_user_groups} }


# @group_routes.route('/post')
# def 
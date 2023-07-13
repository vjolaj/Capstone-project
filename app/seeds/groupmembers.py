from app.models import db, GroupMember, environment, SCHEMA
from sqlalchemy.sql import text


# Adds group members, you can add other group members here if you want
def seed_groupmembers(users, groups):
    groupmember1 = GroupMember(
        user=users[0],
        group=groups[0]
    )

    groupmember2 = GroupMember(
        user=users[1],
        group=groups[0]
    )

    groupmember3 = GroupMember(
        user=users[2],
        group=groups[0]
    )

    groupmember4 = GroupMember(
        user=users[3],
        group=groups[0]
    )

    groupmember5 = GroupMember(
        user=users[4],
        group=groups[0]
    )

    groupmember6 = GroupMember(
        user=users[0],
        group=groups[1]
    )

    groupmember7 = GroupMember(
        user=users[5],
        group=groups[1]
    )

    groupmember8 = GroupMember(
        user=users[6],
        group=groups[1]
    )

    group_members = [
        groupmember1,
        groupmember2,
        groupmember3,
        groupmember4,
        groupmember5,
        groupmember6,
        groupmember7,
        groupmember8
    ]
    for group_member in group_members:
        db.session.add(group_member)

    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the group_members table. SQLAlchemy doesn't
# have a built-in function to do this. With Postgres in production, TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto-incrementing primary key.
# CASCADE deletes any dependent entities. With SQLite3 in development, you need to use DELETE
# to remove all data, and it will reset the primary keys as well.
def undo_groupmembers():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.group_members RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM group_members"))

    db.session.commit()
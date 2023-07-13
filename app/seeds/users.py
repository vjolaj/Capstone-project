from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_users():
    demo = User(
        username='Demo', email='demo@aa.io', password='password', firstName='DemoFirst', lastName='DemoLast')
    amelia = User(
        username='amelia', email='amelia@aa.io', password='password', firstName='Amelia', lastName='Anderson')
    caleb = User(
        username='caleb', email='caleb@aa.io', password='password', firstName='Caleb', lastName='Johnson')
    ava = User(
        username='avad', email='ava@aa.io', password='password', firstName='Ava', lastName='David')
    charlotte = User(
        username='charlotte', email='charlotte@aa.io', password='password', firstName='Charlotte', lastName='Lewis')
    sophia = User(
        username='sophia', email='sophia@aa.io', password='password', firstName='Sophia', lastName='Hayes')
    mitchell = User(
        username='mitchell', email='mitchell@aa.io', password='password', firstName='Mitchell', lastName='Green')
    liam = User(
        username='liam', email='liam@aa.io', password='password', firstName='Liam', lastName='Turner')
    evelyn = User(
        username='evelyn', email='bobbie@aa.io', password='password', firstName='Evelyn', lastName='Reed')
    henry = User(
        username='henry', email='henry@aa.io', password='password', firstName='Henry', lastName='Walker')
    

    db.session.add(demo)
    db.session.add(amelia)
    db.session.add(caleb)
    db.session.add(ava)
    db.session.add(charlotte)
    db.session.add(sophia)
    db.session.add(mitchell)
    db.session.add(liam)
    db.session.add(evelyn)
    db.session.add(henry)
    
    db.session.commit()
    return [demo, amelia, caleb, ava, charlotte, sophia, mitchell, liam, evelyn, henry]

# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))
        
    db.session.commit()
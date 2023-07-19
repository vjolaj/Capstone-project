from app.models import db, Expense, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_expenses():
    expense1 = Expense(
        amount=30, creator_id=2, group_id=1, description='Lyft to the Louvre', category='Transportation', created_at=)
    expense2 = Expense(
        amount=33, creator_id=2, group_id=1, description='Breakfast', category='Food')
    expense3 = Expense(
        amount=145, creator_id=5, group_id=1, description='Dinner at La Poule', category='Food')
    expense4 = Expense(
        amount=50, creator_id=4, group_id=1, description='Uber from airport', category='Transportation')
    expense5 = Expense(
        amount=60, creator_id=3, group_id=1, description='Entrance to Museum', category='Entertainment')
    expense6 = Expense(
        amount=30, creator_id=3, group_id=1, description='Coffee and Croissants', category='Food')
    expense7 = Expense(
        amount=320, creator_id=2, group_id=1, description='Cabaret Show', category='Entertainment')
    expense8 = Expense(
        amount=24, creator_id=1, group_id=1, description='Crepes', category='Food')
    expense9 = Expense(
        amount=94, creator_id=1, group_id=2, description='Grocery Run', category='Food')
    expense10 = Expense(
        amount=50, creator_id=6, group_id=2, description='Wifi bill', category='Utilities')
    expense11 = Expense(
        amount=135, creator_id=6, group_id=2, description='Gas and Electric', category='Utilities')
    expense12 = Expense(
        amount=60, creator_id=7, group_id=2, description='Movie Theater Tickets', category='Entertainment')


    db.session.add(expense1)
    db.session.add(expense2)
    db.session.add(expense3)
    db.session.add(expense4)
    db.session.add(expense5)
    db.session.add(expense6)
    db.session.add(expense7)
    db.session.add(expense8)
    db.session.add(expense9)
    db.session.add(expense10)
    db.session.add(expense11)
    db.session.add(expense12)
    
    db.session.commit()
    # return [demo, amelia, caleb, ava, charlotte, sophia, mitchell, liam, evelyn, henry]

# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_expenses():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.expenses RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM expenses"))
        
    db.session.commit()
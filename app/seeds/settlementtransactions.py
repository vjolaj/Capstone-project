from app.models import db, SettlementTransaction, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_settlementtransactions():
    st1 = SettlementTransaction(
        payer_id= 1, payee_id= 2, group_id=1, amount=114.4, is_settled=True)
    st2 = SettlementTransaction(
        payer_id= 4, payee_id= 2, group_id=1, amount=88.4, is_settled=False)
    st3 = SettlementTransaction(
        payer_id= 3, payee_id= 2, group_id=1, amount=41.8, is_settled=False)
    st4 = SettlementTransaction(
        payer_id= 3, payee_id= 5, group_id=1, amount=6.6, is_settled=False)
    st5 = SettlementTransaction(
        payer_id= 7, payee_id= 6, group_id=2, amount=53, is_settled=False)
    st6 = SettlementTransaction(
        payer_id= 1, payee_id= 6, group_id=2, amount=19, is_settled=False)
    st7 = SettlementTransaction(
        payer_id= 10, payee_id= 1, group_id=3, amount=28, is_settled=True)
    st8 = SettlementTransaction(
        payer_id= 9, payee_id= 1, group_id=3, amount=4, is_settled=True)


    db.session.add(st1)
    db.session.add(st2)
    db.session.add(st3)
    db.session.add(st4)
    db.session.add(st5)
    db.session.add(st6)
    db.session.add(st7)
    db.session.add(st8)

    
    db.session.commit()

# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_settlementtransactions():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.settlement_transactions RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM settlement_transactions"))
        
    db.session.commit()
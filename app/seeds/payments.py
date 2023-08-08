from app.models import db, Payment, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_payments():
    payment1 = Payment(
        settlement_transaction_id= 1, payer_id= 1, payee_id= 2, group_id=1, amount=114.4, method='PayPal')
    payment2 = Payment(
        settlement_transaction_id= 7, payer_id= 10, payee_id= 1, group_id=3, amount=28, method='Cash')
    payment3 = Payment(
        settlement_transaction_id= 8, payer_id= 9, payee_id= 1, group_id=3, amount=4, method='Venmo')


    db.session.add(payment1)
    db.session.add(payment2)
    db.session.add(payment3)

    db.session.commit()

# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_payments():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.payments RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM payments"))
        
    db.session.commit()
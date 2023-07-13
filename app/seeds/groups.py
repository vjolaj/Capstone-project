from app.models import db, Group, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_groups():
    group1 = Group(
        group_name='Paris Trip', 
        description='July 05-12 Paris trip!',
        imageUrl='https://images.adsttc.com/media/images/5d44/14fa/284d/d1fd/3a00/003d/large_jpg/eiffel-tower-in-paris-151-medium.jpg?1564742900'
        )
    
    group2 = Group(
        group_name='58 Main Street', 
        description='Apt 28 residents, post any relevant bills here!', 
        imageUrl='https://media.istockphoto.com/id/486644087/photo/apartment-building.jpg?s=612x612&w=0&k=20&c=jFP_iJEQYphmb4BWP6KfFUNBdZaGUOe1N5xOo3icFQw='
    )

    db.session.add(group1)
    db.session.add(group2)

    
    db.session.commit()

    return [group1, group2]

# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_groups():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.groups RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM groups"))
        
    db.session.commit()
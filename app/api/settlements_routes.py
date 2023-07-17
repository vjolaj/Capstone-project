from flask import Blueprint, request
# from app.forms.settlement_transaction import SettlementTransactionForm
from flask_login import current_user, login_required
from app.models.settlement_transaction import SettlementTransaction, db

settlements_routes = Blueprint("settlements", __name__)

@settlements_routes.route("/<int:groupId>")
@login_required
def get_settlement_for_user(groupId):
    """
    This route gives the current user his different settlements needed
    Returns None if no settlements needed
    """
    user_settlements = SettlementTransaction.query.filter_by(payer_id=current_user.id).filter_by(group_id=groupId).filter_by(is_settled=False).all()
    # if user_settlements is None:
    #     return {}
    return {"settlements":{user_settlement.payee_id: user_settlement.amount for user_settlement in user_settlements}}


@settlements_routes.route("/<int:settlementTransactionId>", methods=['PUT'])
@login_required
def post_new_settlement(settlementTransactionId):
    """
    This route turns is_settled=True on the corresponding SettlementTransaction
    """
    settlement_transaction_to_update = SettlementTransaction.query.filter_by(id=settlementTransactionId).first()
    
    if current_user.id not in [settlement_transaction_to_update.payer_id, settlement_transaction_to_update.payee_id]:
        return {'error': 'not authorized'}

    settlement_transaction_to_update.is_settled = True
    db.session.commit()
    return {"settled_transaction": settlement_transaction_to_update.to_dict()}


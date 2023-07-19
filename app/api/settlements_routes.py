from flask import Blueprint, request
from app.forms.payment_form import PaymentForm
from app.models.payments import Payment
# from app.forms.settlement_transaction import SettlementTransactionForm
from flask_login import current_user, login_required
from app.models.settlement_transaction import SettlementTransaction, db
from .auth_routes import validation_errors_to_error_messages

settlements_routes = Blueprint("settlements", __name__)

@settlements_routes.route("/<int:groupId>")
@login_required
def get_settlement_for_user(groupId):
    """
    This route gives the current user his different settlements needed
    Returns None if no settlements needed
    """
    user_settlements = SettlementTransaction.query.filter_by(payer_id=current_user.id).filter_by(group_id=groupId).filter_by(is_settled=False).all()
    if not user_settlements:
        return {"settlements": ""}
    # return {"settlements":{user_settlement.payee_id: user_settlement.amount for user_settlement in user_settlements}}
    return {"settlements": {user_settlement.id: user_settlement.to_dict() for user_settlement in user_settlements}}


@settlements_routes.route("/<int:settlementTransactionId>", methods=['PUT'])
@login_required
def make_new_settlement(settlementTransactionId):
    """
    This route turns is_settled=True on the corresponding SettlementTransaction and records a payment on the Payment Table.
    """
    settlement_transaction_to_update = SettlementTransaction.query.filter_by(id=settlementTransactionId).first()
    form = PaymentForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        if current_user.id not in [settlement_transaction_to_update.payer_id, settlement_transaction_to_update.payee_id]:
            return {'error': 'not authorized'}
        new_payment = Payment(
            settlement_transaction_id = settlement_transaction_to_update.id,
            payer_id = settlement_transaction_to_update.payer_id,
            payee_id = settlement_transaction_to_update.payee_id,
            group_id = settlement_transaction_to_update.group_id,
            amount = settlement_transaction_to_update.amount,
            method = form.data['method'],
            paid_at = db.func.now()
        )
        db.session.add(new_payment)
        settlement_transaction_to_update.is_settled = True
        db.session.commit()
        return {"settled_payment": new_payment.to_dict()}
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401


@settlements_routes.route("/history")
@login_required
def get_payments_history():
    payments_paid = Payment.query.filter_by(payer_id=current_user.id).all()
    payments_received = Payment.query.filter_by(payee_id = current_user.id).all()
    user_payments = {
        "user_payments_paid": {payment.id: payment.to_dict() for payment in payments_paid},
        "user_payments_received": {payment.id: payment.to_dict() for payment in payments_received}
    }

    return user_payments
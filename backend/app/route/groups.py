from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app import models, schemas

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/")
def create_group(group: schemas.GroupCreate, db: Session = Depends(get_db)):
    #  Create group
    new_group = models.Group(name=group.name)
    db.add(new_group)
    db.commit()
    db.refresh(new_group)

    #  Create users and add to group
    for user in group.users:
        new_user = models.User(name=user.name)
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        link = models.GroupMember(group_id=new_group.id, user_id=new_user.id)
        db.add(link)

    db.commit()
    return {"group_id": new_group.id, "message": "Group created"}


@router.get("/{group_id}/balances")
def get_group_balances(group_id: int, db: Session = Depends(get_db)):
    users = db.query(models.User).all()
    user_map = {user.id: user.name for user in users}

    balances = {}

    # Fetch all expenses in the group
    expenses = db.query(models.Expense).filter(models.Expense.group_id == group_id).all()

    for exp in expenses:
        paid_by = exp.paid_by
        splits = db.query(models.ExpenseSplit).filter(models.ExpenseSplit.expense_id == exp.id).all()

        for split in splits:
            if split.user_id == paid_by:
                continue 
            balances.setdefault(split.user_id, {}).setdefault(paid_by, 0)
            balances[split.user_id][paid_by] += split.amount

    # Format output
    summary = []
    for debtor, creditors in balances.items():
        for creditor, amount in creditors.items():
            summary.append({
                "from": user_map[debtor],
                "to": user_map[creditor],
                "amount": round(amount, 2)
            })

    return summary

@router.get("/")
def get_all_groups(db: Session = Depends(get_db)):
    groups = db.query(models.Group).all()
    results = []
    for group in groups:
        members = db.query(models.GroupMember).filter_by(group_id=group.id).all()
        users = []
        for m in members:
            user = db.query(models.User).filter_by(id=m.user_id).first()
            users.append({"id": user.id, "name": user.name})

        results.append({
            "id": group.id,
            "name": group.name,
            "users": users
        })

    return results



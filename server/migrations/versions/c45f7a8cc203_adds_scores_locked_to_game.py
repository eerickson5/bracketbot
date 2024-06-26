"""adds scores_locked to game

Revision ID: c45f7a8cc203
Revises: a24336a1f43c
Create Date: 2024-05-19 09:26:35.754161

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c45f7a8cc203'
down_revision = 'a24336a1f43c'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('game', schema=None) as batch_op:
        batch_op.add_column(sa.Column('scores_locked', sa.Boolean(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('game', schema=None) as batch_op:
        batch_op.drop_column('scores_locked')

    # ### end Alembic commands ###

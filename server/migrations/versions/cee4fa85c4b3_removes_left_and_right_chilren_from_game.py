"""removes left and right chilren from game

Revision ID: cee4fa85c4b3
Revises: 3bb8ffadef00
Create Date: 2024-05-14 17:15:05.662343

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'cee4fa85c4b3'
down_revision = '3bb8ffadef00'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('game', schema=None) as batch_op:
        batch_op.drop_constraint('fk_game_right_previous_game_id_game', type_='foreignkey')
        batch_op.drop_constraint('fk_game_left_previous_game_id_game', type_='foreignkey')
        batch_op.drop_column('left_previous_game_id')
        batch_op.drop_column('right_previous_game_id')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('game', schema=None) as batch_op:
        batch_op.add_column(sa.Column('right_previous_game_id', sa.INTEGER(), nullable=True))
        batch_op.add_column(sa.Column('left_previous_game_id', sa.INTEGER(), nullable=True))
        batch_op.create_foreign_key('fk_game_left_previous_game_id_game', 'game', ['left_previous_game_id'], ['id'])
        batch_op.create_foreign_key('fk_game_right_previous_game_id_game', 'game', ['right_previous_game_id'], ['id'])

    # ### end Alembic commands ###

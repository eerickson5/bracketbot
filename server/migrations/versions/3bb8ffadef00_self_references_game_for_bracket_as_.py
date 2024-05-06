"""self-references game for bracket as binary tree

Revision ID: 3bb8ffadef00
Revises: ca46fe7f338a
Create Date: 2024-05-06 09:04:58.893088

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '3bb8ffadef00'
down_revision = 'ca46fe7f338a'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('game', schema=None) as batch_op:
        batch_op.add_column(sa.Column('next_game_id', sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('left_previous_game_id', sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('right_previous_game_id', sa.Integer(), nullable=True))
        batch_op.create_foreign_key(batch_op.f('fk_game_left_previous_game_id_game'), 'game', ['left_previous_game_id'], ['id'])
        batch_op.create_foreign_key(batch_op.f('fk_game_right_previous_game_id_game'), 'game', ['right_previous_game_id'], ['id'])
        batch_op.create_foreign_key(batch_op.f('fk_game_next_game_id_game'), 'game', ['next_game_id'], ['id'])

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('game', schema=None) as batch_op:
        batch_op.drop_constraint(batch_op.f('fk_game_next_game_id_game'), type_='foreignkey')
        batch_op.drop_constraint(batch_op.f('fk_game_right_previous_game_id_game'), type_='foreignkey')
        batch_op.drop_constraint(batch_op.f('fk_game_left_previous_game_id_game'), type_='foreignkey')
        batch_op.drop_column('right_previous_game_id')
        batch_op.drop_column('left_previous_game_id')
        batch_op.drop_column('next_game_id')

    # ### end Alembic commands ###
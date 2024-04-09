"""adds relationships to GameScore

Revision ID: 7cede7b410db
Revises: 89486277ae75
Create Date: 2024-04-09 12:01:48.628812

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '7cede7b410db'
down_revision = '89486277ae75'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('game_score', schema=None) as batch_op:
        batch_op.add_column(sa.Column('team_id', sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('game_id', sa.Integer(), nullable=True))
        batch_op.create_foreign_key(batch_op.f('fk_game_score_game_id_game'), 'game', ['game_id'], ['id'])
        batch_op.create_foreign_key(batch_op.f('fk_game_score_team_id_team'), 'team', ['team_id'], ['id'])

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('game_score', schema=None) as batch_op:
        batch_op.drop_constraint(batch_op.f('fk_game_score_team_id_team'), type_='foreignkey')
        batch_op.drop_constraint(batch_op.f('fk_game_score_game_id_game'), type_='foreignkey')
        batch_op.drop_column('game_id')
        batch_op.drop_column('team_id')

    # ### end Alembic commands ###

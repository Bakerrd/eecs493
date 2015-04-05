from flask import *

from ..models import *

index = Blueprint('index', __name__, template_folder='templates')

@index.route('/')
def index_route():
    careers = Careers.query.filter(Careers.salary>=100000)

    return render_template('base.html', careers=careers)
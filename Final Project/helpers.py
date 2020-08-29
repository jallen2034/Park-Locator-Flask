import os
import requests
import urllib.parse
import json

from flask import redirect, render_template, request, session
from functools import wraps

# function used by my application.py to verify app routes that require user login
def login_required(f):
    """
    Decorate routes to require login.

    http://flask.pocoo.org/docs/1.0/patterns/viewdecorators/
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get("user_id") is None:
            return redirect("/login")
        return f(*args, **kwargs)
    return decorated_function
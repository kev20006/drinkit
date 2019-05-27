import os
import unittest
import json

from app import app


# uri for test DB
# os.environ['MONGO_URI'] = "mongodb+srv://kev:22c2c119f3"+
#                           "@cluster0-nnrmm.mongodb.net/"+
#                           "testDB?retryWrites=true"


class BasicTests(unittest.TestCase):
    # Setup and teardown
    def setUp(self):
        app.config['TESTING'] = True
        app.config['WTF_CSRF_ENABLED'] = False
        app.config['DEBUG'] = False
        app.config['MONGO_URI'] = os.environ['MONGO_URI']
        self.app = app.test_client()

    def tearDown(self):
        pass

    # tests

    def test_main_page(self):
        response = self.app.get('/', follow_redirects=True)
        self.assertEqual(response.status_code, 200)

    def test_ingredients(self):
        response = self.app.get('/api/ingredients/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(json.loads(response.data)), 0)


unittest.main()

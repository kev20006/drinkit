import os
import unittest
import json

from app import app

from flask import session


class TestsGetRoutes(unittest.TestCase):
    # Setup and teardown
    def setUp(self):

        app.config['TESTING'] = True
        app.config['WTF_CSRF_ENABLED'] = False
        app.config['DEBUG'] = False
        self.app = app.test_client()

    def tearDown(self):
        pass

    # tests

    def test_main_page(self):
        # check that default route works
        response = self.app.get('/', follow_redirects=True)
        self.assertEqual(response.status_code, 200)
        # check that default route works (paginated)
        response = self.app.get('/1', follow_redirects=True)
        self.assertEqual(response.status_code, 200)
        # check that default route works (paginated)
        response = self.app.get('/1/recent', follow_redirects=True)
        self.assertEqual(response.status_code, 200)

    def test_user_profile(self):
        # test invalid route with no ID returns 400 error
        response = self.app.get('/user_profile/', follow_redirects=True)
        self.assertGreater(response.status_code, 400)
        # test invalid route with invalid ID returns 400 error
        response = self.app.get(
            '/user_profile/invalid_id', follow_redirects=True)
        self.assertGreater(response.status_code, 400)
        # test invalid route with valid but incorrect id returns 400 error
        response = self.app.get(
            '/user_profile/5c8d09761c9d44000012beea', follow_redirects=True)
        self.assertGreater(response.status_code, 400)
        # test route with valid ID returns success
        response = self.app.get(
            '/user_profile/5cab8f5907130600048685c4', follow_redirects=True)
        self.assertEqual(response.status_code, 200)

    def test_drink_profile(self):
        # test invalid route with no Id returns 400 error
        response = self.app.get(
            '/cocktails/', follow_redirects=True)
        self.assertGreater(response.status_code, 400)
        # test invalid route with invalid returns 400 error
        response = self.app.get(
            '/cocktails/invalid_id', follow_redirects=True)
        self.assertGreater(response.status_code, 400)
        # test invalid route with valid but incorrect id returns 400 error
        response = self.app.get(
            '/cocktails/5cab8f5907130600048685c4', follow_redirects=True)
        self.assertGreater(response.status_code, 400)
        # Test route with valid cocktail id returns success code
        response = self.app.get(
            '/cocktails/5c8d09761c9d44000012beea', follow_redirects=True)
        self.assertEqual(response.status_code, 200)

    def test_new_cocktail(self):
        with app.test_client() as client:
            with client.session_transaction() as session:
                session["username"] = "bob"
        # test default route works when logged in
        response = client.get('/cocktails/new', follow_redirects=True)
        self.assertEqual(response.status_code, 200)
        # test route without a session returns a 400 error
        response = self.app.get(
            '/cocktails/new', follow_redirects=True)
        self.assertGreater(response.status_code, 400)

    def test_edit_cocktail(self):
        # test route without a session returns a 400 error
        response = self.app.get(
            '/cocktail/edit/5c8d09761c9d44000012beea', follow_redirects=True)
        self.assertGreater(response.status_code, 400)
        # test route logged in as creator of cocktail - success
        with app.test_client() as client:
            with client.session_transaction() as session:
                session["_id"] = "5ca4ba55ec4ad1038c0c2ba1"
        response = client.get(
            '/cocktail/edit/5c8d09761c9d44000012beea', follow_redirects=True)
        self.assertEqual(response.status_code, 200)
        # test route logged in as not creator of cocktail - 400 error
        response = client.get(
            '/cocktail/edit/5cac488f140cb40004bf136b', follow_redirects=True)
        self.assertGreater(response.status_code, 400)
        # test route with an invalid cocktail id returns 400 error
        response = client.get(
            '/cocktail/edit/invalid', follow_redirects=True)
        self.assertGreater(response.status_code, 400)
        # test route with a valid but incorrect cocktail id returns 400 error
        response = client.get(
            '/cocktail/edit/5ca4ba55ec4ad1038c0c2ba1', follow_redirects=True)
        self.assertGreater(response.status_code, 400)

    if __name__ == '__main__':
        unittest.main()

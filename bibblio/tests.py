from django.test import TestCase, Client
from .models import User, Book, Shelf
from django.urls import reverse


# Create your tests here.
class BibblioTestCase(TestCase):
    def setUp(self) -> None:
        client = Client()
        user1 = User.objects.create(
            username="testuser", email="example@mail.com", password="testpassword"
        )

        # test image url from: https://www.mobileread.com/forums/showthread.php?t=222754
        book_read = Book.objects.create(
            title="book_read",
            authors="testauthor",
            publication_year=2021,
            cover_image_url="https://www.mobileread.com/forums/attachment.php?attachmentid=111282&d=1378756884",
        )

        book_to_read = Book.objects.create(
            title="book_to_read",
            authors="testauthor",
            publication_year=2021,
            cover_image_url="https://www.mobileread.com/forums/attachment.php?attachmentid=111282&d=1378756884",
        )

        book_reading = Book.objects.create(
            title="book_reading",
            authors="testauthor",
            publication_year=2021,
            cover_image_url="https://www.mobileread.com/forums/attachment.php?attachmentid=111282&d=1378756884",
        )

        bad_book_1 = Book.objects.create(
            title="bad_book_1",
            authors="testauthor",
            publication_year=2030,
            cover_image_url="https://www.mobileread.com/forums/attachment.php?attachmentid=111282&d=1378756884",
        )

        bad_book_2 = Book.objects.create(
            title="bad_book_2",
            authors="testauthor",
            publication_year=-1000,
            cover_image_url="https://www.mobileread.com/forums/attachment.php?attachmentid=111282&d=1378756884",
        )

        bad_book_3 = Book.objects.create(
            title="bad_book_3",
            authors="testauthor",
            publication_year=9,
            cover_image_url="https://www.mobileread.com/forums/attachment.php?attachmentid=111282&d=1378756884",
        )

        bad_book_4 = Book.objects.create(
            title="bad_book_4",
            authors="An! Incorrect Author",
            publication_year=2021,
            cover_image_url="https://www.mobileread.com/forums/attachment.php?attachmentid=111282&d=1378756884",
        )

        bad_book_5 = Book.objects.create(
            title="bad_book_5",
            authors="An Incorrect Authorlist, e. e. cummings",
            publication_year=2021,
            cover_image_url="https://www.mobileread.com/forums/attachment.php?attachmentid=111282&d=1378756884",
        )

        tricky_book_1 = Book.objects.create(
            title="tricky_book_1",
            authors="Author One,e. e. cummings",
            publication_year=2021,
            cover_image_url="https://www.mobileread.com/forums/attachment.php?attachmentid=111282&d=1378756884",
        )

        user1.books_read.add(book_read)
        user1.books_to_read.add(book_to_read)
        user1.books_reading.add(book_reading)

        guilty_pleasures = Shelf.objects.create(owner=user1, name="Guilty Pleasures")

        guilty_pleasures.books.add(book_read)
        guilty_pleasures.books.add(book_reading)

        academic_books = Shelf.objects.create(owner=user1, name="Academic Books")
        academic_books.books.add(book_to_read)

    def test_shelf_deletion(self):
        """Test that a shelf is deleted correctly"""
        user1 = User.objects.get(username="testuser")
        book_read = Book.objects.get(title="book_read")
        guilty_pleasures = Shelf.objects.get(name="Guilty Pleasures")
        guilty_pleasures.delete()
        self.assertEqual(book_read.in_shelf.count(), 0)
        self.assertEqual(user1.shelves.count(), 1)

    def test_user_creation(self):
        """Test that a user is created correctly"""
        user1 = User.objects.get(username="testuser")
        self.assertEqual(user1.username, "testuser")
        self.assertEqual(user1.email, "example@mail.com")
        self.assertEqual(user1.password, "testpassword")

    def test_user_books_read(self):
        """Test that a user can add books to their books_read list"""
        user1 = User.objects.get(username="testuser")
        book_read = Book.objects.get(title="book_read")
        self.assertEqual(user1.books_read.get(title="book_read"), book_read)
        self.assertEqual(user1.books_read.count(), 1)

    def test_book_users_read(self):
        """test that a user can be gotten from the books_read list"""
        book_read = Book.objects.get(title="book_read")
        user1 = User.objects.get(username="testuser")
        self.assertEqual(book_read.in_read.get(username="testuser"), user1)

    def test_user_books_to_read(self):
        """Test that a user can add books to their books_to_read list"""
        user1 = User.objects.get(username="testuser")
        book_to_read = Book.objects.get(title="book_to_read")
        self.assertEqual(user1.books_to_read.get(title="book_to_read"), book_to_read)
        self.assertEqual(user1.books_to_read.count(), 1)

    def test_book_users_to_read(self):
        """test that a user can be gotten from the books_to_read list"""
        user1 = User.objects.get(username="testuser")
        book_to_read = Book.objects.get(title="book_to_read")
        self.assertEqual(book_to_read.in_to_read.get(username="testuser"), user1)

    def test_user_books_reading(self):
        """Test that a user can add books to their books_reading list"""
        user1 = User.objects.get(username="testuser")
        book_reading = Book.objects.get(title="book_reading")
        self.assertEqual(user1.books_reading.get(title="book_reading"), book_reading)
        self.assertEqual(user1.books_reading.count(), 1)

    def test_book_users_reading(self):
        """test that a user can be gotten from the books_reading list"""
        user1 = User.objects.get(username="testuser")
        book_reading = Book.objects.get(title="book_reading")
        self.assertEqual(book_reading.in_reading.get(username="testuser"), user1)

    def test_invalid_books(self):
        """Test that books are correctly identified as invalid"""
        bad_book_1 = Book.objects.get(title="bad_book_1")
        bad_book_2 = Book.objects.get(title="bad_book_2")
        bad_book_3 = Book.objects.get(title="bad_book_3")
        bad_book_4 = Book.objects.get(title="bad_book_4")
        bad_book_5 = Book.objects.get(title="bad_book_5")
        tricky_book_1 = Book.objects.get(title="tricky_book_1")

        self.assertFalse(bad_book_1.is_valid())
        self.assertFalse(bad_book_2.is_valid())
        self.assertFalse(bad_book_3.is_valid())
        self.assertFalse(bad_book_4.is_valid())
        self.assertFalse(bad_book_5.is_valid())
        self.assertTrue(tricky_book_1.is_valid())

    def test_user_shelves(self):
        """Test that a user can create shelves"""
        user1 = User.objects.get(username="testuser")
        guilty_pleasures = Shelf.objects.get(name="Guilty Pleasures")
        academic_books = Shelf.objects.get(name="Academic Books")
        self.assertEqual(user1.shelves.get(name="Guilty Pleasures"), guilty_pleasures)
        self.assertEqual(user1.shelves.get(name="Academic Books"), academic_books)
        self.assertEqual(user1.shelves.count(), 2)

    def test_shelf_owner(self):
        """Test that a shelf has an owner"""
        user1 = User.objects.get(username="testuser")
        guilty_pleasures = Shelf.objects.get(name="Guilty Pleasures")
        academic_books = Shelf.objects.get(name="Academic Books")
        self.assertEqual(guilty_pleasures.owner, user1)
        self.assertEqual(academic_books.owner, user1)

    def test_shelf_books(self):
        """testing that shelves can get the number of books they contain"""
        guilty_pleasures = Shelf.objects.get(name="Guilty Pleasures")
        academic_books = Shelf.objects.get(name="Academic Books")

        guilty_pleasures_books = guilty_pleasures.books.all()
        self.assertEqual(guilty_pleasures_books.count(), 2)
        academic_books_books = academic_books.books.all()
        self.assertEqual(academic_books_books.count(), 1)

    def test_get_user_from_book_from_shelves(self):
        """Test that a user can be gotten from a book from a shelf"""
        academic_books = Shelf.objects.get(name="Academic Books")
        book_to_read = Book.objects.get(title="book_to_read")
        book_to_read_from_shelf = academic_books.books.first()
        user1 = User.objects.get(username="testuser")
        user1_from_book = book_to_read_from_shelf.in_to_read.first()

        self.assertEqual(user1_from_book, user1)
        self.assertEqual(book_to_read_from_shelf, book_to_read)

    # Client testing
    def test_home_page(self):
        """Test that the home page loads correctly"""
        response = self.client.get(reverse("index"))
        self.assertEqual(response.status_code, 200)

    def test_login_page(self):
        """Test that the login page loads correctly"""
        response = self.client.get(reverse("login"))
        self.assertEqual(response.status_code, 200)

    # selenium tests

from django.test import TestCase
from .models import User, Book, Shelf

# Create your tests here.
class BibblioTestCase(TestCase):

    def setUp(self) -> None:
        user1= User.objects.create(username="testuser", email="example@mail.com", password="testpassword")
        
        # test image url from: https://www.mobileread.com/forums/showthread.php?t=222754
        book_read = Book.objects.create(title="book_read", authors="testauthor", publication_year=2021, image_url="https://www.mobileread.com/forums/attachment.php?attachmentid=111282&d=1378756884")

        book_to_read = Book.objects.create(title="book_to_read", authors="testauthor", publication_year=2021, image_url="https://www.mobileread.com/forums/attachment.php?attachmentid=111282&d=1378756884")

        book_reading = Book.objects.create(title="book_reading", authors="testauthor", publication_year=2021, image_url="https://www.mobileread.com/forums/attachment.php?attachmentid=111282&d=1378756884")

        bad_book_1 = Book.objects.create(title="bad_book_1", authors="testauthor", publication_year=2030, image_url="https://www.mobileread.com/forums/attachment.php?attachmentid=111282&d=1378756884")

        bad_book_2 = Book.objects.create(title="bad_book_2", authors="testauthor", publication_year=-1000, image_url="https://www.mobileread.com/forums/attachment.php?attachmentid=111282&d=1378756884")

        bad_book_3 = Book.objects.create(title="bad_book_3", authors="testauthor", publication_year=999, image_url="https://www.mobileread.com/forums/attachment.php?attachmentid=111282&d=1378756884")

        user1.books_read.add(book_read)
        user1.books_to_read.add(book_to_read)
        user1.books_reading.add(book_reading)

        guilty_pleasures = Shelf.objects.create(owner=user1, name="Guilty Pleasures")

        guilty_pleasures.books.add(book_read)
        guilty_pleasures.books.add(book_reading)

        academic_books = Shelf.objects.create(owner=user1, name="Academic Books")
        academic_books.books.add(book_to_read)
    
    
    def test_user_creation(self):
        user1 = User.objects.get(username="testuser")
        self.assertEqual(user1.username, "testuser")
        self.assertEqual(user1.email, "example@mail.com")
        self.assertEqual(user1.password, "testpassword")

    def test_user_books_read(self):
        user1 = User.objects.get(username="testuser")
        book_read = Book.objects.get(title="book_read")
        self.assertEqual(user1.books_read.get(title="book_read"), book_read)
        self.assertEqual(user1.books_read.count(), 1)
    
    def test_book_users_read(self):
        book_read = Book.objects.get(title="book_read")
        user1 = User.objects.get(username="testuser")
        self.assertEqual(book_read.in_read.get(username="testuser"), user1)

    def test_user_books_to_read(self):
        user1 = User.objects.get(username="testuser")
        book_to_read = Book.objects.get(title="book_to_read")
        self.assertEqual(user1.books_to_read.get(title="book_to_read"), book_to_read)
        self.assertEqual(user1.books_to_read.count(), 1)
    
    def test_book_users_to_read(self):
        user1 = User.objects.get(username="testuser")
        book_to_read = Book.objects.get(title="book_to_read")
        self.assertEqual(book_to_read.in_to_read.get(username="testuser"), user1)
    
    def test_user_books_reading(self):
        user1 = User.objects.get(username="testuser")
        book_reading = Book.objects.get(title="book_reading")
        self.assertEqual(user1.books_reading.get(title="book_reading"), book_reading)
        self.assertEqual(user1.books_reading.count(), 1)
    
    def test_book_users_reading(self):
        user1 = User.objects.get(username="testuser")
        book_reading = Book.objects.get(title="book_reading")
        self.assertEqual(book_reading.in_reading.get(username="testuser"), user1)

    def test_invalid_books(self):
        bad_book_1 = Book.objects.get(title="bad_book_1")
        bad_book_2 = Book.objects.get(title="bad_book_2")
        bad_book_3 = Book.objects.get(title="bad_book_3")

        self.assertFalse(bad_book_1.is_valid())
        self.assertFalse(bad_book_2.is_valid())
        self.assertFalse(bad_book_3.is_valid())


    def test_user_shelves(self):
        user1 = User.objects.get(username="testuser")
        guilty_pleasures = Shelf.objects.get(name="Guilty Pleasures")
        academic_books = Shelf.objects.get(name="Academic Books")
        self.assertEqual(user1.shelves.get(name="Guilty Pleasures"), guilty_pleasures)
        self.assertEqual(user1.shelves.get(name="Academic Books"), academic_books)
        self.assertEqual(user1.shelves.count(), 2)
    

    def test_shelf_owner(self):
        user1 = User.objects.get(username="testuser")
        guilty_pleasures = Shelf.objects.get(name="Guilty Pleasures")
        academic_books = Shelf.objects.get(name="Academic Books")
        self.assertEqual(guilty_pleasures.owner, user1)
        self.assertEqual(academic_books.owner, user1)

    def test_user_shelves(self):
        user1 = User.objects.get(username="testuser")

        self.assertEquals(user1.shelves.count(), 2)
    
    def test_shelf_books(self):
        guilty_pleasures = Shelf.objects.get(name="Guilty Pleasures")
        academic_books = Shelf.objects.get(name="Academic Books")

        guilty_pleasures_books = guilty_pleasures.books.all()
        self.assertEqual(guilty_pleasures_books.count(), 2)
        academic_books_books = academic_books.books.all()
        self.assertEqual(academic_books_books.count(), 1)

    def test_get_user_from_book_from_shelves(self):
        book_read = Book.objects.get(title="book_read")
        self.assertEqual(book_read.in_shelf.get(owner__username="testuser").owner.username, "testuser")


    
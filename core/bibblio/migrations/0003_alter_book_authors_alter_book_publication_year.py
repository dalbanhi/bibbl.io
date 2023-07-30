# Generated by Django 4.2.2 on 2023-07-29 22:02

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("bibblio", "0002_alter_user_books_to_read"),
    ]

    operations = [
        migrations.AlterField(
            model_name="book",
            name="authors",
            field=models.TextField(blank=True, max_length=1000),
        ),
        migrations.AlterField(
            model_name="book",
            name="publication_year",
            field=models.IntegerField(blank=True),
        ),
    ]

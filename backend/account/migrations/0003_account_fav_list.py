# Generated by Django 2.1.5 on 2021-05-03 01:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0002_auto_20210502_2227'),
    ]

    operations = [
        migrations.AddField(
            model_name='account',
            name='fav_list',
            field=models.CharField(default='[]', max_length=100),
        ),
    ]

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.deletion import CASCADE
# Create your models here.

# in pg-admin it's name is router_user
# Extending the user class to gain access to it's methods
class User(AbstractUser):
    code = models.CharField(max_length=4, blank=False,unique=True)
    email = models.EmailField(max_length=20,blank=False,unique=True)
    password = models.CharField(max_length=255,blank=False)
    cin = models.CharField(max_length=8,blank=False,unique=True)
    username = models.CharField(max_length=20,blank=False)
    phone = models.IntegerField(blank=False)
    amount = models.FloatField(blank=False)
    #Defining the email as the Username
    USERNAME_FIELD = 'email'
    #We dont pass required fields
    REQUIRED_FIELDS = []

# in pg-admin it's name is router_transaction
class Transaction(models.Model):
    type = models.CharField(max_length=20, blank=False)
    user_id = models.IntegerField(blank=False)
    amount = models.FloatField(blank=False)
    rest = models.FloatField(blank=True)
    date = models.DateTimeField(auto_now_add=True, blank=False)
    reciever_id = models.IntegerField(blank=True)

# in pg-admin it's name is router_charityorganisations
class CharityOrganisations(models.Model):

    amount = models.FloatField(blank=False,default= 0)
    date = models.DateTimeField(auto_now_add=True, blank=False)
    organization = models.CharField(max_length=100, blank=False)
    info = models.CharField(max_length=250, blank=False)

# in pg-admin it's name is router_content
class content(models.Model):
    #Foreign key example
    charityorganisations = models.ForeignKey(CharityOrganisations, on_delete=models.CASCADE)
    cover = models.ImageField(blank=True)
    text = models.TextField(blank=False)

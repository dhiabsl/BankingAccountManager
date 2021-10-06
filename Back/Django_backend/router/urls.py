from django.urls import path
from .views import Recharge,GetTransactions, Sendcharity, ConetentView, CreateOrganisation, GetUsers, RegisterView, LoginView, RetrieveMoney, SendMoney, Transactions, UserView, LogoutView, GetOrganisations
 
# Defining the views for each route or path
urlpatterns = [ 
    path('register', RegisterView.as_view()),
    path('login', LoginView.as_view()),
    path('user', UserView.as_view()),
    path('logout', LogoutView.as_view()),
    path('SendMoney', SendMoney.as_view()),
    path('GetUsers', GetUsers.as_view()),
    path('RetrieveMoney', RetrieveMoney.as_view()),
    path('Sendcharity', Sendcharity.as_view()),
    path('Transactions', Transactions.as_view()),
    path('GetTransactions', GetTransactions.as_view()),
    path('CreateOrganisation', CreateOrganisation.as_view()),
    path('Content',ConetentView.as_view()),
    path('GetOrganisations',GetOrganisations.as_view()),
    path('recharge',Recharge.as_view())
]

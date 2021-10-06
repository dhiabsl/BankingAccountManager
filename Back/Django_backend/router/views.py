from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from .Router_Serializer import CharitySerializer, ContentSerializer, TransactionSerializer, UserSerializer
from .models import CharityOrganisations, Transaction, User, content
import jwt, datetime


# Create your views here.
class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
class LoginView(APIView):
    def post(self, request):
        email = request.data['email']
        password = request.data['password']

        user = User.objects.filter(email=email).first()

        if user is None:
            raise AuthenticationFailed('User not found!')

        if not user.check_password(password):
            raise AuthenticationFailed('Incorrect password!')

        payload = {
            'id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
            'iat': datetime.datetime.utcnow()
        }

        token = jwt.encode(payload, 'secret', algorithm='HS256')

        response = Response()

        response.set_cookie(key='jwt', value=token, httponly=True)
        response.data = {
            'id': user.id,
            'jwt': token
        }
        return response
class LogoutView(APIView):
    def post(self, request):
        response = Response()
        response.delete_cookie('jwt')
        response.data = {
            'message': 'success'
        }
        return response
class UserView(APIView):

    def post(self, request):
        payload = Check_user.post(self, request)
        user = User.objects.filter(id=payload['id']).first()
        serializer = UserSerializer(user)
        return Response(serializer.data)
class GetUsers(APIView):

    def post(self, request):
        print(request.data)
        if Check_user.post(self, request) is not None:
            user = User.objects.all()
            serializer = UserSerializer(user, many=True)
            # print(serializer.data)
        return Response(serializer.data)


class SendMoney(APIView):
    def post(self, request):
        payload = Check_user.post(self, request)
        E_id = payload['id'] #Getting the Emitteur ID 
        Money = request.data['Money'] #Getting the Amount Sended
        R_Code = request.data['code'] #Getting the Reciever code

        #Check if the User Reciever exists
        Reciever= UserSerializer(User.objects.filter(code=R_Code).first())

        if Reciever is None:
            raise AuthenticationFailed('User not found Wrong code sure!')

        #Grab everything from the emitter
        Emitter= UserSerializer(User.objects.filter(id=E_id).first())
        #Check if the emitter have that amount of money
        if Emitter.data['amount'] < Money or Reciever.data['id'] == E_id:
            print(E_id ," and ", Reciever.data['id'])
            data= {
                'Message' : "You dont have the amount to send OR same Account"
            }
        else :
            rest = Emitter.data['amount'] - Money
            newAmount = Reciever.data['amount'] + Money
            User.objects.filter(id = E_id).update(amount=rest)
            User.objects.filter(id = Reciever.data['id']).update(amount=newAmount)
            data = {
                "Rest":rest,
                "New Amount": newAmount,
                "Emitter Amount":Emitter.data['amount'],
                "Reciever Amount":Reciever.data['amount'],
                "type":"Sending",
                "emitter_id":E_id,
                "amount": Money,
                "rest":rest,
                "reciever_id":Reciever.data['id']
            }
            db = {
                    "type":"Sending",
                    "user_id":E_id,
                    "amount": Money,
                    "rest":rest,
                    "reciever_id":Reciever.data['id']
                }
            Transactions.post(self, db)

        return Response(data,status=status.HTTP_200_OK)
class RetrieveMoney(APIView):
    def post(self, request):
        payload = Check_user.post(self, request)
        id = payload['id'] #Get the user ID
        Money = request.data['Money'] #Get The Money to retrieve

        Emitter= UserSerializer(User.objects.filter(id=id).first())
        if Emitter.data['amount'] < Money:
            data= {
                'Message' : "You dont have the amount to send"
            }
        else :
            rest = Emitter.data['amount'] - Money
            User.objects.filter(id = id).update(amount=rest)
            data = {
                "Rest":rest,
                "Emitter Amount":Emitter.data['amount'],
            }
            db = {
                        "type":"Retrieve",
                        "emitter_id":id,
                        "amount": Money,
                        "rest":rest,
                    }
            Transactions.post(self, db)

        return Response(data,status=status.HTTP_200_OK)
class Recharge(APIView):
    def post(self, request):
        payload = Check_user.post(self, request)
        id = payload['id'] #Get the user ID
        Money = request.data['Money'] #Get The Money to retrieve

        Me= UserSerializer(User.objects.filter(id=id).first())
        newAmount = Me.data['amount'] + Money
        User.objects.filter(id = id).update(amount=newAmount)
        data = {
                "Recharg":Money,
                "Amount":newAmount,
            }
        db = {
                "type":"Retrieve",
                "user_id":id,
                "amount": Money,
                "rest":0,
                "reciever_id":0
            }
        Transactions.post(self, db)
        return Response(data,status=status.HTTP_200_OK)


class Charity(APIView):
    def post(self,request):
        #Check if authenticated
        payload = Check_user.post(self, request)

        charity = request.data['charity']
        charity_id = request.data['charity_id']
        charityday = request.data['charityday']
        submonth = request.data['submonth']
        CurrentDate = datetime.date.today().strftime("%d/%m/%Y")
        id_Donator = payload['id'] #Get the user ID
        counter = 0
        Reciever= CharitySerializer(CharityOrganisations.objects.filter(id=charity_id).first())
        Donator= UserSerializer(User.objects.filter(id=id_Donator).first())
        # print(CurrentDate," current:ch day ",charityday,"  :  ",submonth," sub : count " ,counter)
        # If the charity day comes and the sub times are still not reached
        if CurrentDate == charityday and submonth > counter:
            counter= counter + 1 
            # if we have the amount
            if charity < Donator.data['amount'] :
                rest = Donator.data['amount'] - charity
                newAmount = Reciever.data['amount'] + charity
                User.objects.filter(id = id_Donator).update(amount=rest)
                CharityOrganisations.objects.filter(id = Reciever.data['id']).update(amount=newAmount)
                data = {
                    "Message":"Thank you so much for the donation",
                    "We have":" not ready yet ",
                    "Donations Given": counter,
                    "Organisation Name" : Reciever.data['organization'],  
                    "Rest Subscription": submonth-counter,  
                    "You was having": Donator.data['amount'],
                    "Rest":rest,
                }
                db = {
                        "type":"Charity",
                        "user_id":id_Donator,
                        "amount": charity,
                        "rest":rest,
                        "reciever_id":charity_id
                    }
                Transactions.post(self, db)
                # print(data ," ",rest)
        else:
            data =  "Subscription ended or Still not your charity day"
        return Response(data, status = status.HTTP_200_OK)
class Sendcharity(APIView):
    def post(self,request):
        #Check if authenticated
        payload = Check_user.post(self, request)

        charity = request.data['charity']
        charity_id = request.data['charity_id']
        id_Donator = payload['id'] #Get the user ID
        Reciever= CharitySerializer(CharityOrganisations.objects.filter(id=charity_id).first())
        Donator= UserSerializer(User.objects.filter(id=id_Donator).first())
        if charity < Donator.data['amount'] :
                rest = Donator.data['amount'] - charity
                newAmount = Reciever.data['amount'] + charity
                User.objects.filter(id = id_Donator).update(amount=rest)
                CharityOrganisations.objects.filter(id = Reciever.data['id']).update(amount=newAmount)
                data = {
                    "Message":"Thank you so much for the donation",
                    "Organisation Name" : Reciever.data['organization'],  
                    "You was having": Donator.data['amount'],
                    "Rest":rest,
                }
                db = {
                        "type":"Charity",
                        "user_id":id_Donator,
                        "amount": charity,
                        "rest":rest,
                        "reciever_id":charity_id
                    }
                Transactions.post(self, db)
        else:
            data =  "Subscription ended or Still not your charity day"

        return Response(data, status = status.HTTP_200_OK)


class Transactions(APIView):
    def post(self, request):
        # print(request)
        serializer = TransactionSerializer(data=request)
        serializer.is_valid(raise_exception=True)
        serializer.save()
class GetTransactions(APIView):
    def post(self, request):
        payload = Check_user.post(self, request)
        user = Transaction.objects.filter(user_id=payload['id'])
        # print(payload['id'] ,"==", user_id )
        serializer = TransactionSerializer(user, many = True)
        # print(serializer.data)
        return Response(serializer.data)

class CreateOrganisation(APIView):
    def post(self, request):
        serializer = CharitySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
class GetOrganisations(APIView):

    def post(self, request):
        if Check_user.post(self, request) is not None:
            user = CharityOrganisations.objects.all()
            serializer = CharitySerializer(user, many=True)
            # print(serializer.data)
        return Response(serializer.data)
class ConetentView(APIView):
    def post(self, request):
        serializer = ContentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    def get(self, request):
        user = content.objects.all()
        # print("Something ---------------- : ", user)
        # If we dont use the many=true when dealing with a foriegn key will throw an error
        serializer = ContentSerializer(user, many=True)
        # print("Something 2 ---------------- : ", serializer.data)
        return Response(serializer.data)
    def update(self, request):
        serializer = ContentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

class Check_user():

    def post(self,request):
        token = request.data['jwt']
        print(token)

        if not token:
            raise AuthenticationFailed('Unauthenticated!')

        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
            # payload['id']
            return payload
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated!')

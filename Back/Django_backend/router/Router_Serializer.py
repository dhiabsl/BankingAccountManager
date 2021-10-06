from rest_framework import serializers
from .models import  CharityOrganisations, Transaction, User, content

 
 #Serializing the data is very important for data sécurity
class UserSerializer(serializers.ModelSerializer):
 
    class Meta:
        model = User
        fields = ('id','code','email','password','cin','username','phone','amount')
        #Hiding the password on any get request
        extra_kwargs = {
            'password': {'write_only': True}
        }
    
    #Increpting password
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance
        
class TransactionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Transaction
        fields = ('id','type','user_id','amount','rest','date','reciever_id')

class CharitySerializer(serializers.ModelSerializer):

    class Meta:
        model = CharityOrganisations
        fields = ('id','amount','date','organization','info')

class ContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = content
        fields = ('id','charityorganisations','cover','text')
from rest_framework import serializers

from account.models import Account


class RegistrationSerializer(serializers.ModelSerializer):


	class Meta:
		model = Account
		fields = ['username', 'password']
		extra_kwargs = {
				'password': {'write_only': True},
		}


	def	save(self):

		account = Account(
					username=self.validated_data['username']
				)
		password = self.validated_data['password']
		# password2 = self.validated_data['password2']
		# if password != password2:
		# 	raise serializers.ValidationError({'password': 'Passwords must match.'})
		account.set_password(password)
		account.save()
		return account


class AccountPropertiesSerializer(serializers.ModelSerializer):

	class Meta:
		model = Account
		fields = ['pk', 'username', 'fav_list']




class ChangePasswordSerializer(serializers.Serializer):

	old_password 				= serializers.CharField(required=True)
	new_password 				= serializers.CharField(required=True)
	confirm_new_password 		= serializers.CharField(required=True)

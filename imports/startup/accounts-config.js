import { Accounts } from 'meteor/accounts-base';

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY',
});

Accounts.config({
  forbidClientAccountCreation: true,
  sendVerificationEmail: false
});

Accounts.onLoginFailure(function (error) {
  Bert.alert(error.error.reason, 'danger');
});